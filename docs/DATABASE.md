# UIT Waifu Database

This document defines the database schema, extensions, and row-level security model for UIT Waifu.

The database is **Supabase PostgreSQL** with the **pgvector** extension for semantic search. All structured app data, document metadata, and embeddings live in the same Postgres instance so relational queries and vector retrieval stay close together.

---

## Extensions

Enable these before creating tables:

```sql
create extension if not exists "uuid-ossp";
create extension if not exists vector;
```

- `uuid-ossp` provides `uuid_generate_v4()` for primary keys.
- `vector` provides the `vector` column type and similarity operators used by RAG.

---

## Conventions

- Primary keys are `uuid`, defaulting to `uuid_generate_v4()`.
- `user_id` references `auth.users(id)` (Supabase Auth).
- Timestamps are `timestamptz`, defaulting to `now()`.
- Free-form structured data uses `jsonb`.
- Every user-owned table has row-level security (RLS) enabled.

---

## Tables

### profiles

One row per user, holding display and academic metadata.

```sql
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  major text,
  year int,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);
```

### conversations

A chat session. `mode` records which assistant mode the session uses (see [PROMPTS.md](./PROMPTS.md)).

```sql
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  mode text not null default 'general',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index conversations_user_id_idx on conversations (user_id, updated_at desc);
```

### messages

Individual chat messages. `role` is `user`, `assistant`, or `system`. `metadata` can store token counts, model id, retrieved source ids, etc.

```sql
create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index messages_conversation_id_idx on messages (conversation_id, created_at);
```

### documents

Metadata for an uploaded file. The file itself lives in Supabase Storage; `storage_path` points to it. `status` tracks the ingestion lifecycle.

```sql
create table documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  storage_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'ready', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index documents_user_id_idx on documents (user_id, created_at desc);
```

### document_chunks

Chunked document text with embeddings. `embedding` dimension must match the `EMBEDDING_MODEL` in use (1536 for OpenAI `text-embedding-3-small`).

```sql
create table document_chunks (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  metadata jsonb,
  embedding vector(1536),
  created_at timestamptz default now()
);
```

> If you change the embedding model, the vector dimension changes too. Re-embed existing chunks rather than mixing dimensions in one column.

### study_plans

```sql
create table study_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text,
  content jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### tasks

Academic tasks and deadlines.

```sql
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  due_at timestamptz,
  done boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### settings

Per-user app settings (preferred language, default mode, voice on/off).

```sql
create table settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);
```

### feedback

User-submitted feedback on responses.

```sql
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  message_id uuid references messages(id) on delete set null,
  rating text check (rating in ('up', 'down')),
  comment text,
  created_at timestamptz default now()
);
```

---

## Vector Search

A similarity-search function using cosine distance, scoped to the calling user.

```sql
create index document_chunks_embedding_idx
  on document_chunks
  using hnsw (embedding vector_cosine_ops);

create or replace function match_document_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  filter_user_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where filter_user_id is null or dc.user_id = filter_user_id
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
```

> The `<=>` operator is cosine distance. `1 - distance` gives a similarity score where higher is closer. Use an HNSW index for fast approximate search at scale; for small datasets a sequential scan is fine.

---

## Row-Level Security

Enable RLS on every user-owned table and restrict rows to their owner. Without these policies, the anon key could read every user's data.

```sql
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table study_plans enable row level security;
alter table tasks enable row level security;
alter table settings enable row level security;
alter table feedback enable row level security;
```

Owner-only policy pattern (repeat per table, adjusting the column):

```sql
create policy "own rows" on profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

`messages` is owned indirectly through its conversation:

```sql
create policy "own messages" on messages
  for all
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and c.user_id = auth.uid()
    )
  );
```

> The service role key **bypasses RLS**. Use it only in trusted server code (see [lib/supabase rules in STRUCTURE.md](./STRUCTURE.md)), never in the browser.

---

## Storage

Supabase Storage holds the raw uploaded files. Use a private bucket:

```txt
bucket: documents
public: false
```

Access files through signed URLs generated server-side. The `documents.storage_path` column stores the object key within this bucket.

---

## Migrations

Keep schema changes in versioned SQL files under `supabase/migrations/` (or `scripts/` for ad-hoc work). Never edit a shipped migration; add a new one. Apply with the Supabase CLI:

```bash
supabase db push
```

---

## Entity Overview

```txt
auth.users
  │
  ├── profiles            (1:1)
  ├── settings            (1:1)
  ├── conversations       (1:N)
  │     └── messages      (1:N)
  ├── documents           (1:N)
  │     └── document_chunks (1:N, holds embeddings)
  ├── study_plans         (1:N)
  ├── tasks               (1:N)
  └── feedback            (1:N)
```

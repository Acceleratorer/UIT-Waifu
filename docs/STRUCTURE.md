# UIT Waifu Project Structure

This document defines the recommended folder structure for UIT Waifu.

The structure is designed for a web-first AI companion with chat, RAG, document upload, memory, avatar UI, and future voice or Live2D features.

---

## Recommended Top-Level Structure

```txt
UIT-Waifu
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── chat/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── documents/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── api/
│       ├── chat/
│       │   └── route.ts
│       ├── documents/
│       │   ├── upload/
│       │   │   └── route.ts
│       │   └── search/
│       │       └── route.ts
│       ├── memory/
│       │   └── route.ts
│       └── health/
│           └── route.ts
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── chat/
│   ├── avatar/
│   ├── documents/
│   ├── dashboard/
│   └── settings/
│
├── features/
│   ├── chat/
│   ├── study/
│   ├── code-assistant/
│   ├── documents/
│   ├── rag/
│   ├── memory/
│   ├── avatar/
│   └── voice/
│
├── lib/
│   ├── ai/
│   ├── db/
│   ├── supabase/
│   ├── rag/
│   ├── prompts/
│   ├── storage/
│   ├── validators/
│   └── utils/
│
├── data/
│   ├── modes.ts
│   ├── subjects.ts
│   └── examples.ts
│
├── docs/
│   ├── ROADMAP.md
│   ├── STRUCTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── PROMPTS.md
│
├── public/
│   ├── images/
│   ├── avatars/
│   └── icons/
│
├── scripts/
│   ├── seed.ts
│   ├── ingest-documents.ts
│   └── create-embeddings.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── tsconfig.json
```

---

## App Directory

The `app/` directory contains routes, pages, layouts, and API handlers.

Recommended routes:

```txt
/
/chat
/dashboard
/documents
/settings
```

Recommended API routes:

```txt
/api/chat
/api/documents/upload
/api/documents/search
/api/memory
/api/health
```

Rules:

- Keep UI pages thin.
- Move business logic into `features/` or `lib/`.
- Keep API route handlers small.
- Validate all API inputs.

---

## Components Directory

The `components/` directory contains reusable UI components.

Suggested groups:

```txt
components/ui
components/layout
components/chat
components/avatar
components/documents
components/dashboard
components/settings
```

### components/ui

Reusable base UI components.

Examples:

```txt
button.tsx
card.tsx
input.tsx
dialog.tsx
tabs.tsx
textarea.tsx
```

### components/chat

Chat-specific components.

Examples:

```txt
chat-window.tsx
message-list.tsx
message-bubble.tsx
message-input.tsx
mode-selector.tsx
markdown-message.tsx
code-block.tsx
```

### components/avatar

Avatar and companion UI components.

Examples:

```txt
avatar-panel.tsx
avatar-expression.tsx
avatar-status.tsx
typing-indicator.tsx
mood-badge.tsx
```

### components/documents

Document upload and RAG UI.

Examples:

```txt
document-upload.tsx
document-list.tsx
document-card.tsx
document-query-box.tsx
source-snippet.tsx
```

---

## Features Directory

The `features/` directory groups feature-specific logic.

Recommended feature modules:

```txt
features/chat
features/study
features/code-assistant
features/documents
features/rag
features/memory
features/avatar
features/voice
```

Each feature can contain:

```txt
components/
hooks/
services/
types.ts
constants.ts
utils.ts
```

Example:

```txt
features/chat
├── components/
├── hooks/
├── services/
├── types.ts
├── constants.ts
└── utils.ts
```

---

## Lib Directory

The `lib/` directory contains shared infrastructure and business logic.

### lib/ai

LLM provider wrappers and generation logic.

Examples:

```txt
client.ts
stream.ts
providers.ts
types.ts
```

Responsibilities:

- Call LLM APIs
- Stream responses
- Normalize provider responses
- Handle provider errors

### lib/prompts

Prompt templates and assistant modes.

Examples:

```txt
base.ts
study.ts
code.ts
document.ts
project.ts
companion.ts
```

Rules:

- Keep prompts version-controlled.
- Separate prompts by mode.
- Avoid hardcoding prompts inside route handlers.

### lib/rag

RAG pipeline logic.

Examples:

```txt
chunk.ts
embed.ts
retrieve.ts
context.ts
answer.ts
```

Responsibilities:

- Chunk text
- Generate embeddings
- Store embeddings
- Search relevant chunks
- Build answer context

### lib/db

Database access layer.

Examples:

```txt
schema.ts
queries.ts
conversations.ts
documents.ts
messages.ts
```

### lib/supabase

Supabase clients.

Examples:

```txt
client.ts
server.ts
admin.ts
storage.ts
```

Rules:

- Never expose service role key to client.
- Use server-only admin client for protected operations.

### lib/storage

File upload and storage helpers.

Examples:

```txt
upload.ts
validate-file.ts
extract-text.ts
```

### lib/validators

Validation schemas.

Examples:

```txt
chat.ts
document.ts
user.ts
settings.ts
```

Use Zod or similar validation tools.

---

## Data Directory

The `data/` directory stores static configuration.

Examples:

```txt
modes.ts
subjects.ts
examples.ts
avatar-expressions.ts
```

Example mode config:

```ts
export const assistantModes = [
  {
    id: "study",
    label: "Study Tutor",
    description: "Explain concepts step by step",
  },
  {
    id: "code",
    label: "Code Debugger",
    description: "Debug and explain code",
  },
]
```

---

## Public Directory

The `public/` directory stores static assets.

Recommended structure:

```txt
public
├── images
├── avatars
│   ├── neutral.png
│   ├── happy.png
│   ├── thinking.png
│   ├── confused.png
│   └── excited.png
└── icons
```

For MVP, static images are enough.

Live2D or VRM assets should only be added after the core chat and RAG experience works.

---

## Scripts Directory

The `scripts/` directory contains developer scripts.

Examples:

```txt
seed.ts
ingest-documents.ts
create-embeddings.ts
clear-vector-store.ts
```

Use scripts for:

- Local seeding
- Test data generation
- Document ingestion
- Embedding creation
- Database cleanup

---

## Docs Directory

The `docs/` directory contains project documentation.

Current docs:

```txt
ROADMAP.md      phases and milestones
STRUCTURE.md    folders and naming
API.md          HTTP endpoints
DATABASE.md     schema, pgvector, and RLS
PROMPTS.md      prompt layers and modes
DEPLOYMENT.md   Cloudflare and Supabase setup
```

Recommended future docs:

```txt
RAG.md
AVATAR.md
VOICE.md
```

---

## Suggested Database Tables

Initial tables:

```txt
profiles
conversations
messages
documents
document_chunks
study_plans
tasks
settings
feedback
```

### profiles

Stores user profile data.

Fields:

```txt
id
user_id
display_name
avatar_url
major
year
created_at
updated_at
```

### conversations

Stores chat sessions.

Fields:

```txt
id
user_id
title
mode
created_at
updated_at
```

### messages

Stores chat messages.

Fields:

```txt
id
conversation_id
role
content
metadata
created_at
```

### documents

Stores uploaded document metadata.

Fields:

```txt
id
user_id
file_name
file_type
storage_path
status
created_at
updated_at
```

### document_chunks

Stores document chunks and embeddings.

Fields:

```txt
id
document_id
user_id
content
metadata
embedding
created_at
```

Example pgvector schema:

```sql
create table document_chunks (
  id uuid primary key,
  document_id uuid not null,
  user_id uuid not null,
  content text not null,
  metadata jsonb,
  embedding vector(1536),
  created_at timestamp default now()
);
```

---

## Naming Conventions

### Files

Use kebab-case for files:

```txt
chat-window.tsx
message-input.tsx
document-upload.tsx
avatar-panel.tsx
```

### Components

Use PascalCase for components:

```txt
ChatWindow
MessageInput
DocumentUpload
AvatarPanel
```

### Hooks

Use `use` prefix:

```txt
useChat
useDocuments
useAvatarState
useConversationHistory
```

### API Routes

Use REST-like paths:

```txt
/api/chat
/api/documents/upload
/api/documents/search
/api/memory
```

---

## Environment Variables

The canonical variable list lives in `.env.example` at the repo root and is documented in [DEPLOYMENT.md](./DEPLOYMENT.md#environment-variables). Names must match across `.env.example`, README, and DEPLOYMENT.

```env
NEXT_PUBLIC_APP_URL=https://accel.io.vn/waifu
NEXT_PUBLIC_BASE_PATH=/waifu
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://accel.io.vn/waifu
AI_PROVIDER=anthropic
OPENAI_API_KEY=
OPENROUTER_API_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_AUTH_TOKEN=
ANTHROPIC_BASE_URL=
EMBEDDING_MODEL=text-embedding-3-small
OPENROUTER_MODEL=google/gemini-2.0-flash-001
ANTHROPIC_MODEL=claude-haiku-4-5
ANTHROPIC_DEFAULT_OPUS_MODEL=
ANTHROPIC_DEFAULT_SONNET_MODEL=
ANTHROPIC_DEFAULT_HAIKU_MODEL=
APP_URL=https://accel.io.vn/waifu
```

Rules:

- `NEXT_PUBLIC_*` variables are visible to the browser. Never put a secret behind that prefix.
- Service role keys and AI provider keys must only be used server-side.
- pgvector lives in the same Supabase Postgres instance as `DATABASE_URL`, so no separate vector URL is needed.
- Never commit `.env.local`.

---

## Build Order

Recommended order for implementation:

```txt
1. app layout
2. landing page
3. chat page
4. chat components
5. basic AI route
6. prompt modes
7. Supabase setup
8. conversation history
9. document upload
10. RAG pipeline
11. avatar UI
12. voice features
```

---

## Reference-Informed Boundaries

The reference projects in [REFERENCE_STACKS.md](./REFERENCE_STACKS.md) show that companion apps stay maintainable when chat, runtime state, avatar rendering, memory, and external integrations are separate modules. UIT Waifu should keep these boundaries:

- `data/modes.ts` remains the public registry for mode labels, examples, prompt IDs, runtime hints, and UI metadata.
- `lib/prompts/` owns prompt construction only. It should not call providers, storage, or UI code.
- `lib/ai/` should normalize provider calls and streaming responses behind a small interface before more providers are added.
- `features/chat/` should own chat state, message reducers, and event handling once the current component-level logic grows.
- `features/avatar/` should own model loading, expression mapping, and avatar state. It should consume structured runtime events, not raw assistant text.
- `lib/memory/` should own saved preferences, user-controlled memory, and summarization rules once Supabase history begins.
- `lib/rag/` should own retrieval, chunk scoring, source formatting, and citation assembly.
- `services/` is reserved for future long-running runtimes such as Python voice, local inference, desktop, or stream integrations. Do not add it until the web app needs a process outside Next.js.

Stack guardrails:

- Do not migrate the main app to Vue/Vite during the MVP. AIRI and Sanbaka inform runtime architecture, plugin boundaries, and stage ideas.
- Do not add a monorepo until multiple independently shipped packages exist.
- Do not require local GPU, Python voice services, or persistent WebSocket infrastructure for the web MVP.

---

## Architecture Rules

- Keep route handlers thin.
- Keep prompts separate from business logic.
- Keep AI provider code replaceable.
- Keep RAG pipeline modular.
- Do not mix UI state with database logic.
- Do not expose private keys to the browser.
- Add advanced avatar features only after the chat/RAG core works.

---

## Minimum MVP Structure

If starting small, begin with this structure:

```txt
UIT-Waifu
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── chat/
│   │   └── page.tsx
│   └── api/
│       └── chat/
│           └── route.ts
│
├── components/
│   ├── chat/
│   └── avatar/
│
├── lib/
│   ├── ai/
│   └── prompts/
│
├── public/
│   └── avatars/
│
├── docs/
│   ├── ROADMAP.md
│   └── STRUCTURE.md
│
├── README.md
└── package.json
```

This is enough to ship the first version to `accel.io.vn/waifu`.

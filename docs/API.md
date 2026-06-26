# UIT Waifu API Reference

This document defines the HTTP API for UIT Waifu. Current production chat routes run as Cloudflare Pages Functions under `functions/api/`, with `/waifu/api/*` aliases for the production base path.

The API is the boundary between the frontend and the AI/data layers. Keep route handlers thin: validate input, call a `lib/` or `features/` service, return a typed response.

---

## Conventions

### Base URL

```txt
Local:      http://localhost:3000/api
Production:  https://accel.io.vn/waifu/api
```

### Content types

- Request and response bodies are JSON unless stated otherwise (file upload uses `multipart/form-data`).
- Streaming responses use `text/event-stream` (Server-Sent Events).

### Authentication

Protected routes require a valid Supabase session. The session is read server-side from the request cookies via the Supabase server client. Unauthenticated requests to protected routes return `401`.

Public routes: `/api/health`.
Protected routes: everything else once auth lands in Phase 3. Until then, routes may run unauthenticated in development only.

### Standard error shape

Every non-2xx response uses this body:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Human-readable description.",
    "details": []
  }
}
```

| HTTP status | `code`              | Meaning                                  |
| ----------- | ------------------- | ---------------------------------------- |
| 400         | `validation_error`  | Request body or query failed validation. |
| 401         | `unauthorized`      | Missing or invalid session.              |
| 403         | `forbidden`         | Authenticated but not allowed.           |
| 404         | `not_found`         | Resource does not exist.                 |
| 413         | `payload_too_large` | Upload exceeds the size limit.           |
| 415         | `unsupported_media` | File type not allowed.                   |
| 429         | `rate_limited`      | Too many requests.                       |
| 500         | `internal_error`    | Unexpected server error.                 |

### Rate limiting

AI and upload endpoints are rate limited per user (or per IP when anonymous). Rate-limited responses return `429` with a `Retry-After` header.

---

## Endpoints

### `GET /api/health`

Liveness check. Public, unauthenticated.

Response `200`:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "time": "2026-01-01T00:00:00.000Z"
}
```

---

### `POST /api/chat`

Send a conversation turn and stream back the assistant response.

Request body:

```json
{
  "conversationId": "uuid-or-null",
  "mode": "study",
  "messages": [
    { "role": "user", "content": "Explain inheritance in C++." }
  ]
}
```

| Field            | Type                 | Required | Notes                                                                 |
| ---------------- | -------------------- | -------- | --------------------------------------------------------------------- |
| `conversationId` | `string \| null`     | no       | If null, a new conversation is created and its id is returned.        |
| `mode`           | `string`             | yes      | One of the ids in `data/modes.ts`. Selects the prompt template.       |
| `messages`       | `Message[]`          | yes      | Ordered turns. Each `{ role: "user" \| "assistant", content: string }`. |

Response `200`: a `text/event-stream` of token deltas. Each event:

```txt
data: {"delta":"Inheritance "}

data: {"delta":"lets a class "}

data: {"done":true,"conversationId":"...","messageId":"..."}
```

The chat Function normalizes provider-specific streams into this `{ "delta": string }` shape. Supported providers:

| Provider | Env value | Required secret | Default model |
| -------- | --------- | --------------- | ------------- |
| Anthropic Claude or compatible proxy | `AI_PROVIDER=anthropic` or `AI_PROVIDER=claude` | `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` | `claude-haiku-4-5`, or proxy default via `ANTHROPIC_MODEL` |
| OpenRouter | `AI_PROVIDER=openrouter` | `OPENROUTER_API_KEY` | `google/gemini-2.0-flash-001` |

Errors: `400` invalid mode/messages, `401` unauthenticated, `429` rate limited.

---

### `POST /api/documents/upload`

Upload a document for RAG ingestion. `multipart/form-data`.

Form fields:

| Field  | Type   | Required | Notes                                  |
| ------ | ------ | -------- | -------------------------------------- |
| `file` | binary | yes      | PDF or DOCX for MVP. Max size enforced.|

Pipeline triggered on success: validate -> store in Supabase Storage -> insert `documents` row with `status = "processing"` -> enqueue text extraction and embedding.

Response `202`:

```json
{
  "documentId": "uuid",
  "fileName": "lecture-01.pdf",
  "status": "processing"
}
```

Errors: `413` too large, `415` unsupported type, `401` unauthenticated.

---

### `POST /api/documents/search`

Retrieve relevant chunks for a query (semantic search over `document_chunks`).

Request body:

```json
{
  "query": "What is the deadline for the final project?",
  "documentId": "uuid-or-null",
  "topK": 5
}
```

| Field        | Type             | Required | Notes                                               |
| ------------ | ---------------- | -------- | --------------------------------------------------- |
| `query`      | `string`         | yes      | Natural-language question.                          |
| `documentId` | `string \| null` | no       | Restrict search to one document. Null = all owned.  |
| `topK`       | `number`         | no       | Number of chunks to return. Default 5, max 20.      |

Response `200`:

```json
{
  "chunks": [
    {
      "id": "uuid",
      "documentId": "uuid",
      "content": "The final project is due...",
      "score": 0.82,
      "metadata": { "page": 4 }
    }
  ]
}
```

---

### `GET /api/memory`

List the current user's saved long-term memory items.

Response `200`:

```json
{
  "items": [
    { "id": "uuid", "type": "preference", "content": "Prefers Vietnamese explanations.", "createdAt": "..." }
  ]
}
```

### `POST /api/memory`

Create a memory item.

```json
{ "type": "study_goal", "content": "Pass the ML midterm." }
```

Response `201`: the created item.

### `DELETE /api/memory?id=uuid`

Delete a memory item the user owns. Response `204` no body.

Privacy: users can always delete their own memory. See [Security And Privacy](../README.md#security-and-privacy).

---

## Validation

All request bodies are validated with Zod schemas in `lib/validators/`. A validation failure returns `400` with `details` listing each field error:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request.",
    "details": [
      { "path": "mode", "message": "Unknown mode 'foo'." }
    ]
  }
}
```

---

## Versioning

The API is unversioned during MVP. Breaking changes before `1.0` are tracked in commit history. After `1.0`, breaking changes move under `/api/v2/...`.

---

## Reference-Informed API Direction

The reference stack study in [REFERENCE_STACKS.md](./REFERENCE_STACKS.md) points toward a provider-neutral runtime API. Keep the current `/api/chat` surface small and use explicit event types instead of provider-specific payloads.

Streaming event names should remain stable across providers:

```txt
delta       assistant text chunk
state       runtime status such as thinking, streaming, speaking, or error
avatar      expression, motion, gaze, or lip-sync hints
source      RAG citation or retrieved chunk metadata
memory      user-approved memory read or write notice
done        stream completed
error       typed failure visible to the client
```

Rules:

- Chat text, avatar state, RAG sources, memory changes, and tool results must be different fields or events.
- Voice endpoints should be separate from `/api/chat` unless they only submit transcribed text.
- Tool execution endpoints require authentication, rate limits, validation, and audit logs before they are exposed.
- External integrations such as Discord, Telegram, Twitch, or desktop clients should call the same normalized API instead of duplicating provider logic.

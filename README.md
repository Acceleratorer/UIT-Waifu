# UIT Waifu

<p align="center">
  <img src="./assets/att.F0MBbwrAbn2oo-j5xm8YI8flBLuD9GMJiho1CBtqSSo.jpeg" width="280px" alt="UIT Waifu 2D Demo" style="border-radius: 28px;" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Companion-ff69b4?style=for-the-badge" alt="AI Companion" />
  <img src="https://img.shields.io/badge/University-UIT-blue?style=for-the-badge" alt="UIT" />
  <img src="https://img.shields.io/badge/RAG-pgvector-336791?style=for-the-badge" alt="RAG pgvector" />
  <img src="https://img.shields.io/badge/Deploy-waifu.accel.io.vn-black?style=for-the-badge" alt="Deployment" />
  <img src="https://img.shields.io/badge/Status-In_Development-yellow?style=for-the-badge" alt="Status" />
</p>

<p align="center">
  <b>A web-first AI companion for University of Information Technology students.</b>
</p>

<p align="center">
  <i>Chat, study, debug code, understand documents, plan deadlines, and interact with a friendly digital companion.</i>
</p>

<p align="center">
  <a href="https://github.com/Acceleratorer/UIT-Waifu">
    <img src="https://img.shields.io/badge/GitHub-UIT--Waifu-black?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <a href="https://waifu.accel.io.vn">
    <img src="https://img.shields.io/badge/Target-waifu.accel.io.vn-ff69b4?style=for-the-badge" alt="Target Domain" />
  </a>
</p>

---

## Overview

**UIT Waifu** is a web-first AI companion designed for students at the **University of Information Technology**.

The project is not only a chatbot. It is planned as a complete AI companion system with chat, RAG-based document understanding, coding help, study planning, memory, voice features, and an expressive avatar interface.

The first goal is to build a useful MVP that runs at:

```txt
https://waifu.accel.io.vn
```

The product direction is simple:

```txt
Useful first. Cute second. Scalable later.
```

---

## Product Direction

UIT Waifu should feel like a friendly digital companion, but the core value must come from real academic and productivity workflows.

The assistant should help students:

- Understand difficult programming and AI concepts.
- Debug code and explain errors.
- Summarize lecture documents.
- Ask questions from uploaded PDFs and notes.
- Create study plans and project roadmaps.
- Track academic tasks and deadlines.
- Interact through a friendly character interface.
- Use Vietnamese and English naturally.

The MVP should be lightweight and web-first. Advanced avatar, voice, Live2D, VRM, desktop, Discord, Telegram, and local LLM features can be added gradually after the core assistant works well.

---

## Core MVP

The first production-ready version should include:

- Landing page for `waifu.accel.io.vn`
- Chat interface
- Streaming AI responses
- Markdown and code block rendering
- Study mode
- Code debugging mode
- Document Q&A mode
- Simple avatar or character panel
- User settings
- Supabase database setup
- pgvector-based document retrieval
- Basic deployment on Cloudflare Pages

---

## Feature Pillars

### 1. Chat Companion

UIT Waifu should support natural multi-turn conversations.

Planned chat features:

- Friendly personality
- Vietnamese and English support
- Conversation history
- Mode switching
- Markdown rendering
- Code formatting
- Safety and factuality reminders
- Short-term session context

Example prompts:

```txt
Explain inheritance in C++ like I am preparing for an OOP exam.
Help me debug this SQL query.
Create a study plan for my machine learning test.
Summarize this university announcement.
```

### 2. Study Assistant

Academic support should be the main value.

Topics:

- Programming fundamentals
- Object-Oriented Programming
- Data Structures and Algorithms
- Database Systems
- Computer Networks
- Operating Systems
- Artificial Intelligence
- Machine Learning
- Deep Learning
- Data Science
- Mathematics
- Software Engineering
- Web Development
- MLOps

Study features:

- Explain concepts step by step
- Generate examples
- Create quizzes
- Build flashcards
- Summarize lessons
- Prepare exam revision plans
- Give hints before full solutions

### 3. Coding Assistant

Coding support should be practical and clear.

Features:

- Explain code logic
- Debug runtime errors
- Explain compiler errors
- Review SQL queries
- Analyze time complexity
- Suggest better implementations
- Refactor messy code
- Generate starter code
- Add comments and documentation

Supported languages can include C, C++, Python, Java, JavaScript, TypeScript, SQL, and Bash.

### 4. Document AI And RAG

UIT Waifu should understand uploaded academic documents.

Supported documents later:

- PDF lectures
- Word documents
- PowerPoint slides
- Excel schedules
- Course materials
- University announcements
- Student regulation documents
- Project requirement files

RAG actions:

- Upload document
- Extract text
- Split into chunks
- Generate embeddings
- Store chunks in pgvector
- Retrieve relevant context
- Answer questions from documents
- Summarize document content
- Extract deadlines and important dates

### 5. Character Interface

The companion should eventually have a character interface.

Phase 1 avatar:

- Static character image
- Expression states
- Typing animation
- Chat bubble style UI

Phase 2 avatar:

- Multiple expressions
- Mood state
- Reaction based on user input
- Lightweight animation

Phase 3 avatar:

- Live2D or VRM support
- Auto blink
- Idle movement
- Lip sync
- Voice response

### 6. Memory And Personalization

Memory should improve usefulness without making the product creepy.

Memory layers:

- Short-term chat context
- Saved user preferences
- Study goals
- Course list
- Uploaded document history
- Long-term semantic memory with user control

Privacy rules:

- Let users delete memory.
- Do not store unnecessary sensitive data.
- Keep private documents private.
- Do not put private user data on-chain.

### 7. Voice Features

Voice should be added after chat and RAG are stable.

Possible voice stack:

- Browser speech recognition for MVP
- Whisper-compatible STT later
- OpenAI TTS, ElevenLabs, or edge-tts for voice output
- Voice activity detection later
- Lip sync after avatar is ready

---

## Recommended Stack

Recommended MVP stack:

```txt
Frontend: Next.js + React + TypeScript + Tailwind CSS + ShadCN UI
Backend MVP: Next.js API Routes or Cloudflare Workers
Backend later: FastAPI microservice
Database: Supabase PostgreSQL
Vector Search: Supabase pgvector
Storage: Supabase Storage
Auth: Supabase Auth or NextAuth.js
AI Provider: OpenAI API, OpenRouter, Gemini, or compatible LLM provider
Deployment: Cloudflare Pages
Production Domain: waifu.accel.io.vn
```

Why this stack:

- Easy to deploy.
- Good for web-first MVP.
- Supports chat, RAG, auth, storage, and future expansion.
- pgvector keeps relational data and semantic search close together.
- Cloudflare Pages fits the current domain/DNS setup.

---

## System Architecture

```txt
User
 │
 ▼
waifu.accel.io.vn
 │
 ▼
Next.js Frontend
 │
 ├── Landing Page
 ├── Chat UI
 ├── Avatar Panel
 ├── Document Upload
 ├── Study Dashboard
 └── Settings
 │
 ▼
API Layer
 │
 ├── /api/chat
 ├── /api/documents/upload
 ├── /api/documents/search
 ├── /api/memory
 ├── /api/profile
 └── /api/tools
 │
 ▼
AI Layer
 │
 ├── Prompt Manager
 ├── LLM Provider
 ├── RAG Retriever
 ├── Memory Retriever
 └── Tool Router
 │
 ▼
Data Layer
 │
 ├── Supabase PostgreSQL
 ├── Supabase pgvector
 ├── Supabase Storage
 └── Redis optional
```

---

## Database Strategy

UIT Waifu should use a hybrid database architecture.

```txt
Core app data: Supabase PostgreSQL
Semantic retrieval: Supabase pgvector
File uploads: Supabase Storage
Caching later: Redis
Blockchain: optional proof layer only, not core database
```

### PostgreSQL

Stores structured app data:

- Users
- Profiles
- Conversations
- Messages
- Documents
- Study plans
- Tasks
- Courses
- Notes
- Settings
- Feedback

### pgvector

Stores embeddings for semantic search:

- Document chunks
- Lecture notes
- Announcements
- Course materials
- Saved notes
- Long-term memory items

### Object Storage

Stores uploaded files:

- PDFs
- Slides
- Images
- Audio files
- Generated artifacts

### Blockchain Optional Layer

Blockchain is not recommended as the core database because private academic data must be editable, deletable, fast to query, and private.

It may be explored later only for optional proof features:

- Learning milestone certificates
- Public achievement records
- Contribution proof
- Project submission proof

---

## RAG Pipeline

```txt
Document Upload
      │
      ▼
File Validation
      │
      ▼
Text Extraction
      │
      ▼
Text Cleaning
      │
      ▼
Chunking
      │
      ▼
Embedding Generation
      │
      ▼
Store In pgvector
      │
      ▼
Semantic Retrieval
      │
      ▼
Context Building
      │
      ▼
LLM Answer Generation
      │
      ▼
Grounded Answer
```

---

## Deployment Plan

Target production domain:

```txt
https://waifu.accel.io.vn
```

Recommended Cloudflare setup:

```txt
Cloudflare Pages project: UIT-Waifu
Custom domain: waifu.accel.io.vn
DNS record: CNAME waifu -> <cloudflare-pages-project>.pages.dev
```

Recommended deployment path:

1. Build the MVP as a Next.js web app.
2. Connect GitHub repository to Cloudflare Pages.
3. Add environment variables.
4. Add custom domain `waifu.accel.io.vn`.
5. Verify DNS and SSL.
6. Add Supabase connection.
7. Add document upload and RAG.

---

## Documentation

Detailed working documents:

- [Features](./docs/FEATURES.md) — detailed feature catalogue by pillar
- [Roadmap](./docs/ROADMAP.md) — phases and milestones
- [Project Structure](./docs/STRUCTURE.md) — folders and naming
- [API Reference](./docs/API.md) — HTTP endpoints
- [Database](./docs/DATABASE.md) — schema, pgvector, and RLS
- [Prompts](./docs/PROMPTS.md) — prompt layers and modes
- [Deployment](./docs/DEPLOYMENT.md) — Cloudflare and Supabase setup
- [Contributing](./CONTRIBUTING.md) — setup, conventions, and PR flow

---

## Getting Started

> The application is being built phase by phase (see [docs/ROADMAP.md](./docs/ROADMAP.md)). The repo currently holds the planning docs; the commands below apply once the Phase 1 app code lands. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full developer setup.

Clone the repository:

```bash
git clone https://github.com/Acceleratorer/UIT-Waifu.git
cd UIT-Waifu
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env.local   # then fill in values
```

Run development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. The canonical list lives in [`.env.example`](./.env.example) and [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md); keep all three in sync.

```env
# App
NEXT_PUBLIC_APP_URL=https://waifu.accel.io.vn

# Supabase (NEXT_PUBLIC_* are exposed to the browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://waifu.accel.io.vn

# AI provider (set the one you use)
OPENAI_API_KEY=
OPENROUTER_API_KEY=
EMBEDDING_MODEL=text-embedding-3-small
```

pgvector lives in the same Supabase Postgres instance as the relational data, so `DATABASE_URL` covers both — there is no separate vector database URL. Never commit `.env.local` or real keys.

---

## Prompt Direction

Base personality:

```txt
You are UIT Waifu, a friendly AI companion for students at the University of Information Technology.
You help with studying, programming, documents, schedules, and university life.
You are warm, supportive, practical, and clear.
You can be playful, but usefulness and accuracy come first.
You support Vietnamese and English.
You explain with examples when helpful.
You avoid pretending to know official university information without sources.
```

Prompt modes:

- General chat
- Study tutor
- Code debugging
- Document Q&A
- Exam revision
- Project planning
- Friendly companion

---

## Development Roadmap

The working roadmap is maintained in:

```txt
docs/ROADMAP.md
```

High-level phases:

```txt
Phase 1: Landing page + chat MVP
Phase 2: Study and code assistant modes
Phase 3: Supabase + auth + conversation history
Phase 4: Document upload + RAG
Phase 5: Avatar UI and expression states
Phase 6: Voice input/output
Phase 7: Live2D or VRM experiments
Phase 8: Discord, Telegram, desktop, local LLM experiments
```

---

## Development Principles

- Build useful features before flashy features.
- Keep the MVP small and deployable.
- Keep AI prompts version-controlled.
- Keep private data private.
- Make each feature testable.
- Prefer simple architecture first.
- Add Live2D, voice, and desktop only after chat and RAG work well.

---

## Security And Privacy

Security principles:

- Never commit API keys.
- Keep service role keys server-side only.
- Validate uploaded files.
- Sanitize user input.
- Apply rate limits to AI endpoints.
- Protect user conversations and documents.

Privacy principles:

- Do not expose uploaded documents.
- Let users delete memories and documents.
- Store only useful data.
- Keep private academic data off-chain.
- Clearly mark AI-generated content.

---

## Contributors

<a href="https://github.com/Acceleratorer">
  <img src="https://github.com/Acceleratorer.png" width="60px;" alt="Acceleratorer" style="border-radius: 50%; margin-right: 8px;" />
</a>
<a href="https://github.com/krm1Dre4m">
  <img src="https://github.com/krm1Dre4m.png" width="60px;" alt="krm1Dre4m" style="border-radius: 50%; margin-right: 8px;" />
</a>
<a href="https://github.com/1zuki">
  <img src="https://github.com/1zuki.png" width="60px;" alt="1zuki" style="border-radius: 50%;" />
</a>

---

## License

This project is licensed under the MIT License.

---

## Disclaimer

UIT Waifu is an independent student project.

This project is not officially affiliated with the University of Information Technology or Vietnam National University Ho Chi Minh City.

Important academic and administrative information should always be verified through official university sources.

---

## Contact

```txt
GitHub: https://github.com/Acceleratorer
Repository: https://github.com/Acceleratorer/UIT-Waifu
Production target: https://waifu.accel.io.vn
```

---

<p align="center">
  Made with love for UIT students.
</p>

<p align="center">
  <b>UIT Waifu — AI companion for studying, coding, productivity, and university life.</b>
</p>

# UIT Waifu Roadmap

This roadmap defines how UIT Waifu should grow from a small web chatbot into a full AI companion for UIT students.

The main principle:

```txt
Useful first. Cute second. Scalable later.
```

---

## Phase 0: Product Definition

Goal: define what UIT Waifu is before building too many features.

Tasks:

- [x] Define the main user: UIT student
- [x] Define the main use cases
- [x] Define assistant personality
- [x] Define MVP scope
- [x] Define deployment target: `accel.io.vn/waifu`
- [x] Define database strategy
- [x] Define privacy rules

Deliverables:

- [x] README updated
- [x] ROADMAP.md created
- [x] STRUCTURE.md created
- [x] API.md, DATABASE.md, PROMPTS.md, DEPLOYMENT.md created
- [x] CONTRIBUTING.md, .env.example, .gitignore added
- [ ] Initial project board or issue list

---

## Phase 1: Landing Page And Chat MVP

Goal: deploy the first working version of UIT Waifu.

Core features:

- [x] Next.js app setup
- [x] Tailwind CSS setup
- [x] ShadCN UI setup
- [x] Landing page
- [x] Chat page
- [x] Settings page
- [x] Message input
- [x] Message list
- [x] Loading state
- [x] Markdown rendering
- [x] Code block rendering
- [x] Basic AI API route
- [x] Basic system prompt
- [x] Cloudflare Pages routing and Functions wiring
- [x] Public path prepared: `/waifu`
- [x] Production deployment at `accel.io.vn/waifu`

Recommended routes:

```txt
/
/chat
/settings
```

Success criteria:

- [x] Local Pages runtime serves `/waifu`
- [x] Local Pages runtime serves `/waifu/chat`
- [x] Local Pages runtime serves `/waifu/settings`
- [x] Chat request validation returns structured errors
- [x] Responses support Markdown and code blocks
- [x] Production URL `https://accel.io.vn/waifu` is deployed and verified
- [ ] Production chat response is verified with a real provider key

---

## Phase 2: Assistant Modes

Goal: make UIT Waifu useful for real student workflows.

Modes:

- [x] General chat
- [x] Study tutor
- [x] Code debugging
- [x] Document Q&A placeholder
- [x] Exam revision
- [x] Project planning
- [x] Runtime metadata for behavior, retrieval policy, tool policy, and avatar hints

Study tutor features:

- [x] Explain concepts step by step
- [x] Generate examples
- [x] Generate practice questions
- [x] Give hints before full answer
- [x] Summarize lessons

Code assistant features:

- [x] Explain code
- [x] Debug errors
- [x] Analyze complexity
- [x] Refactor code
- [x] Review SQL queries

Success criteria:

- [x] User can choose assistant mode
- [x] Each mode uses a different prompt template
- [x] Each mode exposes structured runtime metadata for UI and future agent behavior
- [x] Runtime metadata is included in prompt composition
- [x] Chat provider stream is normalized for OpenRouter and Anthropic Claude
- [ ] Code answers are verified against a real provider response

---

## Phase 3: Supabase, Auth, And Conversation History

Goal: persist user data safely.

Database setup:

- [ ] Create Supabase project
- [ ] Configure PostgreSQL
- [ ] Configure Supabase Auth or NextAuth
- [x] Create profiles table migration
- [x] Create conversations table migration
- [x] Create messages table migration
- [x] Add row-level security policy migration
- [ ] Apply schema and RLS to production Supabase
- [x] Add production Supabase preflight and RLS verification query

Auth features:

- [x] Magic-link sign in UI
- [x] Local sign out
- [x] User profile
- [x] Protected chat history UI states
- [ ] Production auth flow verified against Supabase

Conversation features:

- [x] Save conversations from completed chat turns
- [x] Load previous conversations
- [x] Delete conversations
- [x] Rename conversations
- [x] Export and wipe saved account data
- [ ] Production history persistence verified against Supabase RLS

Success criteria:

- [ ] User can sign in in production
- [ ] Messages are saved in production
- [ ] User can reopen chat history in production

---

## Phase 4: Document Upload And RAG

Goal: let users ask questions from uploaded documents.

Upload pipeline:

- [ ] Add document upload UI
- [ ] Validate file type
- [ ] Validate file size
- [ ] Upload file to Supabase Storage
- [ ] Store document metadata in PostgreSQL

Text extraction:

- [ ] Extract PDF text
- [ ] Extract DOCX text
- [ ] Extract PPTX text later
- [ ] Extract XLSX schedules later

RAG pipeline:

- [ ] Clean extracted text
- [ ] Split into chunks
- [ ] Generate embeddings
- [ ] Store chunks in pgvector
- [ ] Search relevant chunks
- [ ] Build context
- [ ] Generate grounded answer
- [ ] Return source snippets

Tables:

```txt
documents
document_chunks
```

Success criteria:

- User can upload a PDF
- User can ask questions about that PDF
- Answer uses retrieved document context

---

## Phase 5: Simple Avatar Interface

Goal: make the assistant feel like a companion without overcomplicating the MVP.

Avatar MVP:

- [x] Static character image
- [x] First Three.js GLB model test on chat stage
- [ ] Expression states
- [ ] Thinking animation
- [ ] Typing animation
- [ ] Response-based mood state

Expression examples:

```txt
neutral
happy
thinking
confused
excited
sleepy
```

UI ideas:

- [ ] Avatar panel on desktop
- [ ] Compact avatar bubble on mobile
- [ ] Expression changes based on mode
- [ ] Small idle animation

Success criteria:

- Chat UI feels character-driven
- Avatar reacts to user/assistant state
- Still lightweight and fast

---

## Phase 6: Voice Input And Output

Goal: add voice interaction after text chat works well.

Voice input:

- [ ] Browser speech recognition MVP
- [ ] Push-to-talk button
- [ ] Transcript preview
- [ ] Send transcript to chat

Voice output:

- [ ] TTS provider integration
- [ ] Play assistant response
- [ ] Voice settings
- [ ] Stop audio button

Later voice upgrades:

- [ ] Whisper-compatible STT
- [ ] Voice activity detection
- [ ] Streaming TTS
- [ ] Lip sync hooks

Success criteria:

- User can talk to UIT Waifu
- UIT Waifu can answer with voice

---

## Phase 7: Live2D Or VRM Experiments

Goal: upgrade from static avatar to interactive character.

Live2D path:

- [ ] Research Live2D web rendering
- [ ] Add Live2D model loader
- [ ] Add expression control
- [ ] Add auto blink
- [ ] Add idle movement
- [ ] Add mouth movement hooks

VRM path:

- [x] Research Three.js/browser model rendering
- [x] Load web-ready GLB model
- [ ] Convert/test PMX drops for web use
- [ ] Load VRM model
- [ ] Add idle animation
- [ ] Add look-at behavior
- [ ] Add expression controls

Success criteria:

- Avatar can render in browser
- Expression can be controlled by app state
- Performance remains acceptable

---

## Phase 8: Advanced Integrations

Goal: expand UIT Waifu beyond the website.

Possible integrations:

- [ ] Discord bot
- [ ] Telegram bot
- [ ] Desktop app
- [ ] Local LLM mode
- [ ] WebGPU inference experiments
- [ ] Browser local memory experiments
- [ ] Calendar integration
- [ ] Notes integration

Success criteria:

- Integrations reuse the same AI core
- Website remains the primary product

---

## Phase 9: Optional Proof Layer

Goal: explore blockchain only for public proof features, not private data.

Possible features:

- [ ] Learning milestone certificates
- [ ] Public contribution proof
- [ ] Project submission proof
- [ ] Achievement badges

Rules:

- [ ] No private chat data on-chain
- [ ] No uploaded documents on-chain
- [ ] No personal student data on-chain

---

## Priority Order

Recommended build order:

```txt
1. Chat MVP
2. Assistant modes
3. Supabase auth and history
4. Document upload
5. RAG with pgvector
6. Static avatar
7. Voice
8. Live2D or VRM
9. Integrations
```

---

## Reference Stack Alignment

The open-source study in [REFERENCE_STACKS.md](./REFERENCE_STACKS.md) updates the roadmap without changing the MVP order:

- Keep the main product on the current Next.js, React, TypeScript, Tailwind, and ShadCN-style stack through the first complete web release.
- Treat Vue/Vite patterns from AIRI and Sanbaka as future stage-shell inspiration, not a reason to rewrite the current app.
- Treat Python/FastAPI patterns from Open-LLM-VTuber and Neuro as a later local or voice runtime, not a Phase 1 dependency.
- Use the current mode registry as the seed of a runtime state model: `idle`, `thinking`, `streaming`, `speaking`, `error`, and mode-specific metadata.
- Add memory controls before deeper personalization: list, delete, export, and wipe should exist before hidden long-term memory becomes powerful.
- Add RAG with explicit source snippets and citations before autonomous tools.
- Keep avatar signals structured and separate from chat text so the renderer can evolve without parsing assistant prose.
- Ship push-to-talk voice before any always-listening voice flow.
- Delay Discord, Telegram, Twitch-style streaming, Minecraft, desktop, and autonomous game control until auth, safety, rate limiting, and user controls are solid.

---

## Definition Of Done For MVP

The MVP is considered done when:

- [ ] `accel.io.vn/waifu` is live
- [ ] User can chat with UIT Waifu
- [ ] User can select assistant mode
- [ ] User can upload at least one PDF
- [ ] User can ask questions about uploaded PDF
- [ ] Conversations are saved
- [ ] Basic avatar UI exists
- [ ] README, ROADMAP, and STRUCTURE are up to date

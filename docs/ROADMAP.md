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

- [ ] Next.js app setup
- [ ] Tailwind CSS setup
- [ ] ShadCN UI setup
- [ ] Landing page
- [ ] Chat page
- [ ] Message input
- [ ] Message list
- [ ] Loading state
- [ ] Markdown rendering
- [ ] Code block rendering
- [ ] Basic AI API route
- [ ] Basic system prompt
- [ ] Cloudflare Pages deployment
- [ ] Public path: `accel.io.vn/waifu`

Recommended routes:

```txt
/
/chat
/settings
```

Success criteria:

- Users can open `accel.io.vn/waifu`
- Users can send a message
- UIT Waifu can respond
- Responses support Markdown and code blocks

---

## Phase 2: Assistant Modes

Goal: make UIT Waifu useful for real student workflows.

Modes:

- [ ] General chat
- [ ] Study tutor
- [ ] Code debugging
- [ ] Document Q&A placeholder
- [ ] Exam revision
- [ ] Project planning

Study tutor features:

- [ ] Explain concepts step by step
- [ ] Generate examples
- [ ] Generate practice questions
- [ ] Give hints before full answer
- [ ] Summarize lessons

Code assistant features:

- [ ] Explain code
- [ ] Debug errors
- [ ] Analyze complexity
- [ ] Refactor code
- [ ] Review SQL queries

Success criteria:

- User can choose assistant mode
- Each mode uses a different prompt template
- Code answers are formatted clearly

---

## Phase 3: Supabase, Auth, And Conversation History

Goal: persist user data safely.

Database setup:

- [ ] Create Supabase project
- [ ] Configure PostgreSQL
- [ ] Configure Supabase Auth or NextAuth
- [ ] Create profiles table
- [ ] Create conversations table
- [ ] Create messages table
- [ ] Add row-level security policies

Auth features:

- [ ] Sign in
- [ ] Sign out
- [ ] User profile
- [ ] Protected chat history

Conversation features:

- [ ] Save conversations
- [ ] Load previous conversations
- [ ] Delete conversations
- [ ] Rename conversations

Success criteria:

- User can sign in
- Messages are saved
- User can reopen chat history

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

- [ ] Static character image
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

- [ ] Research Three.js VRM rendering
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

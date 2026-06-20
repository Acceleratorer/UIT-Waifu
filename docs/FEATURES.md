# Features

This document catalogs the planned features of **UIT Waifu**, grouped by area. It expands on the [Feature Pillars](../README.md#feature-pillars) in the README and tracks scope per [docs/ROADMAP.md](./ROADMAP.md).

Product direction stays the same throughout:

```txt
Useful first. Cute second. Scalable later.
```

---

## Feature Status Legend

```txt
[ ] Planned        Not started
[~] In Progress    Being built
[x] Done           Shipped and working
[?] Exploring      Research / experiment, may not ship
```

---

## 1. NLP And Voice Chat

Natural conversation is the core interaction. Voice should come after text chat is stable.

| Feature | Status | Notes |
|---|---|---|
| Multi-turn text chat | [~] | Streaming responses, Markdown + code rendering |
| Vietnamese + English | [~] | Natural switching mid-conversation |
| Browser speech-to-text | [ ] | Web Speech API for the MVP |
| Whisper-compatible STT | [?] | Higher accuracy, server-side, later |
| Text-to-speech output | [ ] | OpenAI TTS / ElevenLabs / edge-tts |
| Voice activity detection | [?] | Detect when the user starts/stops speaking |
| Barge-in / interruption | [?] | Let the user cut off a reply mid-sentence |

Voice pipeline target shape:

```txt
Mic → STT → LLM (with memory + RAG) → TTS → Avatar lip-sync
```

Latency is the hard part. Budget each stage and stream where possible so the first audio plays before the full reply is generated.

---

## 2. Memory And Personalization

Memory should make the companion more useful without being creepy. See [docs/DATABASE.md](./DATABASE.md) for storage details.

| Feature | Status | Notes |
|---|---|---|
| Short-term chat context | [~] | Current browser session persists across refresh |
| Saved user preferences | [ ] | Name, language, study goals |
| Course list | [ ] | What the student is taking |
| Uploaded document history | [ ] | What's been ingested for RAG |
| Long-term semantic memory | [ ] | pgvector-backed, user-controlled |
| Memory deletion controls | [ ] | User can wipe any stored memory |

Privacy rules:

- Let users delete memory at any time.
- Store only useful data; skip unnecessary sensitive fields.
- Keep private documents and academic data private and off-chain.

---

## 3. IPA — Math And Problem Solving

Image-and-text problem analysis. Tuấn Anh's ask: the companion should handle **calculus, linear algebra, and probability/statistics**, similar to how WeCode-style assistants solve coding tasks.

| Feature | Status | Notes |
|---|---|---|
| Step-by-step calculus | [ ] | Derivatives, integrals, limits — show working |
| Linear algebra | [ ] | Matrices, eigenvalues, systems of equations |
| Probability & statistics | [ ] | Distributions, expectation, hypothesis tests |
| Photo of a problem → solution | [?] | OCR a handwritten/printed problem, then solve |
| Hints before full solutions | [ ] | Teach, don't just dump the answer |
| Show working, not just results | [ ] | Each step explained for exam prep |

Design note: prefer a **tutoring** posture — give a hint, let the student try, then reveal more. This pairs directly with the [Practice Points](#6-practice-points-gamification) system.

---

## 4. Coding Assistant

Practical, clear coding help. Full list in the [README](../README.md#3-coding-assistant).

| Feature | Status | Notes |
|---|---|---|
| Explain code logic | [~] | |
| Debug runtime + compiler errors | [~] | |
| Review SQL queries | [ ] | |
| Time-complexity analysis | [ ] | |
| Refactor / suggest improvements | [ ] | |
| Generate starter code | [ ] | |
| 300 UIT exercises support | [?] | Curated set tied to practice points |

Supported languages: C, C++, Python, Java, JavaScript, TypeScript, SQL, Bash.

---

## 5. Document AI And RAG

Understand uploaded academic material. Pipeline detail in the [README](../README.md#rag-pipeline).

| Feature | Status | Notes |
|---|---|---|
| Upload PDF / Word / slides | [ ] | File validation first |
| Text extraction + chunking | [ ] | |
| Embedding + pgvector storage | [ ] | |
| Grounded Q&A from documents | [ ] | Answers cite the source chunks |
| Summarize a document | [ ] | |
| Extract deadlines / dates | [ ] | Feeds the study planner |

---

## 6. Practice Points (Gamification)

Students are hungry for training/practice points, so reward real learning. The companion grants points for completed, verified work.

| Feature | Status | Notes |
|---|---|---|
| Earn points by solving problems | [ ] | Calculus, linear algebra, coding exercises |
| Verify the answer before awarding | [ ] | No points for empty submissions |
| Streaks & daily goals | [?] | Encourage consistent study |
| Achievements / milestones | [?] | Optional on-chain proof per README |
| Leaderboard (opt-in) | [?] | Friendly competition, privacy-respecting |

Design note: points must map to **genuinely completed** work (a checked solution, a passing test), not to clicks — otherwise the system just inflates.

---

## 7. Character Interface And Avatar

An expressive companion, built in phases (see [README](../README.md#5-character-interface)).

### Expressions

Wholesome mood states the avatar can show, driven by conversation tone:

```txt
happy / smile      neutral / idle      sulking (hứ)
crying (huhu)      angry              surprised
thinking           celebrating
```

### Movement (Phase 3+)

| Feature | Status | Notes |
|---|---|---|
| Auto blink | [?] | |
| Idle micro-movement | [?] | Subtle breathing / sway |
| Eye tracking | [?] | Look toward cursor / active area |
| Mouth lip-sync | [?] | Driven by TTS audio |
| Hand / gesture animation | [?] | Smooth, non-jerky transitions |
| Live2D or VRM model | [?] | Experiment after chat + RAG are solid |

Goal: smooth, natural motion. Blend between states rather than snapping.

---

## 8. Personality Presets

Switch the companion's **conversational tone** — this is a prompt/persona change, not an LLM-provider change.

| Preset | Vibe |
|---|---|
| Friendly (default) | Warm, supportive, practical |
| Tsundere | Playfully prickly, secretly caring |
| Yandere (light) | Clingy-cute, kept tasteful |
| Senpai / mentor | Encouraging, slightly formal |
| Genki | High-energy, cheerful |

Each preset is a versioned prompt layer in [docs/PROMPTS.md](./PROMPTS.md). Usefulness and accuracy always come first, regardless of tone.

---

## 9. Platforms

Where UIT Waifu runs.

| Platform | Status | Notes |
|---|---|---|
| Web (`accel.io.vn/waifu`) | [~] | Primary target, Cloudflare Pages |
| Discord bot | [?] | Slash commands, per-user memory, voice channels |
| Windows desktop | [?] | Electron / Tauri shell, later |
| macOS desktop | [?] | Same shell, later |
| Telegram | [?] | Stretch goal |

> Linux desktop isn't planned yet, but a web-first app already runs anywhere with a browser.

---

## Out Of Scope

To keep the project healthy, useful, and safe, the following are explicitly **not** part of UIT Waifu:

- Generating sexual or explicit content of any kind.
- Generating intimate or sexualized imagery of real people from uploaded photos. Creating such imagery of a real person without their consent is harmful and illegal in many jurisdictions, including Vietnam.
- Any "facial recognition to undress/sexualize" feature.

The companion stays a study-and-productivity tool with a friendly, wholesome character. If you want to brainstorm more features, keep them in that lane and they're fair game.

---

## Suggesting New Features

Open an issue or PR against this file. For each proposal, include:

```txt
- What it does (one or two sentences)
- Which pillar it belongs to
- Why a UIT student would want it
- Rough complexity / dependencies
```

Build useful before flashy. Keep the MVP small and deployable.

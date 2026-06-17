# Avatar Integration — UIT Waifu × Open-LLM-VTuber

How UIT Waifu gets a talking 3D character, by adapting ideas from
[Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) to our
web-first, static-on-Cloudflare stack.

This document is the design reference for the avatar work (Roadmap Phase 5 and
Phase 7). It does **not** add a runtime dependency on Open-LLM-VTuber — it
borrows the *mechanism*, not the codebase.

---

## Decisions (locked)

| Question | Choice | Why |
|---|---|---|
| Avatar tech | **VRM (true 3D)** via `@pixiv/three-vrm` + three.js | True 3D per request; renders client-side, fits static hosting. Open-LLM-VTuber uses Live2D (2.5D) — we diverge here. |
| Speech | **Text-only avatar for now** | Voice (Phase 6) comes later. Avatar reacts to chat text + expressions, no TTS audio yet. |
| Sequencing | **After Phase 2 (assistant modes)** | Modes shipped; avatar is the next visual layer. |
| Backend | **No Python server** | UIT Waifu deploys static to Cloudflare Pages. Open-LLM-VTuber's FastAPI/WebSocket engine cannot run there. |

---

## What we take from Open-LLM-VTuber (and what we leave)

Open-LLM-VTuber's real value for us is one proven idea, not its stack.

**Take — the emotion-tag → expression mechanism.** The LLM emits inline tags
like `[joy]` / `[neutral]` in its reply; the app strips them from the displayed
text and maps each tag to an avatar expression. In their code this lives in
`prompts/utils/live2d_expression_prompt.txt` (the prompt that teaches the model
the tags) and `src/open_llm_vtuber/agent/transformers.py` (`actions_extractor`,
which calls `live2d_model.extract_emotion(...)`). The wire payload that carries
expressions to the frontend is built in `utils/stream_audio.py`:

```python
{ "type": "audio", "audio": <base64 wav>, "volumes": [...],
  "display_text": {...}, "actions": { "expressions": [<index>] } }
```

**Leave behind:**
- Their **Python FastAPI + WebSocket `/client-ws`** transport — we keep our
  HTTP SSE `/api/chat` Pages Function.
- **Live2D rendering** (`.model3.json` / `.moc3`, `pixi-live2d-display`) — we use
  VRM instead.
- The **ASR/TTS/VAD** voice pipeline — deferred to Phase 6, and even then we lean
  on browser Web Speech APIs to stay serverless.
- The **base64-WAV `volumes[]` lip-sync** — only needed once we have audio
  (Phase 6). Until then, the avatar mouth stays idle.

The net: we reuse a ~20-line idea (tags in, expression out) and render it on a
different engine. No fork, no submodule, no shared protocol.

---

## Architecture

```txt
Browser (Next.js static export, Cloudflare Pages)
 ├── Chat UI ............ existing components/chat/*
 ├── useChat hook ....... existing features/chat/hooks/use-chat.ts
 │      │ POST {messages, mode}  ──►  /api/chat (Pages Function → OpenRouter, SSE)
 │      ◄── data:{delta} stream
 │
 ├── Expression parser .. NEW: strip [tags] from stream, emit ExpressionEvent
 │      │
 │      ▼
 └── Avatar (VRM) ....... NEW: three.js canvas, three-vrm model
        - applies expression (joy/neutral/…) via VRM expression presets
        - idle: auto-blink, breathing sway, look-at cursor
        - mouth: idle now; lip-sync wired in Phase 6
```

Everything runs in the browser. The only server touch is the existing
`/api/chat` Function, unchanged except for one prompt-layer addition (below).

---

## Expression contract

A small, self-contained contract so the chat layer and avatar layer stay decoupled.

**Tag vocabulary** (maps to VRM expression presets; superset works with custom
models that define these as blendshape clips):

```txt
neutral   happy   sad   angry   surprised   relaxed   thinking
```

**Prompt layer.** Add an *optional* avatar-expression layer to the system prompt,
composed only when the avatar is active. It lives beside the existing layers in
`lib/prompts/` (see [PROMPTS.md](./PROMPTS.md) for the layering model) and is
appended by `composeSystemPrompt`. Sketch:

```txt
When the avatar is shown, you may express mood with inline tags in square
brackets, e.g. "[happy] Nice work!" Use only: neutral, happy, sad, angry,
surprised, relaxed, thinking. Place a tag at the start of a sentence whose
tone it describes. Use them sparingly. Never explain the tags.
```

This mirrors `live2d_expression_prompt.txt` but with our VRM vocabulary.

**Parsing.** A pure function in `features/avatar/` consumes the streamed text:

```ts
// features/avatar/expression.ts
export type Expression =
  | "neutral" | "happy" | "sad" | "angry" | "surprised" | "relaxed" | "thinking";

export interface ParsedChunk {
  text: string;              // tag-stripped text to display
  expressions: Expression[]; // tags found, in order
}

// Strips [tag] tokens, returns clean text + any expressions seen.
export function parseExpressions(chunk: string): ParsedChunk;
```

The chat renderer shows `text` (tags removed, exactly like Open-LLM-VTuber hides
them from the bubble); the avatar subscribes to `expressions` and transitions.

**Why client-side parsing.** The tags arrive in the same SSE `delta` stream we
already parse in `use-chat.ts`. No new endpoint, no payload change to the Pages
Function. The Function only gains the optional prompt layer.

---

## Component layout (uses reserved folders)

`STRUCTURE.md` already reserves `components/avatar/` and `features/avatar/`.

```txt
features/avatar/
  expression.ts        parseExpressions(), Expression type, tag↔preset map
  use-avatar.ts        avatar state: current expression, idle flags
  vrm-loader.ts        load .vrm, set up three.js scene/camera/light

components/avatar/
  avatar-stage.tsx     "use client" — three.js <canvas>, mounts the VRM
  avatar-panel.tsx     layout wrapper (desktop side panel / mobile bubble)

public/avatars/
  <model>.vrm          the VRM model file (see licensing note)
```

Wiring into chat: `components/chat/chat-window.tsx` renders `<AvatarPanel>`
alongside the message list. `use-chat.ts` exposes the streamed expressions (or a
small event emitter) that `use-avatar.ts` consumes. Keep the avatar **optional**
behind a settings toggle so the text-only experience is unaffected and the bundle
only loads three.js when the avatar is on (dynamic `import()`).

---

## Dependencies & static-export notes

| Package | Purpose |
|---|---|
| `three` | WebGL renderer |
| `@pixiv/three-vrm` | VRM model loading + expression/look-at helpers |

- Load the avatar with `next/dynamic` (`ssr: false`) — three.js is browser-only,
  and `output: "export"` must not try to prerender a WebGL canvas.
- VRM/three add weight; code-split so `/chat` stays light when the avatar is off.
- No new server dependency. Cloudflare deploy story is unchanged.

---

## Phasing

**Phase 5 — Avatar MVP (this doc's near-term target)**
1. Add `features/avatar/expression.ts` + tests for tag parsing.
2. Add the optional expression prompt layer; gate it on "avatar active".
3. `avatar-stage.tsx`: load a VRM, idle animation (blink, sway, look-at).
4. Drive expression changes from the parsed stream; blend, don't snap.
5. Settings toggle + dynamic import. Verify `/chat` bundle stays small when off.

**Phase 6 — Voice (later)**
- Browser SpeechRecognition for input, SpeechSynthesis (or a TTS Function) for
  output. Add mouth lip-sync: analyse output audio amplitude in the browser
  (Web Audio `AnalyserNode`) and drive the VRM mouth — our serverless equivalent
  of Open-LLM-VTuber's `volumes[]` array.

**Phase 7 — Polish**
- Richer motions, mode-linked expressions (e.g. `thinking` while streaming),
  per-character VRM selection.

---

## Verification

- **Parser unit tests**: `[happy] Hi [thinking] hmm` → text `"Hi  hmm"` (tags
  gone), expressions `["happy","thinking"]`; unknown tags ignored; no false
  positives on real brackets like array code in a code-mode reply.
- **Build**: `npm run build` (heap-bumped) stays green; confirm `/chat` First Load
  JS does **not** grow when the avatar is toggled off (proves code-split works).
- **Runtime**: with avatar on, send messages in each mode; confirm the face
  transitions on tags and the displayed text has no visible `[tags]`. Confirm
  idle blink/sway runs. Confirm avatar-off path is byte-for-byte the current
  text experience.

---

## Licensing note

Open-LLM-VTuber ships Live2D **sample models** under Live2D Inc.'s separate
license (see their `LICENSE-Live2D.md`) — do **not** copy those assets here. We
use VRM models instead; pick a `.vrm` whose license permits our use and record it
in `public/avatars/`. We reuse Open-LLM-VTuber's *approach*, not its art.

---

## Alternatives considered (and why not)

1. **Embed Open-LLM-VTuber's frontend, point its agent at our `/api/chat`.**
   Fullest feature set, but forces a self-hosted Python server and their
   WebSocket protocol — breaks the static-Cloudflare constraint.
2. **Run Open-LLM-VTuber as a separate self-hosted "voice mode" service** that
   UIT Waifu links to. Cleanest isolation, but it's two apps and two deploys.
3. **Chosen: lift only the emotion-tag idea, render VRM in-app.** Keeps one
   web-first app, no Python, matches the roadmap. We give up their polished
   voice-interruption pipeline (revisit in Phase 6).

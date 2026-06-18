# Contributing to UIT Waifu

Thanks for helping build UIT Waifu. This guide covers how to set up the project, the conventions we follow, and how to get changes merged.

The product principle drives every decision:

```txt
Useful first. Cute second. Scalable later.
```

---

## Getting Started

```bash
git clone https://github.com/Acceleratorer/UIT-Waifu.git
cd UIT-Waifu
npm install
cp .env.example .env.local   # then fill in values
npm run dev
```

Open `http://localhost:3000`.

> The application code is being built out phase by phase (see [docs/ROADMAP.md](./docs/ROADMAP.md)). If `package.json` is not present yet, the repo is still in the documentation phase and the commands above apply once Phase 1 lands.

---

## Project Layout

The folder structure and naming conventions are defined in [docs/STRUCTURE.md](./docs/STRUCTURE.md). In short:

- Routes and API handlers live in `app/`.
- Reusable UI lives in `components/`.
- Feature logic lives in `features/`.
- Shared infrastructure (AI, db, prompts, validators) lives in `lib/`.
- Keep route handlers thin and prompts out of route handlers.

---

## Conventions

- **Files**: kebab-case (`chat-window.tsx`).
- **Components**: PascalCase (`ChatWindow`).
- **Hooks**: `use` prefix (`useChat`).
- **Commits**: Conventional Commits style, matching the existing history:

  ```txt
  feat: add streaming to chat route
  fix: handle empty document upload
  docs: clarify env var names
  refactor: extract prompt builder
  ```

- **Validation**: every API input is validated with a Zod schema in `lib/validators/`.
- **Secrets**: never commit `.env.local` or real keys. Server-only keys must never use the `NEXT_PUBLIC_` prefix.

---

## Branches And Pull Requests

1. Branch off `main`: `git checkout -b feat/chat-streaming`.
2. Make focused changes. Keep the diff scoped to one concern.
3. Run checks locally before pushing:

   ```bash
   npm run lint
   npm run typecheck
   npm run secrets:scan
   npm test
   npm run build
   ```

4. Push and open a pull request against `main`.
5. In the PR description, include a summary of changes, what you tested, and any follow-ups. Reference the relevant roadmap phase.

Keep PR titles under 70 characters; put detail in the body.

---

## Testing

- Add tests with new features and bug fixes.
- Unit tests in `tests/unit/`, integration in `tests/integration/`, end-to-end in `tests/e2e/`.
- For UI work, verify the feature in a browser, not just via tests.

---

## Documentation

If a change affects setup, structure, the API, the database, prompts, or deployment, update the matching doc in `docs/` in the same PR:

- [ROADMAP.md](./docs/ROADMAP.md) — phases and milestones
- [STRUCTURE.md](./docs/STRUCTURE.md) — folders and naming
- [API.md](./docs/API.md) — HTTP endpoints
- [DATABASE.md](./docs/DATABASE.md) — schema and RLS
- [PROMPTS.md](./docs/PROMPTS.md) — prompt layers and modes
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Cloudflare and Supabase setup

Docs and code should never disagree. A change that makes them disagree is incomplete.

---

## Security And Privacy

Follow the rules in the README's Security And Privacy section. In particular: validate uploads, rate-limit AI endpoints, keep private documents private, and let users delete their own data.

---

## License

By contributing, you agree that your contributions are licensed under the MIT License, the same as the project.

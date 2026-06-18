# UIT Waifu Deployment Guide

This document describes how to deploy UIT Waifu to production at `accel.io.vn/waifu` on Cloudflare Pages, backed by Supabase.

---

## Targets

```txt
Production domain:  https://accel.io.vn/waifu
Hosting:            Cloudflare Pages
Database:           Supabase (PostgreSQL + pgvector)
File storage:       Supabase Storage
```

---

## Prerequisites

- A Cloudflare account with access to the target zone (`accel.io.vn`).
- A Supabase project (see [DATABASE.md](./DATABASE.md) for schema setup).
- The GitHub repository connected to Cloudflare Pages.
- All required environment variables (see [Environment Variables](#environment-variables)).

---

## Environment Variables

These are the canonical variables for the project. The same list appears in `.env.example`. Names must match across README, STRUCTURE, and this file.

```env
# App
NEXT_PUBLIC_APP_URL=https://accel.io.vn/waifu
NEXT_PUBLIC_BASE_PATH=/waifu

# Supabase (NEXT_PUBLIC_* are exposed to the browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://accel.io.vn/waifu

# AI provider (set the one you use)
AI_PROVIDER=anthropic
OPENAI_API_KEY=
OPENROUTER_API_KEY=
ANTHROPIC_API_KEY=
EMBEDDING_MODEL=text-embedding-3-small

# Chat provider models
OPENROUTER_MODEL=google/gemini-2.0-flash-001
ANTHROPIC_MODEL=claude-haiku-4-5
APP_URL=https://accel.io.vn/waifu
```

Rules:

- `NEXT_PUBLIC_*` variables are visible in the browser bundle. Never put a secret behind that prefix.
- `SUPABASE_SERVICE_ROLE_KEY` and AI provider keys are server-only. They must only be read in Pages Functions, Route Handlers, or server components.
- `AI_PROVIDER` can be `anthropic` or `openrouter`. UIT Waifu uses Anthropic Claude for chat by default; OpenRouter remains available as a fallback provider.
- `DATABASE_URL` points at the Supabase Postgres instance; pgvector lives in the same database, so no separate vector URL is needed.
- Never commit `.env.local`. Set production values in the Cloudflare Pages dashboard.

---

## Cloudflare Pages Setup

```txt
Project name:     UIT-Waifu
Production branch: main
Framework preset: Next.js
Build command:    npm run build
Build output:     (managed by the Next.js adapter)
Node version:     20.x (set NODE_VERSION=20 if needed)
```

Steps:

1. In Cloudflare Pages, create a project and connect the GitHub repository.
2. Set the build command and framework preset above.
3. Add every variable from [Environment Variables](#environment-variables) under Settings → Environment variables. Add them to both Production and Preview environments.
4. Trigger the first deploy from `main`.

> Next.js on Cloudflare Pages requires the Cloudflare adapter (for example `@cloudflare/next-on-pages`). Confirm the adapter and its build command are wired in `package.json` before the first deploy.

---

## Domain, Routing, And DNS

UIT Waifu is served at the path `/waifu` under the existing `accel.io.vn` zone, not on its own subdomain.

```txt
Domain:    accel.io.vn
Base path: /waifu
Public URL: https://accel.io.vn/waifu
```

Steps:

1. Build the app with the base path set to `/waifu` (see `next.config.mjs` `basePath`/`assetPrefix`).
2. Keep `public/_redirects` in place so Cloudflare Pages rewrites `/waifu` page and asset requests to the exported static files.
3. Route `accel.io.vn/waifu/*` to this Pages project. Options:
   - A Cloudflare Pages custom domain of `accel.io.vn` if this project owns the zone root, or
   - A reverse-proxy / route rule that forwards `/waifu/*` to `<project>.pages.dev`.
4. Wait for SSL to provision, then verify `https://accel.io.vn/waifu` serves the app.

The API is available both at `/api/*` for direct Pages-project access and at `/waifu/api/*` for the production base path.

---

## Supabase Setup

1. Create the Supabase project and copy the URL, anon key, and service role key into the environment variables.
2. Enable the `vector` extension and run the schema from [DATABASE.md](./DATABASE.md).
3. Apply row-level security policies before going live so users can only read their own rows.
4. Create the storage bucket for uploads and set its access policy.

---

## Deployment Checklist

Before promoting a build to production:

- [ ] `npm run build` succeeds locally.
- [ ] `npm run lint`, `npm run typecheck`, `npm run secrets:scan`, and `npm test` pass.
- [ ] All required environment variables are set in Cloudflare Pages.
- [ ] Supabase schema and RLS policies are applied.
- [ ] `GET /api/health` returns `200` on the preview deployment.
- [ ] No secret is exposed under a `NEXT_PUBLIC_*` name.
- [ ] Custom domain resolves with valid SSL.

---

## Rollback

Cloudflare Pages keeps previous deployments. To roll back, open the Pages project, find the last known-good deployment, and use "Rollback to this deployment". No code revert is required for an immediate rollback, but follow up with a git revert so `main` matches what is live.

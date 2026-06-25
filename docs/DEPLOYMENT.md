# UIT Waifu Deployment Guide

This document describes how to deploy UIT Waifu to production at `accel.io.vn/waifu`.

---

## Targets

```txt
Production domain:  https://accel.io.vn/waifu
Hosting:            DirectAdmin static hosting
Database:           Supabase (PostgreSQL + pgvector)
File storage:       Supabase Storage
```

---

## Prerequisites

- DirectAdmin/FTP access to the `accel.io.vn` hosting account.
- A Cloudflare account with access to the target zone (`accel.io.vn`) if using the Pages/Functions target.
- A Supabase project (see [DATABASE.md](./DATABASE.md) for schema setup).
- The GitHub repository connected to the chosen deployment target.
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
ANTHROPIC_AUTH_TOKEN=
ANTHROPIC_BASE_URL=
EMBEDDING_MODEL=text-embedding-3-small

# Chat provider models
OPENROUTER_MODEL=google/gemini-2.0-flash-001
ANTHROPIC_MODEL=claude-haiku-4-5
ANTHROPIC_DEFAULT_OPUS_MODEL=
ANTHROPIC_DEFAULT_SONNET_MODEL=
ANTHROPIC_DEFAULT_HAIKU_MODEL=
APP_URL=https://accel.io.vn/waifu
```

Rules:

- `NEXT_PUBLIC_*` variables are visible in the browser bundle. Never put a secret behind that prefix.
- `SUPABASE_SERVICE_ROLE_KEY` and AI provider keys are server-only. They must only be read in Pages Functions, Route Handlers, or server components.
- `AI_PROVIDER` can be `anthropic` or `openrouter`. UIT Waifu uses Anthropic Claude for chat by default; OpenRouter remains available as a fallback provider.
- `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL` support Anthropic-compatible proxies. `ANTHROPIC_API_KEY` takes precedence when both key names are set.
- `ANTHROPIC_MODEL` can be a full model id or the alias `opus`, `sonnet`, or `haiku` when the matching `ANTHROPIC_DEFAULT_*_MODEL` variable is set.
- `DATABASE_URL` points at the Supabase Postgres instance; pgvector lives in the same database, so no separate vector URL is needed.
- Never commit `.env.local`. On DirectAdmin, keep server-only values in the private `.uit-waifu.env.php` file outside `public_html`. On Cloudflare Pages, set production values in the Pages dashboard.

---

## Cloudflare Pages Setup (Optional)

```txt
Project name:     UIT-Waifu
Production branch: main
Framework preset: Next.js
Build command:    npm run build
Build output:     (managed by the Next.js adapter)
Node version:     20.x (set NODE_VERSION=20 if needed)
```

Steps, if using Cloudflare Pages:

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

DirectAdmin steps:

1. Build the app with the base path set to `/waifu` (see `next.config.mjs` `basePath`/`assetPrefix`).
2. Upload the generated `out/` contents to `domains/accel.io.vn/public_html/waifu`.
3. Keep `public/.htaccess` in place so clean routes and PHP API adapters resolve correctly.
4. Keep private server config in `domains/accel.io.vn/.uit-waifu.env.php`, outside `public_html`.
5. Verify `https://accel.io.vn/waifu` serves the app.

On DirectAdmin production, PHP adapters are exposed under `/waifu/api/*`. If the Cloudflare Pages Functions target is used, the Functions source supports both `/api/*` and `/waifu/api/*`.

---

## DirectAdmin Static Deployment

The current production deployment is hosted from DirectAdmin at:

```txt
https://accel.io.vn/waifu
```

Static files are uploaded from `out/` to:

```txt
domains/accel.io.vn/public_html/waifu
```

DirectAdmin serves PHP adapters from `public/api/` for endpoints that must run
server-side on this host:

- `/waifu/api/health` -> `public/api/health.php`
- `/waifu/api/chat` -> `public/api/chat.php`

The chat adapter reads private provider config from `.uit-waifu.env.php` one
directory above `public_html`. Keep that file out of git and out of
web-accessible paths.

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
- [ ] All required server-only variables are set in the active deployment target.
- [ ] Supabase schema and RLS policies are applied.
- [ ] `GET /api/health` returns `200` on the preview deployment.
- [x] `GET /waifu/api/health` returns `200` on DirectAdmin production.
- [ ] No secret is exposed under a `NEXT_PUBLIC_*` name.
- [ ] Custom domain resolves with valid SSL.

---

## Rollback

For DirectAdmin, keep a timestamped backup of the previous `public_html/waifu` directory before uploading a new export. To roll back, restore the last known-good backup to `public_html/waifu`.

Cloudflare Pages keeps previous deployments. If using Pages, open the Pages project, find the last known-good deployment, and use "Rollback to this deployment". No code revert is required for an immediate rollback, but follow up with a git revert so `main` matches what is live.

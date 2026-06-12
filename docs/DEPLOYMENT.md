# UIT Waifu Deployment Guide

This document describes how to deploy UIT Waifu to production at `waifu.accel.io.vn` on Cloudflare Pages, backed by Supabase.

---

## Targets

```txt
Production domain:  https://waifu.accel.io.vn
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

Rules:

- `NEXT_PUBLIC_*` variables are visible in the browser bundle. Never put a secret behind that prefix.
- `SUPABASE_SERVICE_ROLE_KEY` and AI provider keys are server-only. They must only be read in Route Handlers or server components.
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

## Custom Domain And DNS

```txt
Custom domain: waifu.accel.io.vn
DNS record:    CNAME  waifu  ->  <project>.pages.dev
```

Steps:

1. In the Pages project, add the custom domain `waifu.accel.io.vn`.
2. Cloudflare creates the CNAME automatically when the zone is on Cloudflare. Otherwise add it manually.
3. Wait for SSL to provision, then verify `https://waifu.accel.io.vn` serves the app.

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
- [ ] `npm run lint` and `npm test` pass.
- [ ] All required environment variables are set in Cloudflare Pages.
- [ ] Supabase schema and RLS policies are applied.
- [ ] `GET /api/health` returns `200` on the preview deployment.
- [ ] No secret is exposed under a `NEXT_PUBLIC_*` name.
- [ ] Custom domain resolves with valid SSL.

---

## Rollback

Cloudflare Pages keeps previous deployments. To roll back, open the Pages project, find the last known-good deployment, and use "Rollback to this deployment". No code revert is required for an immediate rollback, but follow up with a git revert so `main` matches what is live.

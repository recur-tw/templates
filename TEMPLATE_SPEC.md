# Template Specification

Every template in this repo must ship the same standard equipment so that
quality stays consistent and AI agents can navigate any template the same way.

## Design philosophy

These templates are **agent-first**: the primary consumer is an AI coding
agent (Claude Code, Cursor, Codex, ...) scaffolding a project for a human.
Humans are the second audience. This implies:

1. Every customization point is marked with `TODO(customize):` so agents can
   locate them precisely with a single grep.
2. Every template has an `AGENTS.md` describing architecture, customization
   points, and which files must not be hand-edited.
3. Templates run out of the box in sandbox mode: clone → fill 3 env vars →
   `pnpm dev` → complete a test checkout.

## Standard equipment (required for every template)

| Item | Requirement |
|------|-------------|
| Stack | Next.js App Router + TypeScript + Tailwind (unless the template is explicitly a framework variant, e.g. `saas-tanstack`) |
| Checkout | Hosted Checkout via `useRecur().redirectToCheckout()` + `useProducts()`. Hosted mode is the default because embedded/modal checkout requires a registered domain and does not work on localhost — templates must run locally out of the box. Document the embedded upgrade path in AGENTS.md. |
| Webhooks | `POST /api/webhooks/recur` with HMAC-SHA256 signature verification (timing-safe compare) and event-id idempotency |
| Entitlements | Server-side gate via `recur-tw/server` (`recur.entitlements.check`) — never trust client-side checks alone |
| Portal | Customer portal entry (`recur.portal.sessions.create`) behind authentication |
| Env | `.env.example` runnable with only `NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY`, `RECUR_SECRET_KEY`, `RECUR_WEBHOOK_SECRET` |
| Docs | `README.md` in zh-TW (audience: Taiwanese developers) + `AGENTS.md` in en-US (audience: AI agents) |
| Deploy | One-click deploy buttons for Vercel and Zeabur in the README |
| CI | Template must pass `pnpm build` in CI on every PR and on recur-tw SDK releases |

## Auth policy

Templates ship a **minimal demo email-session** (signed httpOnly cookie, no
password) because Recur identifies customers by email and the template's job
is to demonstrate Recur wiring, not auth. The demo auth is isolated in
`lib/auth.ts` and marked `TODO(customize)`; `AGENTS.md` documents how to swap
in better-auth / next-auth / Clerk without touching the Recur wiring.

Rationale: a real auth library forces a database, and a database breaks the
"3 env vars and it runs" promise and complicates one-click deploys.

## Webhook idempotency policy

Templates must deduplicate by webhook event `id`. The default implementation
is an in-memory store (sufficient for single-instance demos) isolated behind
a small interface in `lib/webhook-store.ts`, marked `TODO(customize)` with
documented swaps for a database or KV in production.

## File layout conventions

```
templates/<name>/
├── README.md            # zh-TW, quickstart + deploy buttons
├── AGENTS.md            # en-US, architecture + customization map
├── .env.example
├── app/
│   ├── api/webhooks/recur/route.ts   # never rename this path
│   ├── api/portal/route.ts
│   └── ...
├── components/recur/    # Recur-specific UI (checkout, paywall, portal button)
└── lib/
    ├── recur.ts         # server SDK singleton
    ├── auth.ts          # demo auth (swap target)
    ├── plans.ts         # product slugs + marketing copy (customize target)
    └── webhook-store.ts # idempotency store (swap target)
```

## Naming

The scaffolding CLI is `create-recur-tw` (`npm create recur-tw@latest`).
All docs must reference that command; `create-recur` is only a reserved alias.
Template directory names are the CLI's `--template` values (`saas`,
`newsletter`, `community`, `saas-tanstack`, `backend-only`).

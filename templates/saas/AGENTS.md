# AGENTS.md — Recur SaaS Starter

Instructions for AI coding agents customizing this template.

## What this template is

A Next.js (App Router) subscription SaaS starter fully wired to Recur
(Taiwan's subscription payment platform, Stripe-Billing-like). All four Recur
integration surfaces are implemented and verified:

| Surface | Where | Notes |
|---------|-------|-------|
| Checkout | `components/recur/pricing-cards.tsx` | `useProducts()` + `useRecur().redirectToCheckout()` (Hosted Checkout). Hosted mode works on any domain including localhost; embedded/modal (`checkout()`) requires a registered domain — only switch to it for a deployed production domain. |
| Webhooks | `app/api/webhooks/recur/route.ts` | Verified with `recur.webhooks.verify()` (raw body, throws on bad signature) + event-id idempotency. **Never rename this path.** |
| Entitlements | `lib/entitlements.ts` → used by `app/dashboard/page.tsx` | Server-side gate via `recur-tw/server`. Client checks are UX-only. |
| Customer Portal | `app/api/portal/route.ts` + `components/recur/portal-button.tsx` | Session created server-side, requires auth |

Auth is a **demo email-session** (signed cookie, no password) isolated in
`lib/session.ts` + `app/login/`. Recur identifies customers by email, so the
session only needs to provide `{ email }`.

## Customization map

Find every intended customization point with:

```bash
grep -rn "TODO(customize)" --include="*.ts" --include="*.tsx" .
```

| File | What to customize |
|------|-------------------|
| `lib/plans.ts` | Plan slugs (must match Recur dashboard product slugs), names, feature lists. Order: highest tier first. |
| `app/page.tsx` | Landing page — no Recur wiring, rewrite freely |
| `app/dashboard/page.tsx` | Replace placeholder feature blocks with the real product |
| `app/layout.tsx` | Product name, nav |
| `app/api/webhooks/recur/route.ts` | Fill in event handler bodies (emails, provisioning, analytics). Handlers are side-effect hooks — access gating works without them because entitlements are read live from Recur. |
| `lib/webhook-store.ts` | Swap in-memory idempotency store for DB/KV in production (keep the 2-function interface) |
| `lib/session.ts` | Swap demo auth for real auth (see below) |

## Invariants — do not break these

1. `POST /api/webhooks/recur` path must not change (docs + dashboard config point at it).
2. Signature verification must pass the **raw request body** (`request.text()`) to `recur.webhooks.verify()` — never re-serialize parsed JSON.
3. Premium gating decisions happen **server-side** (`lib/entitlements.ts`). Never gate on client state alone.
4. `RECUR_SECRET_KEY` must never reach client code. `lib/recur.ts` is server-only.
5. Amounts from Recur are in cents (`29900` = NT$299).

## Swapping in real auth

The whole template depends on auth only through `getSession(): Promise<{ email: string } | null>` in `lib/session.ts`. To swap in better-auth / next-auth / Clerk:

1. Install and configure the auth library (it will likely need a database).
2. Reimplement `getSession()` to return the authenticated user's email from
   the new library.
3. Replace `app/login/` (page + actions) with the library's sign-in flow, and
   update the `signOut` import in `app/layout.tsx`.
4. Delete the cookie-signing helpers in `lib/session.ts`.

Nothing under `app/api/`, `lib/entitlements.ts`, or `components/recur/`
needs to change.

## Commands

```bash
pnpm dev        # dev server on :3000
pnpm build      # production build (requires env vars set, dummies OK)
pnpm typecheck  # tsc --noEmit
```

## Environment

See `.env.example`. Minimum to run: `NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY`,
`RECUR_SECRET_KEY`, `RECUR_WEBHOOK_SECRET`. `AUTH_SECRET` is required in
production (`openssl rand -hex 32`).

## Related skills

If the recur-skills plugin is installed, these give deeper API detail:
`/recur-checkout`, `/recur-webhooks`, `/recur-entitlements`, `/recur-portal`.

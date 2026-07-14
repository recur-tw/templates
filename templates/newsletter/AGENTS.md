# AGENTS.md — Recur Newsletter Starter

Instructions for AI coding agents customizing this template.

## What this template is

A paid-newsletter starter (Next.js App Router) wired to Recur, with a
file-based content system — **no database**:

- Posts live in `content/posts/<slug>.json` (metadata + Tiptap JSON),
  versioned in git. Publishing = `git push`.
- Writing happens locally via `/editor` (Tiptap v3), which saves through a
  **dev-only** API route. In production those routes return 403 and the
  editor UI shows a notice — the deployed filesystem is read-only anyway.
- Editor image uploads go to Cloudflare R2 (S3-compatible signed PUT via
  `aws4fetch`). R2 is optional: without `R2_*` env vars, `/api/upload`
  answers 501 and everything else still works.

## Recur integration surfaces

| Surface | Where | Notes |
|---------|-------|-------|
| Subscribe | `components/recur/subscribe-button.tsx` + `app/subscribe/` | Hosted Checkout by `productSlug` (single product, `lib/config.ts`) |
| Content gate | `lib/entitlements.ts` → `app/posts/[slug]/page.tsx` | Server-side: premium HTML is never produced for non-subscribers |
| Webhooks | `app/api/webhooks/recur/route.ts` | `recur.webhooks.verify()` + event-id idempotency. **Never rename this path.** |
| Portal | `app/api/portal/route.ts` + account page | Requires auth |

Auth is the same demo email-session as the saas template (`lib/session.ts`);
swap instructions are identical (keep `getSession(): Promise<{email}|null>`).

## Customization map

```bash
grep -rn "TODO(customize)" --include="*.ts" --include="*.tsx" .
```

| File | What to customize |
|------|-------------------|
| `lib/config.ts` | Newsletter name/description + the Recur product slug that gates premium posts |
| `content/posts/*.json` | Replace the two sample posts |
| `app/subscribe/page.tsx` | Subscriber benefits copy |
| `lib/posts.ts` | Swap file storage for a DB if you outgrow it (keep the exported functions) |
| `app/api/webhooks/recur/route.ts` | Side effects (e.g. welcome email on `checkout.completed`) |

## Invariants — do not break these

1. `POST /api/webhooks/recur` path must not change.
2. Premium gating stays in `app/posts/[slug]/page.tsx` server-side —
   `renderPostHTML()` must only run after the entitlement check passes.
3. `app/api/posts` and `app/api/upload` must keep their
   `NODE_ENV !== 'development'` guards — they write to the filesystem /
   upload with server credentials and have no auth of their own.
4. Tiptap extensions in `components/editor/tiptap-editor.tsx` and
   `lib/render.ts` must stay in sync, or saved content renders differently
   than it looked in the editor.
5. Slugs are validated (`lib/posts.ts` `isValidSlug`) before any filesystem
   path is built — keep that, it prevents path traversal.

## Email broadcasting (not included)

Recur's server SDK has no "list all customers" API, so this template does
not send new-post emails. If you need broadcasts: collect emails from
`checkout.completed` webhook events into your own store, or export
subscribers from the Recur dashboard, then send via Resend/Postmark.
Mark that work clearly — it needs a datastore this template deliberately
avoids.

## Commands

```bash
pnpm dev        # dev server on :3000 (editor enabled)
pnpm build      # production build (requires env vars set, dummies OK)
pnpm typecheck  # tsc --noEmit
```

## Environment

See `.env.example`. Minimum to run: the three Recur keys. `AUTH_SECRET`
required in production. `R2_*` (5 vars) only for editor image upload.

## Related skills

`/recur-checkout`, `/recur-webhooks`, `/recur-entitlements`, `/recur-portal`.

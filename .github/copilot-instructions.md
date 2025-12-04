<!-- Copilot/AI agent instructions for the Luxora e‑commerce app (concise) -->

## Purpose
Quick, repo-specific guidance for AI coding agents to be productive immediately.

## Quickstart (commands)
- Dev: `npm run dev` (runs `next dev -p 4007`).
- Build: `npm run build` (uses `--turbopack`).
<!-- Copilot/AI agent instructions for the Luxora e‑commerce app (concise) -->

## Purpose
Short, actionable guidance to get an AI coding agent productive in this repo.

## Quick commands
- Dev: npm run dev  (starts Next.js on port 4007)
- Build: npm run build  (uses --turbopack)
- Start: npm run start
- Seed DB: npm run seed  (runs `npx tsx ./lib/db/seed.ts`)
- Email preview: npm run email  (starts @react-email preview; used for email templates under `emails/`)
- Lint: npm run lint

## Big picture (what to know first)
- Next.js App Router + TypeScript + Tailwind. Top-level locale segment: `app/[locale]` — route groups are used via parentheses (e.g. `(auth)`, `(home)`, `(root)`). Preserve this structure when adding routes.
- Server-only logic lives in `lib/` (payments, email, utilities) and `lib/actions/*` (server actions). Database models live in `lib/db/models/*` and DB helpers in `lib/db`.
- UI primitives are under `components/ui/*`; higher-level app components live in `components/shared/*`. Client-only components are explicit (`-client.tsx`).

## Project-specific patterns & conventions
- Server actions: placed in `lib/actions/*.ts` and must start with "use server". Typical flow: call `connectToDatabase()` (see `lib/db/index.ts`), perform model operations, then call `revalidatePath()` when you change server-rendered data.
- Database: uses Mongoose. Always call `connectToDatabase()` before DB access. Models are under `lib/db/models/*` (e.g., `order.model.ts`, `product.model.ts`).
- Payments & external integrations: centralized in `lib/` — see `lib/paypal.ts`, `lib/bkash.ts`, and `lib/stripe` usages. Mimic existing error handling patterns (see `formatError` in `lib/utils.ts`).
- Localization: uses `next-intl`; new routes must live under the `app/[locale]` segment.
- State: client state uses `zustand` in `hooks/*` (e.g., `use-cart-store.ts`).

## Files to inspect for examples
- `lib/actions/order.actions.ts` — server action patterns, DB calls, `revalidatePath()` usage, emails and affiliate logic.
- `lib/db/index.ts` — `connectToDatabase()` (must be called before DB ops).
- `lib/paypal.ts`, `lib/bkash.ts` — payment integration patterns.
- `components/ui/*` and `components/shared/*` — UI primitives and composition.
- `emails/*.tsx` — email templates using `@react-email` and the preview server.

## Environment & secrets (what you must set)
- Required: MONGODB_URI, NEXTAUTH_* (AUTH_SECRET, GOOGLE keys), PAYPAL_*, STRIPE_*, RESEND API key, BKASH_*.
- Local dev: app runs at http://localhost:4007 by default (see `.env.local` for example values).

## Do / Don't (practical rules)
- Do: keep server-only modules out of client components. Prefer server components unless UI interaction requires client state.
- Do: follow existing response shapes for server actions ({ success, message, data }) to keep callers consistent.
- Don't: rename or move the `app/[locale]` layout or route-group folders without updating every link and middleware — the router structure is relied upon.

## Quick troubleshooting
- If pages error on DB access, verify `connectToDatabase()` is called and MONGODB_URI is set.
- If emails don't render, run `npm run email` to view templates locally.

---
If anything above is unclear or you'd like more examples/tests/CI recommendations, tell me which section to expand.
If anything here is unclear or you want extra detail (tests, CI, deploy), tell me which area to expand.

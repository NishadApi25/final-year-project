<!-- Repository-specific Copilot / AI agent instructions (concise) -->

**Purpose**
- **Goal:** Get an AI coding agent productive quickly in this Next.js + TypeScript e‑commerce repo.
- **Scope:** Concrete, discoverable patterns only – file locations, conventions, commands, and integration points.

**Quick Commands**
- **Dev:** `npm run dev` — starts Next.js on port `4007`.
- **Build:** `npm run build` — uses `--turbopack`.
- **Start:** `npm run start`.
- **Seed DB:** `npm run seed` (runs `npx tsx ./lib/db/seed.ts`).
- **Email preview:** `npm run email` (preview `emails/` templates).
- **Lint:** `npm run lint`.

**Big Picture**
- **App router:** Next.js App Router with a top-level locale segment at `app/[locale]`. Route groups use parentheses (e.g. `(auth)`, `(home)`). Do NOT move or rename `app/[locale]` without updating links/middleware.
- **Server vs Client:** Server-only logic lives in `lib/` and `lib/actions/*`. UI primitives are under `components/ui/*`; higher-level UI is in `components/shared/*`. Client-only components end with `-client.tsx`.
- **DB:** Mongoose models and DB helpers live in `lib/db/*` (see `lib/db/index.ts` and `lib/db/models/*`).

**Project Patterns (must-follow)**
- **Server actions:** Stored in `lib/actions/*.ts`. They must start with `use server` and normally follow this flow: call `connectToDatabase()` (from `lib/db/index.ts`), perform model ops, then call `revalidatePath()` when mutating server-rendered data.
- **DB guard:** Always call `connectToDatabase()` before accessing models.
- **Response shape:** Server actions and APIs commonly return `{ success, message, data }`. Preserve this shape when adding new endpoints.
- **Localization:** Uses `next-intl`. New routes and pages must be placed under `app/[locale]`.
- **State stores:** Client state uses `zustand` in `hooks/*` (e.g., `hooks/use-cart-store.ts`). Prefer server components unless client interactivity is required.

**Integrations & Cross-Cutting Files**
- **Payments & external APIs:** Implementations are centralized in `lib/` — see `lib/paypal.ts`, `lib/bkash.ts`, and `lib/stripe` usages. Mimic error handling patterns (see `lib/utils.ts::formatError`).
- **Emails:** Templates live in `emails/*.tsx` (uses `@react-email`). Use `npm run email` to preview locally.

**Examples (use these as templates)**
- **Server action pattern:** `lib/actions/order.actions.ts` — DB connect, model ops, `revalidatePath()`, and email sending flows.
- **DB helper:** `lib/db/index.ts` — `connectToDatabase()` usage and model exports.
- **Payments:** `lib/paypal.ts`, `lib/bkash.ts` — how external calls and secrets are used.

**When editing / PR guidance**
- **Small edits:** Keep changes minimal and localized. Follow existing style and export shapes.
- **DB edits:** Ensure `connectToDatabase()` is present and update any affected server-rendered pages with `revalidatePath()` if needed.
- **Routing edits:** Do not restructure `app/[locale]` route groups; breakage is likely if route-group folders are renamed/moved.

**Environment & Secrets**
- **Required envs:** `MONGODB_URI`, `NEXTAUTH_*` (AUTH_SECRET, Google creds), `PAYPAL_*`, `STRIPE_*`, `RESEND_API_KEY`, `BKASH_*`.
- **Local URL:** App runs at `http://localhost:4007` by default.

**Quick Verification Checks**
- **If DB errors occur:** confirm `connectToDatabase()` is called and `MONGODB_URI` is set.
- **If emails fail:** run `npm run email` to preview templates in `emails/`.

If anything here is unclear or you want more examples, tests, or CI recommendations, tell me which section to expand.
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

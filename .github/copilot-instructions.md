<!-- Copilot/AI agent instructions for the Luxora e‑commerce app (concise) -->

## Purpose
Quick, repo-specific guidance for AI coding agents to be productive immediately.

## Quickstart (commands)
- Dev: `npm run dev` (runs `next dev -p 4007`).
- Build: `npm run build` (uses `--turbopack`).
- Start: `npm run start`.
- Seed DB: `npm run seed` → `npx tsx ./lib/db/seed.ts`.
- Lint: `npm run lint`.

## Big Picture
- Next.js App Router + TypeScript + Tailwind. Routes live under `app/[locale]` and use route groups named in parentheses (e.g., `(auth)`, `(home)`, `(root)`).
- Server-only logic and integrations live in `lib/` (for example `lib/db/*`, `lib/paypal.ts`, `lib/bkash.ts`).
- UI primitives: `components/ui/*`; higher-level app components: `components/shared/*`.

## Key Patterns & Examples
- Localization: top-level dynamic segment `app/[locale]` and `next-intl` usage — preserve folder structure when adding routes.
- Route groups: use folders like `app/[locale]/(auth)/sign-in/page.tsx` for grouping UI and middleware concerns.
- Server actions: placed in `lib/actions/*.ts` and typically start with `"use server"`.
  - Example: `lib/actions/order.actions.ts` uses `createOrder`, calls `connectToDatabase()` and triggers `revalidatePath`.
- Database: uses MongoDB + Mongoose in `lib/db/*`. Call `connectToDatabase()` before model operations.
- Client vs Server components: files with `-client.tsx` are explicit client components. Prefer server components unless client interactivity is required. Add `"use client"` only when necessary.
- State: client state uses `zustand` stores under `hooks/*` (e.g., `use-cart-store.ts`).

## Integration & External Dependencies
- Payments: `lib/paypal.ts`, `lib/bkash.ts`, and `lib/stripe` code are centralized under `lib/`.
- Email templates: `emails/*.tsx` (uses `@react-email` / `resend`).
- Auth: `auth.ts` and `auth.config.ts` with `next-auth` and `@auth/mongodb-adapter`.

## Implementation Guidance (do this, specifically)
- When authoring new server actions:
  - Add `"use server"` at top.
  - Call `connectToDatabase()` before DB usage.
  - Return structured responses: `{ success: boolean, message?: string, data?: any }`.
- When changing server data, search for and update calls to `revalidatePath` in `lib/actions/*`.
- Avoid importing server-only modules into client components.

## Important Files to Inspect
- Routes: `app/[locale]/...` (route groups like `(auth)`).
- Server logic: `lib/actions/*.ts` and `lib/*.ts` (payments, utils).
- DB: `lib/db/client.ts`, `lib/db/index.ts`, `lib/db/models/*`.
- UI: `components/ui/*` and `components/shared/*`.

## Environment Variables (check before running)
- `MONGODB_URI` (DB). `NEXTAUTH_*`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (auth).
- `PAYPAL_CLIENT_ID`, `PAYPAL_APP_SECRET`, `PAYPAL_API_URL` (PayPal).
- `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_API_URL`, `BKASH_CALLBACK_URL` (bKash).
- Keep non-`NEXT_PUBLIC_` secrets server-side.

## Small Notes / Do Not Change
- Do not rework the `app/[locale]` layout or route group names without broad refactor — many links assume these paths.

## Next Steps / Asking for Feedback
If anything here is unclear or you want extra detail (tests, CI, deploy), tell me which area to expand.

---
Updated: concise agent guidance with repo examples. Please review and tell me what to expand or keep.

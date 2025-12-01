<!-- Copilot/AI agent instructions for the Luxora e‑commerce app -->
# Repository Overview

This is a Next.js (App Router) e‑commerce project (Next 15, React 19, TypeScript, Tailwind). The app is organized around the `app/` directory with localized routes (`[locale]`) and route groups named with parentheses (for example `(auth)`, `(root)`, `(home)`). Server-only code (database, payment integrations, server actions) lives under `lib/` and `lib/db`.

# Quickstart / Important Commands

- Dev server (nonstandard port): `npm run dev` — Next runs on port `4007` by default.
- Build: `npm run build` (uses `--turbopack`).
- Start: `npm run start`.
- Seed local DB: `npm run seed` (runs `npx tsx ./lib/db/seed.ts`).
- Lint: `npm run lint` (runs ESLint using project config).

# Where to look for key behavior

- Routes & pages: `app/[locale]/...` — localized pages and route groups. Example: `app/[locale]/(auth)/sign-in/page.tsx`.
- UI primitives vs app components: `components/ui/*` contains low-level design primitives (buttons, inputs, dialogs). `components/shared/*` contains higher-level, app-specific components.
- Server logic / actions: `lib/actions/*.ts` contains server actions (many files use `"use server"`). These are canonical locations for business logic invoked from server components.
- Database: `lib/db/*` (`client.ts`, `index.ts`, `models/*`) — uses MongoDB (native MongoClient + Mongoose). Always check `connectToDatabase()` before mongoose model operations.
- Payments / external APIs: `lib/paypal.ts`, `lib/bkash.ts`, `lib/stripe` (refer to `lib/` for integrations). Email templates: `emails/*.tsx` (uses `@react-email` / `resend`).

# Conventions & patterns to follow

- Route groups: folders named in parentheses (e.g., `(auth)`) are used to group UI and edge concerns — prefer adding UI to the correct group.
- Localization: top-level dynamic segment is `app/[locale]`. Use `next-intl` patterns already present in the project.
- Server actions: library functions under `lib/actions` frequently declare `"use server"`. These expect server runtime and database access — do not import them into purely client components unless deliberately forwarded.
- Client/server split: files with `-client.tsx` suffix are explicitly client components; otherwise, assume server component by default. Use `"use client"` only when necessary.
- Revalidation & caching: code uses `revalidatePath` and Next caching utilities in `lib/actions` — when changing server-side data, find and update revalidation calls.
- Stores: client state uses `zustand` in `hooks/*` (e.g., `use-cart-store.ts`) — use existing stores rather than global ad-hoc state.

# Environment variables (most important)

- `MONGODB_URI` — required by `lib/db`.
- `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_API_URL`, `BKASH_CALLBACK_URL` — used by `lib/bkash.ts`.
- `PAYPAL_CLIENT_ID`, `PAYPAL_APP_SECRET`, `PAYPAL_API_URL` — used by `lib/paypal.ts`.
- `NEXTAUTH_*` / OAuth client ids (Google): NextAuth uses environment variables the provider expects (e.g. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
- `NEXT_PUBLIC_*` prefix: only expose variables with `NEXT_PUBLIC_` when they must be available to client code.

# Typical edit & debug flows

- Local dev: run `npm run dev` then open `http://localhost:4007` (note port). Use the browser to test routes under `app/[locale]`.
- To iterate on server actions: edit `lib/actions/*`, then refresh pages and watch revalidation where applicable (or call `revalidatePath` manually where the code does so).
- DB seeding: run `npm run seed` to populate sample data used by the UI.

# Files to inspect for common tasks (examples)

- Authentication: `auth.ts`, `auth.config.ts` (uses `next-auth` v5 beta and `@auth/mongodb-adapter`).
- Cart / Orders: `lib/actions/order.actions.ts` — shows `createOrder`, PayPal/bKash flows and `revalidatePath` usage.
- Payments: `lib/bkash.ts`, `lib/paypal.ts`.
- Database connection: `lib/db/client.ts`, `lib/db/index.ts`, `lib/db/models/*`.
- UI primitives: `components/ui/*` and higher-level usage in `components/shared/*`.

# Helpful examples for code generation

- When creating a new server action, follow existing style in `lib/actions/*`:
  - Use `"use server"` at top
  - Call `connectToDatabase()` before DB operations
  - Return structured `{ success: boolean, message?: string, data?: any }` where possible (many functions follow this pattern)

- When adding routes, follow the grouping and localization pattern under `app/[locale]` and maintain folder structure (use `(auth)`, `(home)`, `(root)` groups as appropriate).

# What not to change without reason

- Don't change the app router / locale folder layout or route group names — many components and links assume these paths.
- Avoid exposing server secrets to client code — keep non-`NEXT_PUBLIC_` env vars server-side.

# Questions / Next steps

If you want, I can:
- Add a short checklist to `START_HERE.md` that maps to these instructions.
- Run a smoke dev start and verify environment warnings (I will not run it without your permission).

If anything above is missing or unclear, tell me which area to expand (deploy, tests, CI, or environment examples).

# Repository Guidelines

## Project Context

ViperSport is a Next.js 16 App Router MVP for Fuad Abdul-Aziz's portfolio and the Argentina vs Austria live match show registration flow in Bangladesh.

Read these files before making non-trivial changes:

- `context/project.md` for product scope, business rules, event details, routes, schema, and environment variables.
- `context/architecture.md` for rendering strategy, component ownership, API contracts, Supabase client usage, and data flow.
- `context/rules.md` for coding standards and repo-specific constraints.

## Common Commands

- `npm run dev` starts the local Next.js server.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript with `--noEmit`.
- `npm run build` verifies the production build.

Run lint and typecheck after code changes when feasible. Run build for larger changes or route/data-flow changes.

## Code Standards

- TypeScript must stay strict. Do not use `any`; define exact types.
- Follow Next.js 16 App Router conventions.
- Use `proxy.ts` for route protection. Do not create `middleware.ts`.
- Use `next/link` for internal navigation.
- Use `next/image` for images. Do not use raw `<img>` tags.
- Use Tailwind CSS v4 patterns already present in the app.
- Use GSAP for animations. Do not add Framer Motion.
- Use React Hook Form and Zod for forms.
- Use Zustand for shared client state.
- Keep code production-ready. Do not add placeholders, TODO stubs, or demo-only branches.

## App Structure

- Public pages live under `app/(public)`.
- Admin pages live under `app/(admin)/admin`.
- Route handlers live under `app/api`.
- Shared UI primitives live under `components/ui`.
- Feature components are grouped by domain under `components/home`, `components/register`, and `components/admin`.
- Supabase helpers live in `lib/supabase`.
- Shared types live in `types/index.ts`.

## Supabase Rules

- Server Components, Route Handlers, and `proxy.ts` must use the server Supabase helper from `lib/supabase/server.ts`.
- Client Components must use the browser Supabase helper from `lib/supabase/client.ts`.
- Never import the server client into a Client Component.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or other secret keys to browser code.
- Keep RLS and policy changes in migrations under `supabase/migrations`.
- Prefer current Supabase docs or the local Supabase skill before changing auth, RLS, migrations, or client setup.

## Caching And Rendering

- Use `use cache` only for static portfolio/media data.
- Do not use `use cache` for admin pages, registration flows, success pages, auth/session work, API handlers, or request-time data.
- Do not use deprecated `fetch()` cache options for Next.js 16 patterns.

## Environment

Required runtime variables are documented in `.env.example` and `context/project.md`.

- Public browser-safe values must be prefixed with `NEXT_PUBLIC_`.
- Secrets must remain server-only.
- Local `.env` files may contain credentials; do not print secret values in logs or responses.

## Working Notes

- The expected event is on 22 June 2026 at Shahi Eidgah Maidan, TV Gate, Sylhet.
- Registration is free and expected capacity is 500+.
- SMS failures must not block registration success.
- QR generation happens client-side on the success screen.
- Admin check-in must support QR scanning and manual search.

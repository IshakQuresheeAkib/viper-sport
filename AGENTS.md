# Repository Guidelines

## Project Context

ViperSport is a Next.js 16 App Router MVP for Fuad Abdul-Aziz's portfolio and the Argentina vs Austria live match show registration flow in Bangladesh.

Read these files before making non-trivial changes:

- [`project.md`](./project.md) — product scope, business rules, event details, routes, schema, API, and environment variables
- [`Design.md`](./Design.md) — Kinetic Dark design tokens, typography, and component guidelines
- [`.cursorrules`](./.cursorrules) — strict coding constraints for AI-assisted development

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
- Shared components live under `components/shared`.
- Hooks live under `hooks/` (e.g. `useActiveSection` for home scroll spy).
- Supabase helpers live in `lib/supabase` (`client.ts`, `server.ts`, `admin.ts`).
- Shared types live in `types/index.ts`.
- Home navigation anchors are centralized in `lib/home-nav.ts`.

## Rendering & Data Flow

| Surface         | Strategy                                                                      |
| --------------- | ----------------------------------------------------------------------------- |
| Portfolio (`/`) | Server page; client sections with GSAP; scroll-spy nav                        |
| Register        | Server page shell; client form via React Hook Form                            |
| Success         | Client `SuccessCard` — fetches `/api/register/[id]`, generates QR client-side |
| Admin dashboard | Server fetch or client table; filter ≤500 rows client-side                    |
| Admin check-in  | Client QR scanner (`html5-qrcode`) + manual search                            |
| API routes      | Server-only; Supabase admin client for writes                                 |

- Use `use cache` only for static portfolio/media data.
- Do not use `use cache` for admin pages, registration flows, success pages, auth/session work, API handlers, or request-time data.
- Do not use deprecated `fetch()` cache options for Next.js 16 patterns.

## Supabase Rules

- Server Components, Route Handlers, and `proxy.ts` must use the server Supabase helper from `lib/supabase/server.ts`.
- Client Components must use the browser Supabase helper from `lib/supabase/client.ts`.
- Admin API routes use `lib/supabase/admin.ts` (service role).
- Never import the server or admin client into a Client Component.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or other secret keys to browser code.
- Keep RLS and policy changes in migrations under `supabase/migrations`.
- Prefer current Supabase docs or the local Supabase skill before changing auth, RLS, migrations, or client setup.

## Environment

Required runtime variables are documented in `.env.example` and `project.md`.

- Public browser-safe values must be prefixed with `NEXT_PUBLIC_`.
- Secrets must remain server-only.
- Local `.env` files may contain credentials; do not print secret values in logs or responses.

## Working Notes

- The expected event is on 22 June 2026 at Kobi Nazrul Auditorium, Rikabibazar, Sylhet.
- Registration is free and expected capacity is 500+.
- SMS failures must not block registration success.
- QR generation happens client-side on the success screen; downloadable pass via `lib/pass.ts`.
- Admin check-in must support QR scanning and manual search.
- Phone numbers are canonicalized before storage (`lib/phone.ts`).

## Brand & UI Tokens

- The live digital UI uses the **Kinetic Dark** system in `Design.md` and `app/globals.css`.
- Primary interactive accent: electric lime (`kinetic-primary-container`, `#d3ed86`).
- Coral (`secondary`, `#ffb4ab`) is reserved for live/urgent status accents (e.g. event banner).
- Legacy `#990011` in `.cursorrules` is the original print/brand red; prefer kinetic lime tokens for in-app CTAs and focus states.
- Display typography: **Anybody**. Body: **Plus Jakarta Sans**.

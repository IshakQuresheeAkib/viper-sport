# Architecture — ViperSport Event

> Single source of truth for system design, data flow, auth, API contracts, and component ownership.
> Read alongside `project.md` (business goals, DB schema, env vars) and `rules.md` (coding standards).

---

## Stack Versions (Pinned)

| Package | Version |
|---|---|
| next | 16.x (App Router) |
| react | 19.x (Compiler enabled) |
| typescript | 5.x (strict) |
| tailwindcss | 4.x |
| @supabase/ssr | latest |
| @supabase/supabase-js | latest |
| zustand | latest |
| react-hook-form | latest |
| zod | latest |
| gsap | latest |
| shadcn/ui | latest |
| qrcode | latest |
| html5-qrcode | latest |

---

## Folder Structure

```
vipersport-event/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                      # Home / Portfolio
│   │   ├── register/
│   │   │   ├── page.tsx                  # Registration form
│   │   │   └── success/
│   │   │       └── page.tsx              # Success + QR screen
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx                  # Admin login
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── checkin/
│   │   │       └── page.tsx
│   ├── api/
│   │   ├── register/
│   │   │   ├── route.ts                  # POST — submit registration
│   │   │   └── [id]/
│   │   │       └── route.ts              # GET — fetch by registration_id
│   │   └── admin/
│   │       ├── registrations/
│   │       │   └── route.ts              # GET — all registrations (auth)
│   │       └── checkin/
│   │           └── route.ts              # PATCH — mark checked in (auth)
│   ├── globals.css
│   └── layout.tsx                        # Root layout — fonts, metadata
│
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── CollabSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── EventBanner.tsx
│   │   └── ContactSection.tsx
│   ├── register/
│   │   ├── RegisterForm.tsx              # RHF + Zod form, client component
│   │   └── SuccessCard.tsx               # QR display, client component
│   ├── admin/
│   │   ├── StatsCards.tsx
│   │   ├── RegistrationsTable.tsx
│   │   ├── QRScanner.tsx                 # html5-qrcode wrapper
│   │   └── ManualSearch.tsx
│   └── ui/                              # shadcn/ui primitives
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # createBrowserClient (@supabase/ssr)
│   │   └── server.ts                     # createServerClient (@supabase/ssr)
│   ├── sms.ts                            # sms.net.bd REST helper
│   ├── qr.ts                             # qrcode generation helper
│   └── validations/
│       └── register.schema.ts            # Zod schema — registration form
│
├── store/
│   ├── useRegistrationStore.ts           # registration UI state
│   └── useAdminStore.ts                  # admin table filters, search term
│
├── types/
│   └── index.ts                          # all shared TypeScript types
│
├── proxy.ts                              # route protection (replaces middleware.ts)
├── public/
│   └── images/                          # favicon, logo, static critical assets only
├── .env.local
└── next.config.ts
```

---

## Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | SSR + `use cache` | Portfolio content — SEO critical |
| `/register` | Client Component | Interactive form, no SEO need |
| `/register/success` | Client Component | QR generated client-side |
| `/admin` | Client Component | Login form |
| `/admin/dashboard` | Server Component + Client Table | Fetch once server-side, filter client-side |
| `/admin/checkin` | Client Component | Camera access, real-time feedback |

> Use `use cache` directive for SSR data fetching. Never use `fetch()` cache options (deprecated in Next.js 15+).

---

## Data Flow

### Registration Flow

```
User fills /register form (RHF + Zod)
  → POST /api/register
    → Supabase: check duplicate by phone
    → if exists: return existing registration
    → if new: insert row, get registration_id
    → fire SMS via sms.net.bd (non-blocking, fire-and-forget)
    → return { registration_id, first_name, last_name }
  → redirect to /register/success?id={registration_id}
    → GET /api/register/[id]
    → render SuccessCard with name, ID, event info
    → generate QR client-side from registration_id (qrcode pkg)
```

### Admin Check-In Flow

```
Admin opens /admin/checkin
  → QR Scan tab: html5-qrcode scans code
    → PATCH /api/admin/checkin { registration_id }
      → Supabase: set checked_in = true, checked_in_at = now()
      → return updated row
    → show success / already-checked-in toast

  → Manual Search tab: search by phone or name
    → filter from useAdminStore (pre-fetched registrations)
    → confirm check-in → same PATCH /api/admin/checkin
```

---

## Auth Flow

```
Admin visits /admin/* route
  → proxy.ts intercepts
    → createServerClient (@supabase/ssr) reads session cookie
    → no valid session → redirect to /admin
    → valid session → allow through

/admin page (login form)
  → supabase.auth.signInWithPassword()
  → on success → redirect to /admin/dashboard

/admin/dashboard or /admin/checkin API calls
  → server route handlers use createServerClient
  → verify auth.getUser() before any DB operation
  → no valid user → 401
```

> Auth is email/password only. Single admin user created manually in Supabase dashboard. No public sign-up.

---

## API Contracts

### `POST /api/register`

**Request**
```ts
{ first_name: string; last_name: string; phone: string }
```

**Response 200**
```ts
{ registration_id: string; first_name: string; last_name: string; already_registered: boolean }
```

**Response 422** — Zod validation failure
**Response 429** — Rate limited by IP
**Response 500** — Supabase error

---

### `GET /api/register/[id]`

**Params:** `id` = `registration_id` (e.g. `REG-XXXXXXXX`)

**Response 200**
```ts
{
  registration_id: string
  first_name: string
  last_name: string
  phone: string
  created_at: string
  checked_in: boolean
}
```

**Response 404** — Not found

---

### `GET /api/admin/registrations`

**Auth:** Required (Supabase session cookie)

**Response 200**
```ts
Registration[] // full rows from registrations table
```

**Response 401** — Unauthenticated

---

### `PATCH /api/admin/checkin`

**Auth:** Required

**Request**
```ts
{ registration_id: string }
```

**Response 200**
```ts
{ success: true; already_checked_in: boolean; checked_in_at: string }
```

**Response 404** — Registration not found
**Response 401** — Unauthenticated

---

## Zustand Store Design

### `useRegistrationStore`

```ts
interface RegistrationState {
  registrationId: string | null
  firstName: string | null
  lastName: string | null
  setRegistration: (data: Pick<RegistrationState, 'registrationId' | 'firstName' | 'lastName'>) => void
  reset: () => void
}
```

> Used to pass registration result from form → success page without relying solely on URL params.

---

### `useAdminStore`

```ts
interface AdminState {
  registrations: Registration[]
  searchTerm: string
  statusFilter: 'all' | 'checked_in' | 'pending'
  setRegistrations: (data: Registration[]) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (filter: AdminState['statusFilter']) => void
}
```

> Registrations fetched once on dashboard load, all filtering done client-side. No pagination (≤500 rows).

---

## Component Ownership

| Component | Type | Data Source |
|---|---|---|
| `HeroSection` | Server | Static / Cloudinary |
| `AboutSection` | Server | Static |
| `StatsSection` | Client | Static (GSAP counter) |
| `CollabSection` | Server | Static / Cloudinary |
| `GallerySection` | Server | Cloudinary API |
| `EventBanner` | Server | Static |
| `ContactSection` | Client | Form submission |
| `RegisterForm` | Client | RHF + Zod → POST /api/register |
| `SuccessCard` | Client | GET /api/register/[id] + qrcode |
| `StatsCards` | Server | GET /api/admin/registrations |
| `RegistrationsTable` | Client | useAdminStore |
| `QRScanner` | Client | html5-qrcode → PATCH /api/admin/checkin |
| `ManualSearch` | Client | useAdminStore → PATCH /api/admin/checkin |

---

## Supabase Client Usage Rules

| Context | Client to Use | Import From |
|---|---|---|
| Server Components | `createServerClient` | `lib/supabase/server.ts` |
| Route Handlers (API) | `createServerClient` | `lib/supabase/server.ts` |
| `proxy.ts` | `createServerClient` | `lib/supabase/server.ts` |
| Client Components | `createBrowserClient` | `lib/supabase/client.ts` |

> Never import server client in a Client Component. Never import browser client in a Route Handler.

---

## Image & Media Rules

- All portfolio images, gallery videos, brand logos, and hero assets → Cloudinary CDN
- Rendered via `next/image` with Cloudinary loader
- Exceptions (served from `/public`): favicon, site logo, OG image
- Never use raw `<img>` tags anywhere

---

## proxy.ts — Protected Routes

Protects all `/admin/dashboard` and `/admin/checkin` routes.
Reads Supabase session via `@supabase/ssr` cookie utilities.
Redirects unauthenticated users to `/admin`.

```
Matcher: ['/admin/dashboard', '/admin/dashboard/:path*', '/admin/checkin', '/admin/checkin/:path*']
```

---

## Performance Constraints

- Mobile-first. Sub-3s load on 3G/4G (Sylhet target market)
- GSAP animations only on `will-change: transform` elements
- Disable animations on slow connections via `navigator.connection.effectiveType`
- QR code generated fully client-side — zero server round-trip on success page
- Admin dashboard: fetch all rows once, filter in-memory via Zustand

---

## Key Constraints & Notes

- `proxy.ts` replaces `middleware.ts` entirely — do not create a `middleware.ts`
- `use cache` for all server-side data fetching — never `fetch()` cache options
- No `any` in TypeScript — ever
- GSAP only for animations — no Framer Motion
- RHF + Zod only for forms — no uncontrolled inputs
- Zustand only for global state — no Context API for shared state
- `next/link` for all internal navigation — no `<a>` tags
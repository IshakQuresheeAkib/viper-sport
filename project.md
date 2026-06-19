# ViperSport Event — Project Documentation

**Project:** Fuad Abdul-Aziz Portfolio + Argentina vs Austria Live Match Show Registration
**Phase:** MVP v1
**Market:** Bangladesh
**Hosting:** Vercel (Hobby Free Tier) + Supabase (Free Tier)

---

## Meta

- **Framework:** Next.js 16 (App Router)
- **Runtime:** React 19 (Compiler)
- **Language:** TypeScript 5.x (strict, no `any`)
- **Styling:** Tailwind CSS v4
- **UI Components:** Custom components (Button, Input, Badge, Toaster) using Kinetic Dark design system
- **Animations:** GSAP
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (admin only)
- **Images:** Cloudinary + `next/image`
- **SMS:** sms.net.bd (Alpha SMS Gateway — REST API)
- **QR:** `qrcode` npm package (client-side generation)
- **QR Scanner:** `html5-qrcode` npm package (admin check-in)
- **Social Card:** `html-to-image` npm package (client-side card PNG export)
- **Image Compression:** `browser-image-compression` npm package (selfie compression before Cloudinary upload)
- **Deployment:** Vercel

---

## Brand & Design System

The live UI uses the **Kinetic Dark** system defined in `Design.md` and `app/globals.css`.

- **Surface:** `#13140d` (dark charcoal)
- **Primary accent:** Electric lime `#d3ed86` (`kinetic`) — CTAs, focus, glow borders
- **Live / urgent:** Coral `#ffb4ab` (`secondary`) — event banner, live indicators
- **On-surface text:** `#e4e3d8` with secondary cream `#cec4c2`
- **Display font:** Baloo Tamma 2 (500/600/700/800) — hero, headings, stats
- **Body font:** Plus Jakarta Sans (400/700) — paragraphs, forms, admin UI
- **Utility font:** Plus Jakarta Sans (400/700) — paragraphs, forms, admin UI

## Development Workflow

### Commands

```bash
npm run dev        # Start Next.js dev server (localhost:3000)
npm run build      # Production build verification
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking (tsc --noEmit)
```

### Pre-deployment Checks

Before deploying or committing large changes:

1. Run `npm run lint` to check for linting errors
2. Run `npm run typecheck` to ensure TypeScript strict mode compliance
3. Run `npm run build` to verify production build succeeds
4. Test critical flows: registration, admin login, check-in

### Code Quality

- **TypeScript strict mode** — No `any` types allowed; define exact types for all data
- **ESLint** — Enforces Next.js and React best practices
- **No placeholders or TODOs** — All code must be production-ready

---

## Project Documentation

The project maintains several documentation files at the root:

| File           | Purpose                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| `project.md`   | This file — comprehensive product spec, schema, routes, and technical architecture                      |
| `Design.md`    | Kinetic Dark design system tokens, typography, color palette, and component design guidelines           |
| `AGENTS.md`    | Repository guidelines for AI agents — coding standards, structure, rendering strategies, Supabase rules |
| `.cursorrules` | Strict coding constraints for AI-assisted development — tech stack, patterns, and anti-patterns         |
| `README.md`    | Project setup, installation, and quick start guide                                                      |

**For AI-assisted development:** Always read `project.md`, `Design.md`, `AGENTS.md`, and `.cursorrules` before making non-trivial changes.

---

## Business Goals

- **Portfolio:** Attract brand deals and sponsorships for Fuad Abdul-Aziz / ViperSport.
- **Registration:** Collect 500+ audience registrations for a one-time live match event.
- **Verification:** Fast, smooth check-in at the venue via QR scan or search.
- **Admin Control:** Protected dashboard to manage and verify registrations.

---

## 3. Coding Principles

- Always follow the patterns and decisions defined in the documentation. Suggest alternatives if any technology is not mentioned or if you think the alternative technology should be obviously used.
- Never use `any` in TypeScript. Always use exact types.
- Follow Next.js 16 conventions: use proxy.ts, not middleware.ts.
- Always strictly maintain best practices and follow the best performance-optimized way. Must ensure the principles, coding style, and syntax of the latest versions of Next.js 16, Tailwind version 4, and React 19 and always use latest versions
- All code must be production-ready and working. No placeholders, no TODO stubs.
- When generating code, stay consistent with the existing architecture described in the docs.
- For animations, use GSAP only. Do not suggest Framer Motion.
- For forms, use React Hook Form + Zod only.
- For the global state, use Zustand only.
- `next/image` for all images—never raw `<img>` tags
- `next/link` for all internal links/routes.
- Always use the latest, stable, and bug-free packages.
- Keep responses concise. Skip basic explanations. Use code blocks.

## Event Details

- **Event Name:** Argentina vs Austria: World Cup Live Match Show & Fan Engagement Event
- **Date:** 22 June 2026, 9:00 PM – 1:00 AM
- **Venue:** Kobi Nazrul Auditorium, Rikabibazar, Sylhet, Bangladesh
- **Ticket Type:** General (free, no payment)
- **Capacity:** 500+ expected registrations
- **Featuring:** Fahmidul Islam, Topu Barman, Md. Saad Uddin

---

## Pages & Routes

| Route               | Description                                    |
| ------------------- | ---------------------------------------------- |
| `/`                 | Home — Fuad Abdul-Aziz portfolio               |
| `/register`         | Public event registration form                 |
| `/register/success` | Post-registration success screen with QR       |
| `/get-your-card`    | Social card generator for registered attendees |
| `/admin`            | Protected admin login                          |
| `/admin/dashboard`  | Registration stats + table                     |
| `/admin/checkin`    | QR scanner + manual search                     |

---

## Portfolio Sections (`/`)

Ordered as they appear on `app/(public)/page.tsx`:

| #   | Section            | Component                          | Notes                                                                  |
| --- | ------------------ | ---------------------------------- | ---------------------------------------------------------------------- |
| —   | **Navigation**     | `DesktopNavbar`, `MobileBottomNav` | Scroll-spy via `useActiveSection` + `lib/home-nav.ts`                  |
| 1   | **Hero**           | `HeroSection`                      | Full-viewport split layout, profile image, social links, GSAP entrance |
| 2   | **Stats**          | `StatsSection`                     | 500M+ views, 1.4M+ followers, 5+ years — GSAP counter animation        |
| 3   | **Event Banner**   | `EventBanner`                      | `id="events"` — coral live accent, Register CTA → `/register`          |
| 4   | **About**          | `AboutSection`                     | `id="about"` — bio, Bangladesh/UK, ViperSport founder                  |
| 5   | **Collaborations** | `CollabSection`                    | Real Madrid, Apple, FIFA, Adidas, ViperSport                           |
| 6   | **Contact**        | `ContactSection`                   | `id="contact"` — sponsorship form → `partnerships@vipersport.com`      |
| 7   | **Footer**         | `FooterSection`                    | Copyright, social links via `SocialLinks` shared component             |

### Shared Components

- **SocialLinks:** Renders social media icon links using the `SocialIcon` component.
- **SocialIcon:** Individual social media icon with brand colors and hover effects.
- **ViperSportProfile:** Reusable profile card for register page sidebar (sticky on desktop).

### Home navigation anchors

Defined in `lib/home-nav.ts`:

| Label   | Anchor     | Section ID |
| ------- | ---------- | ---------- |
| Home    | `#hero`    | `hero`     |
| Events  | `#events`  | `events`   |
| Profile | `#about`   | `about`    |
| Contact | `#contact` | `contact`  |

### UI Primitives (`components/ui/`)

Custom-built components using the Kinetic Dark design system:

| Component | Description                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------- |
| `Button`  | Supports `lime`, `coral`, `neutral` variants with kinetic colors; loading states; works as Link |
| `Input`   | `KineticInput` with GSAP focus animations, error states, icon support, password toggle          |
| `Badge`   | Status badges with kinetic color variants                                                       |
| `Toaster` | Toast notification system for success/error messages                                            |

**Note:** These are custom implementations, not shadcn/ui base components. They are tailored to the Kinetic Dark design system with GSAP animations and kinetic color tokens.

---

## Registration (`/register`)

The register page uses a two-column layout: **RegisterEventDetails** (match, date, featured national stars) on the left and **RegisterForm** + **ViperSportProfile** on the right (sticky on desktop). Background uses a blurred profile image with kinetic charcoal scrim.

### Fields

| Field        | Type             | Required |
| ------------ | ---------------- | -------- |
| `first_name` | text             | Yes      |
| `last_name`  | text             | Yes      |
| `phone`      | text (BD format) | Yes      |

### Behavior

- Validated client-side with Zod (BD phone regex: `/^(\+?880|0)1[3-9]\d{8}$/`).
- On submit → POST `/api/register`.
- API route: deduplicates by phone (returns existing registration if already registered), inserts to Supabase, assigns `registration_id` (`REG-` prefix), fires SMS via sms.net.bd, returns registration data.
- Redirects to `/register/success?id={registration_id}`.
- Rate limited by IP in the route handler (5 requests / minute per IP).
- Phone numbers normalized via `lib/phone.ts` before insert/lookup.

### Success Screen (`/register/success`)

- Fetches registration by ID from URL search param (`?id=`).
- **SuccessCard** displays name, registration ID, event details.
- QR code generated client-side via `lib/qr.ts` (`qrcode` package).
- Downloadable **ViperSport Pass** image via `lib/pass.ts` (canvas).
- GSAP confetti animation; share via Web Share API where supported.
- QR also sent via SMS; registration succeeds even if SMS fails.

### Registration Closed State

When capacity is reached, the registration can be closed via the `REGISTRATION_CLOSED` environment variable:

- **Default:** Registration is closed (seats filled).
- **To reopen:** Set `REGISTRATION_CLOSED=false` in environment variables.
- **Component:** `RegistrationClosed.tsx` renders a branded closure notice with:
  - Event details reminder (date, venue, capacity)
  - Back to home CTA
  - **Get Your Card** CTA → `/get-your-card`
  - Reminder for already-registered users to check their SMS
- **Logic:** `lib/registration.ts` exports `isRegistrationClosed()` helper used by the register page.
- **UI:** Uses kinetic error color (`coral`) for live/urgent accent and glass-card design matching the brand.

### SMS Content (sms.net.bd)

```
ViperSport Event: Registration confirmed!
Name: {first_name} {last_name}
ID: {registration_id}
Event: Argentina vs Austria Live Show
Date: 22 June 2026, 9PM
Venue: Kobi Nazrul Auditorium, Rikabibazar, Sylhet
Show this SMS or your QR code at the gate.
```

> SMS is sent non-blocking (fire-and-forget). Registration succeeds even if SMS fails.

---

## Get Your Card (`/get-your-card`)

Post-registration social card generator. Registered attendees enter their reg ID, upload a selfie, and receive a downloadable/shareable 9:16 portrait card for WhatsApp Status and Instagram Stories. Generation is entirely client-side — zero Vercel function cost for image export.

### Flow

1. **Validate reg ID** — React Hook Form + Zod; calls `GET /api/register/verify?id=`; returns `{ registration_id, first_name, last_name }` only (no phone).
2. **Upload selfie** — client-side validation (max 5 MB, jpg/png/webp); compress via `browser-image-compression` (target 1 MB, max 1200px); unsigned upload to Cloudinary from browser.
3. **Generate card** — offscreen `CardTemplate` (607×1080 CSS px, 9:16); `html-to-image` `toPng` at `pixelRatio: 2`; awaits `document.fonts.ready` and image preload before capture.
4. **Download & share** — programmatic download; native `navigator.share()` with file when `navigator.canShare({ files })` is supported.

### Card Content

- Full-bleed selfie (upper ~60%)
- Electric lime panel (`#d3ed86`) with attendee name, "I'm going to Matchday Live", event date/venue
- ViperSport wordmark

### Behavior

- No per-reg-ID generation limit; users may regenerate with a different photo anytime.
- Selfies retained in Cloudinary (`viper-sport/cards` folder via upload preset); no post-generation cleanup in MVP.
- Entry point: secondary CTA on `RegistrationClosed.tsx`.

### Components

| Component         | Path                                           | Role                                                             |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| `GetYourCardFlow` | `components/get-your-card/GetYourCardFlow.tsx` | Multi-step client flow                                           |
| `CardTemplate`    | `components/get-your-card/CardTemplate.tsx`    | Offscreen capture node (raw `<img>` exception for html-to-image) |

### Helpers

| Helper                     | Path                       | Purpose                               |
| -------------------------- | -------------------------- | ------------------------------------- |
| `uploadSelfieToCloudinary` | `lib/cloudinary-upload.ts` | Unsigned browser upload to Cloudinary |
| `captureCardImage`         | `lib/card-capture.ts`      | Font/image preload + `toPng` export   |

---

## State Management (Zustand)

The application uses Zustand for global client state. Three stores manage distinct flows:

### Registration Store (`store/useRegistrationStore.ts`)

Manages registration flow state across form submission and success page:

```typescript
{
  registrationId: string | null,
  firstName: string | null,
  lastName: string | null,
  setRegistration: (data) => void,
  reset: () => void
}
```

**Usage:**

- Form submission sets registration data via `setRegistration()`
- Success page reads `registrationId` to fetch full registration details
- `reset()` clears state after user navigates away

### Admin Store (`store/useAdminStore.ts`)

Manages admin dashboard state for filtering and search:

```typescript
{
  registrations: Registration[],
  searchTerm: string,
  statusFilter: AdminStatusFilter,  // "all" | "checked_in" | "pending"
  setRegistrations: (data) => void,
  setSearchTerm: (term) => void,
  setStatusFilter: (filter) => void
}
```

**Usage:**

- Dashboard fetches all registrations once and stores in `registrations`
- Client-side filtering by `searchTerm` (name/phone) and `statusFilter`
- No server pagination needed (≤500 rows)

### Card Store (`store/cardStore.ts`)

Manages the Get Your Card multi-step flow:

```typescript
{
  step: "validate" | "upload" | "generating" | "done" | "error",
  registration: CardRegistration | null,
  selfieUrl: string | null,
  cardDataUrl: string | null,
  cardBlob: Blob | null,
  error: string | null,
  setStep, setRegistration, setSelfieUrl, setCardResult, setError,
  resetToUpload, reset
}
```

**Usage:**

- Validate step stores `CardRegistration` and advances to upload
- Upload step stores Cloudinary `secure_url` and triggers generation
- Done step exposes download/share from `cardDataUrl` / `cardBlob`
- `resetToUpload()` clears photo/card state for regeneration

---

## Rendering & Data Flow Strategy

Different pages use different rendering strategies optimized for their use case:

| Surface             | Strategy                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Portfolio (`/`)** | Server page; client sections with GSAP; scroll-spy nav via `useActiveSection`                 |
| **Register**        | Server page shell; client form via React Hook Form + Zod validation                           |
| **Success**         | Client `SuccessCard` — fetches `/api/register/[id]`, generates QR client-side via `lib/qr.ts` |
| **Admin dashboard** | Server fetch or client table; filter ≤500 rows client-side via Zustand store                  |
| **Admin check-in**  | Client QR scanner (`html5-qrcode`) + manual search                                            |
| **API routes**      | Server-only; Supabase admin client (`lib/supabase/admin.ts`) for writes                       |

### Caching Rules

- **Use `use cache`** only for static portfolio/media data (e.g., Cloudinary image URLs, static content).
- **Do NOT use `use cache`** for:
  - Admin pages (auth-dependent)
  - Registration flows (user-specific)
  - Success pages (fetches by ID)
  - Auth/session work
  - API handlers
  - Request-time data

- **Do NOT use deprecated `fetch()` cache options** — Next.js 16 recommends `use cache` directive instead.

### Next.js Configuration (`next.config.ts`)

```typescript
{
  reactCompiler: true,  // React 19 Compiler enabled for automatic optimizations
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  }
}
```

**React Compiler:** Automatically optimizes React components by eliminating unnecessary re-renders without manual `useMemo`, `useCallback`, or `memo` usage.

### Supabase Client Usage Rules

**Critical:** Use the correct Supabase client for each context to avoid security issues:

| Context               | Client                      | Import                             | Notes                                           |
| --------------------- | --------------------------- | ---------------------------------- | ----------------------------------------------- |
| **Server Components** | Server client               | `lib/supabase/server.ts`           | Creates client with server-side cookie handling |
| **Route Handlers**    | Server client               | `lib/supabase/server.ts`           | Same as Server Components                       |
| **Admin API routes**  | Admin client (service role) | `lib/supabase/admin.ts`            | Full access, bypasses RLS — use for writes only |
| **Client Components** | Browser client              | `lib/supabase/client.ts`           | Browser-safe, uses anon key                     |
| **`proxy.ts`**        | Server client (inline)      | `@supabase/ssr` createServerClient | Auth cookie refresh for protected routes        |

**Rules:**

- NEVER import server or admin client into Client Components
- NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to browser code
- Use admin client ONLY in API routes for writes (bypasses RLS)
- Keep RLS and policy changes in `supabase/migrations/`

---

## Admin (`/admin/*`)

### Auth

- Supabase Auth (email/password). Single admin user.
- Protected via `proxy.ts` at repo root (not `middleware.ts`) — redirects unauthenticated users from `/admin/dashboard` and `/admin/checkin` to `/admin`.
- Proxy matcher also protects `/register` path to refresh Supabase auth cookies.
- Auth helper: `lib/auth/admin.ts` exports `isAuthenticatedAdmin()` for server-side auth checks.
- No public sign-up. Admin created manually in Supabase dashboard.
- **AdminShell** provides sidebar (desktop) and bottom nav (mobile) across admin pages.

### Dashboard (`/admin/dashboard`)

**Stats cards:**

- Total Registrations
- Checked-In Count
- Remaining (not checked in)

**Registrations Table:**

- Columns: `#`, Name, Phone, Registration ID, Registered At, Status (checked-in / pending).
- Search by name or phone (client-side filter on fetched data for ≤500 rows — no server pagination needed).
- Filter by check-in status.
- CSV export button.

### Check-In Page (`/admin/checkin`)

- **QR Scan tab:** Uses `html5-qrcode` to activate device camera, scans QR, hits `PATCH /api/admin/checkin` with `registration_id`, marks row as checked in, shows success/already-checked-in feedback.
- **Manual Search tab:** Search by phone or name, shows result card, confirm check-in button.
- Works on mobile browser (volunteer's phone at the gate).

---

## Database Schema (Supabase / PostgreSQL)

### `registrations`

```sql
create table registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text unique not null default ('REG-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  qr_data text not null,
  sms_sent boolean not null default false,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);
```

### `admin_users`

```sql
create table admin_users (
  id uuid primary key references auth.users(id),
  email text not null,
  created_at timestamptz not null default now()
);
```

### Indexes

```sql
create index idx_registrations_phone on registrations(phone);
create index idx_registrations_registration_id on registrations(registration_id);
create index idx_registrations_checked_in on registrations(checked_in);
```

### Migrations

The project uses Supabase migrations in `supabase/migrations/`:

| File                                                      | Purpose                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| `20260616022413_init_vipersport_schema.sql`               | Initial schema setup                                         |
| `20260616085320_create_registrations_and_admin_users.sql` | Creates core tables (`registrations`, `admin_users`)         |
| `20260616085320_enable_rls_and_policies.sql`              | Enables RLS and sets up security policies                    |
| `20260618120000_canonicalize_registration_phones.sql`     | Backfills legacy phone formats to canonical `+880...` format |

**Phone Canonicalization:** Migration ensures all phone numbers are stored in canonical format (`+880...`) regardless of input format (`880...`, `0...`, or `+880...`).

### Row Level Security (RLS)

```sql
-- registrations: public insert, no public read
alter table registrations enable row level security;

create policy "allow_public_insert" on registrations
  for insert with check (true);

create policy "allow_admin_all" on registrations
  for all using (auth.role() = 'authenticated');

-- admin_users: authenticated read only
alter table admin_users enable row level security;

create policy "allow_admin_read" on admin_users
  for select using (auth.role() = 'authenticated');
```

---

## TypeScript Types (`types/index.ts`)

All shared types are centralized in `types/index.ts`:

### Core Types

```typescript
// Full registration record from database
type Registration = {
  id: string;
  registration_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  qr_data: string;
  sms_sent: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

// Public-facing registration data (excludes sensitive fields)
type PublicRegistration = Pick<
  Registration,
  | "registration_id"
  | "first_name"
  | "last_name"
  | "phone"
  | "created_at"
  | "checked_in"
>;

// Registration lookup (includes id for client-side operations)
type RegistrationLookup = PublicRegistration & Pick<Registration, "id">;
```

### API Response Types

```typescript
// POST /api/register response
type RegisterResponse = {
  registration_id: string;
  first_name: string;
  last_name: string;
  already_registered: boolean;
};

// PATCH /api/admin/checkin response
type CheckInResponse = {
  success: true;
  already_checked_in: boolean;
  checked_in_at: string;
};
```

### Admin Types

```typescript
// Filter options for admin dashboard
type AdminStatusFilter = "all" | "checked_in" | "pending";

// Get Your Card verify response (no phone)
type CardRegistration = {
  registration_id: string;
  first_name: string;
  last_name: string;
};
```

---

## API Routes

| Method | Route                      | Description                                       |
| ------ | -------------------------- | ------------------------------------------------- |
| POST   | `/api/register`            | Submit registration, send SMS                     |
| GET    | `/api/register/[id]`       | Fetch registration by ID (for success page)       |
| GET    | `/api/register/verify`     | Verify reg ID for card flow (name only, no phone) |
| GET    | `/api/admin/registrations` | All registrations (authenticated)                 |
| PATCH  | `/api/admin/checkin`       | Mark registration as checked in (authenticated)   |

---

## Folder Architecture

```
viper-sport/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                        # Home / Portfolio
│   │   ├── register/
│   │   │   ├── page.tsx                    # Registration + event details
│   │   │   └── success/page.tsx            # Success + QR + pass
│   │   └── get-your-card/page.tsx          # Social card generator
│   ├── (admin)/admin/
│   │   ├── page.tsx                        # Admin login
│   │   ├── dashboard/page.tsx
│   │   └── checkin/page.tsx
│   ├── api/
│   │   ├── register/route.ts               # POST registration
│   │   ├── register/[id]/route.ts          # GET by ID
│   │   ├── register/verify/route.ts        # GET verify for card flow
│   │   └── admin/
│   │       ├── registrations/route.ts      # GET all
│   │       └── checkin/route.ts            # PATCH check-in
│   ├── globals.css                         # Kinetic Dark tokens
│   └── layout.tsx                          # Fonts, Speed Insights, Toaster
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx, HeroScrollHint.tsx
│   │   ├── StatsSection.tsx, EventBanner.tsx
│   │   ├── AboutSection.tsx, CollabSection.tsx
│   │   ├── ContactSection.tsx, FooterSection.tsx
│   │   ├── DesktopNavbar.tsx, MobileBottomNav.tsx
│   ├── register/
│   │   ├── RegisterForm.tsx, RegisterEventDetails.tsx
│   │   ├── SuccessCard.tsx
│   │   └── RegistrationClosed.tsx          # Shown when capacity reached
│   ├── get-your-card/
│   │   ├── GetYourCardFlow.tsx
│   │   └── CardTemplate.tsx
│   ├── admin/
│   │   ├── AdminShell.tsx, AdminLoginForm.tsx
│   │   ├── StatsCards.tsx, RegistrationsTable.tsx
│   │   ├── CheckInExperience.tsx, QRScanner.tsx, ManualSearch.tsx
│   ├── shared/                             # SocialLinks, SocialIcon, ViperSportProfile
│   └── ui/                                 # Button, Input, Badge, Toaster
├── hooks/
│   └── useActiveSection.ts                 # IntersectionObserver scroll spy
├── lib/
│   ├── supabase/                           # client.ts, server.ts, admin.ts
│   ├── auth/
│   │   └── admin.ts                        # Admin auth helpers (isAuthenticatedAdmin)
│   ├── validations/                        # register.schema, admin.schema, card.schema
│   ├── sms.ts, qr.ts, pass.ts, phone.ts
│   ├── registration.ts                     # Registration state (isRegistrationClosed)
│   ├── cloudinary.ts, cloudinary-upload.ts, card-capture.ts
│   ├── home-nav.ts, animation.ts, social.ts
│   └── utils.ts                            # Shared utilities (cn)
├── store/
│   ├── useRegistrationStore.ts             # Zustand store for registration flow
│   ├── useAdminStore.ts                    # Zustand store for admin dashboard state
│   └── cardStore.ts                        # Zustand store for Get Your Card flow
├── supabase/migrations/                    # Schema, RLS, phone canonicalization
│   ├── 20260616022413_init_vipersport_schema.sql
│   ├── 20260616085320_create_registrations_and_admin_users.sql
│   ├── 20260616085320_enable_rls_and_policies.sql
│   └── 20260618120000_canonicalize_registration_phones.sql
├── proxy.ts                                # Admin route protection
├── types/index.ts                          # Shared TypeScript types
├── public/images/home/profile.webp
├── Design.md                               # Kinetic Dark design tokens
├── AGENTS.md                               # Repository guidelines for AI agents
├── skills-lock.json                        # Cursor skills configuration
└── next.config.ts                          # React Compiler, image domains
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# SMS (sms.net.bd)
SMS_NET_BD_API_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Feature Flags
REGISTRATION_CLOSED=      # Set to "false" to reopen registration (default: true)
```

`lib/cloudinary.ts` exposes `getCloudinaryImageUrl(publicId, options)` for optimized CDN URLs (`f_auto`, quality, width).

### Helper Libraries

| Helper                | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `lib/utils.ts`        | Shared utilities including `cn()` for Tailwind class merging            |
| `lib/phone.ts`        | Phone number canonicalization (BD format to `+880...`)                  |
| `lib/qr.ts`           | Client-side QR code generation via `qrcode` package                     |
| `lib/pass.ts`         | ViperSport Pass image generation (canvas-based downloadable ticket)     |
| `lib/sms.ts`          | SMS sending via sms.net.bd API (fire-and-forget)                        |
| `lib/animation.ts`    | GSAP animation utilities, `shouldSkipAnimation()` for slow connections  |
| `lib/social.ts`       | Social media links configuration (Instagram, YouTube, Facebook, TikTok) |
| `lib/home-nav.ts`     | Home page navigation anchors and scroll targets                         |
| `lib/cloudinary.ts`   | Cloudinary URL builder with optimization params                         |
| `lib/registration.ts` | Registration state helpers (`isRegistrationClosed()`)                   |

---

## Offline / Downtime Resilience

### Scenarios & Mitigations

| Scenario                            | Strategy                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Supabase DB down at registration    | Show user-friendly error. Optionally queue to localStorage and retry (progressive enhancement).         |
| SMS provider failure                | SMS is fire-and-forget. Registration still completes. Show QR on success screen regardless.             |
| Venue internet down during check-in | Export full registrations CSV from admin before event. Use CSV as offline backup for manual gate check. |
| QR scanner fails on device          | Fallback manual search tab always available.                                                            |
| Vercel function cold start slow     | Keep API routes lean. `/api/register` is the only critical path — keep it under 200ms.                  |

### Recommended Pre-Event Action

Export CSV of all registrations the night before the event and save it offline on the admin's phone as backup.

---

## Free Tier Constraints

### Supabase (Free)

- 500 MB database storage — 500 registrations ≈ negligible storage. No risk.
- 50,000 MAUs — only admin uses auth. No risk.
- **Inactivity pause after 1 week** — project will pause if no DB activity for 7 days. Prevent by running a scheduled ping or making a DB call periodically before the event.
- 2 active projects max.

### Vercel (Hobby Free)

- 100 GB bandwidth/month — static portfolio + 500 registrations = well within limits.
- 150,000 serverless function invocations/month — 500 registrations + admin calls = trivial.
- **Commercial use restriction** — Hobby tier is for personal/non-commercial use. If this is a commercial project (brand partnership, paid event), upgrade to Vercel Pro ($20/month) to comply with ToS.
- 6,000 build minutes/month — no risk for this project size.

---

## SMS Provider

**sms.net.bd (Alpha SMS Gateway)**

- Chosen for: Bangladesh-local provider, REST JSON API, simple integration, reliable delivery on BD carriers.
- API endpoint: `https://api.sms.net.bd/sendsms`
- Auth: API key in request body.
- Non-masking SMS (sender ID will be numeric). Masking (branded sender) requires separate approval.
- Cost: Pay-per-SMS. No free tier — requires account top-up before go-live.

---

## Performance Notes

- Mobile-first. Target sub-3s load on 3G/4G (Sylhet).
- Cloudinary CDN + `next/image` with blur placeholders for all portfolio images.
- GSAP animations only on elements with `will-change: transform`. Skip animations on slow connections via `lib/animation.ts` (`shouldSkipAnimation()` using `navigator.connection`).
- Registration success page: QR generated client-side — no server round-trip.
- Admin dashboard: fetch all ≤500 rows once, filter client-side. No pagination overhead.

---

## Future Roadmap

- Multi-event support
- Ticket tiers (VIP / General)
- Email confirmation (Resend or Nodemailer)
- Meta Pixel for event promotion tracking
- Automated waitlist if capacity is reached
- Full portfolio CMS (Sanity or Contentlayer)

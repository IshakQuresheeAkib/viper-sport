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
- **UI Components:** shadcn/ui
- **Animations:** GSAP
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (admin only)
- **Images:** Cloudinary + `next/image`
- **SMS:** sms.net.bd (Alpha SMS Gateway — REST API)
- **QR:** `qrcode` npm package (client-side generation)
- **QR Scanner:** `html5-qrcode` npm package (admin check-in)
- **Deployment:** Vercel

---

## Brand

- **Primary:** `#990011` (deep red)
- **Background:** `#FCF6F5` (off-white)
- **Accent:** `#FFFFFF`
- **Fonts:** To be decided (recommend: Inter or Geist for body, a bold display font for hero)
- **Logo:** Not yet created

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
- **Venue:** Shahi Eidgah Maidan, TV Gate, Sylhet, Bangladesh
- **Ticket Type:** General (free, no payment)
- **Capacity:** 500+ expected registrations

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — Fuad Abdul-Aziz portfolio |
| `/register` | Public event registration form |
| `/register/success` | Post-registration success screen with QR |
| `/admin` | Protected admin login |
| `/admin/dashboard` | Registration stats + table |
| `/admin/checkin` | QR scanner + manual search |

---

## Portfolio Sections (`/`)

Ordered as they appear on the page:

1. **Hero** — Full-screen with name, tagline, social links, GSAP entrance animation.
2. **About** — Short bio, born in Bangladesh, UK-based, founder of ViperSport.
3. **Stats** — 500M+ views, 1.4M+ followers, highlight numbers with GSAP counter animation.
4. **Collaborations** — Brand logos: Real Madrid, Apple, FIFA, Adidas, and others.
5. **Highlights / Gallery** — Cloudinary-served video/image grid of key moments.
6. **Event Banner** — Prominent CTA block for the live match show with Register button.
7. **Contact** — Simple contact form or email link for brand/sponsor inquiries.

---

## Registration Form (`/register`)

### Fields

| Field | Type | Required |
|---|---|---|
| `first_name` | text | Yes |
| `last_name` | text | Yes |
| `phone` | text (BD format) | Yes |

### Behavior

- Validated client-side with Zod (BD phone regex: `/^(\+?880|0)1[3-9]\d{8}$/`).
- On submit → POST `/api/register`.
- API route: deduplicates by phone (returns existing registration if already registered), inserts to Supabase, generates `registration_id` (UUID), fires SMS via sms.net.bd, returns registration data.
- Redirects to `/register/success?id={registration_id}`.
- Rate limited by IP (middleware or route handler).

### Success Screen (`/register/success`)

- Fetches registration by ID from URL param.
- Displays: Name, Registration ID, Event details, QR code (generated client-side from `registration_id` using `qrcode`).
- QR code also sent via SMS.
- Option to save/screenshot QR.

### SMS Content (sms.net.bd)

```
ViperSport Event: Registration confirmed!
Name: {first_name} {last_name}
ID: {registration_id}
Event: Argentina vs Austria Live Show
Date: 22 June 2026, 9PM
Venue: Shahi Eidgah Maidan, TV Gate, Sylhet
Show this SMS or your QR code at the gate.
```

> SMS is sent non-blocking (fire-and-forget). Registration succeeds even if SMS fails.

---

## Admin (`/admin/*`)

### Auth

- Supabase Auth (email/password). Single admin user.
- Protected via Next.js middleware checking Supabase session cookie.
- No public sign-up. Admin created manually in Supabase dashboard.

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

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/register` | Submit registration, send SMS |
| GET | `/api/register/[id]` | Fetch registration by ID (for success page) |
| GET | `/api/admin/registrations` | All registrations (authenticated) |
| PATCH | `/api/admin/checkin` | Mark registration as checked in (authenticated) |

---

## Folder Architecture

```
vipersport-event/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                        # Home / Portfolio
│   │   ├── register/
│   │   │   ├── page.tsx                    # Registration form
│   │   │   └── success/
│   │   │       └── page.tsx                # Success + QR screen
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── page.tsx                    # Admin login
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── checkin/
│   │   │       └── page.tsx
│   ├── api/
│   │   ├── register/
│   │   │   ├── route.ts                    # POST registration
│   │   │   └── [id]/
│   │   │       └── route.ts                # GET by ID
│   │   └── admin/
│   │       ├── registrations/
│   │       │   └── route.ts                # GET all
│   │       └── checkin/
│   │           └── route.ts                # PATCH check-in
│   ├── globals.css
│   └── layout.tsx
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
│   │   ├── RegisterForm.tsx
│   │   └── SuccessCard.tsx
│   ├── admin/
│   │   ├── StatsCards.tsx
│   │   ├── RegistrationsTable.tsx
│   │   ├── QRScanner.tsx
│   │   └── ManualSearch.tsx
│   └── ui/                                 # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser client
│   │   └── server.ts                       # Server client (Route Handlers, Server Components)
│   ├── sms.ts                              # sms.net.bd helper
│   ├── qr.ts                               # QR generation helper
│   └── validations/
│       └── register.schema.ts              # Zod schema
├── proxy.ts                           # Admin route protection
├── types/
│   └── index.ts                            # Shared TypeScript types
├── public/
│   └── images/
├── .env.local
└── next.config.ts
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# SMS (sms.net.bd)
SMS_NET_BD_API_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Offline / Downtime Resilience

### Scenarios & Mitigations

| Scenario | Strategy |
|---|---|
| Supabase DB down at registration | Show user-friendly error. Optionally queue to localStorage and retry (progressive enhancement). |
| SMS provider failure | SMS is fire-and-forget. Registration still completes. Show QR on success screen regardless. |
| Venue internet down during check-in | Export full registrations CSV from admin before event. Use CSV as offline backup for manual gate check. |
| QR scanner fails on device | Fallback manual search tab always available. |
| Vercel function cold start slow | Keep API routes lean. `/api/register` is the only critical path — keep it under 200ms. |

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
- GSAP animations only on elements with `will-change: transform`. No animation on 3G-detected connections (use `navigator.connection` hint).
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
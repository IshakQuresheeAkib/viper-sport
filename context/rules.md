# AI Rules

- Always follow the patterns and decisions defined in the documentation. Suggest alternatives if any technology is not mentioned or if you think the alternative technology should be obviously used.
- Always use latest, stable and bug free packages.
- Never use `any` in TypeScript. Always use exact types.
- Follow Next.js 16 conventions: use proxy.ts not middleware.ts, use `use cache` for caching.
- Always strictly maintain best practices and follow the best performance-optimized way. Must ensure the principles, coding style, and syntax of the latest versions of Next.js 16, Tailwind version 4, and React 19 and always use latest versions
- All code must be production-ready and working. No placeholders, no TODO stubs.
- For animations, use GSAP only. Do not suggest Framer Motion.
- For forms, use React Hook Form + Zod only.
- For global state, use Zustand only.
- `next/image` for all images — never raw `<img>` tags
- Keep responses concise. Skip basic explanations. Use code blocks.
- Do not use use cache broadly. It is unsuitable for admin, registration, success pages, auth/session work, and
    anything using request-time data. Use it only for static portfolio/media data. Source: <https://nextjs.org/docs/app/api-reference/directives/use-cache>

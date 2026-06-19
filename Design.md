---
name: ViperSport Kinetic
colors:
  surface: "#13140d"
  surface-dim: "#13140d"
  surface-bright: "#393a32"
  surface-container-lowest: "#0d0f09"
  surface-container-low: "#1b1c15"
  surface-container: "#1f2019"
  surface-container-high: "#292b23"
  surface-container-highest: "#34352e"
  on-surface: "#e4e3d8"
  on-surface-variant: "#c6c8b5"
  inverse-surface: "#e4e3d8"
  inverse-on-surface: "#303129"
  outline: "#909281"
  outline-variant: "#45483a"
  surface-tint: "#b7d16d"
  primary: "#ffffff"
  on-primary: "#283500"
  primary-container: "#d3ed86"
  on-primary-container: "#576c13"
  inverse-primary: "#51660b"
  secondary: "#cec4c2"
  on-secondary: "#352f2d"
  secondary-container: "#4c4543"
  on-secondary-container: "#bcb3b0"
  tertiary: "#ffffff"
  on-tertiary: "#68000f"
  tertiary-container: "#ffdad8"
  on-tertiary-container: "#b23a3c"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#d3ed86"
  dark: "#b7d16d"
  on-primary-fixed: "#161f00"
  on-primary-fixed-variant: "#3c4d00"
  secondary-fixed: "#ebe0dd"
  secondary-fixed-dim: "#cec4c2"
  on-secondary-fixed: "#1f1b19"
  on-secondary-fixed-variant: "#4c4543"
  tertiary-fixed: "#ffdad8"
  tertiary-fixed-dim: "#ffb3b0"
  on-tertiary-fixed: "#410006"
  on-tertiary-fixed-variant: "#891b22"
  background: "#13140d"
  on-background: "#e4e3d8"
  surface-variant: "#34352e"
typography:
  display-lg:
    fontFamily: anybody
    fontSize: 72px
    fontWeight: "800"
    lineHeight: "1.0"
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: anybody
    fontSize: 48px
    fontWeight: "800"
    lineHeight: "1.1"
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: anybody
    fontSize: 32px
    fontWeight: "800"
    lineHeight: "1.1"
    letterSpacing: -0.02em
  headline-md:
    fontFamily: anybody
    fontSize: 24px
    fontWeight: "700"
    lineHeight: "1.2"
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.5"
  label-bold:
    fontFamily: plusJakartaSans
    fontSize: 12px
    fontWeight: "700"
    lineHeight: "1.0"
    letterSpacing: 0.05em
  stats-number:
    fontFamily: anybody
    fontSize: 20px
    fontWeight: "700"
    lineHeight: "1.0"
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is built on a "Kinetic Dark" aesthetic, engineered for high-performance sports environments. It targets an audience of elite athletes and data-driven fans who value precision, speed, and intensity. The UI evokes a sense of urgency and premium athleticism through high-contrast visuals and aggressive hierarchy.

The style is a fusion of **Modern Corporate** efficiency and **High-Contrast Bold** energy. It utilizes a deep, matte charcoal foundation to allow the electric accents to "pop" with neon-like intensity. Design elements should feel fast—incorporating slanted lines, heavy font weights, and subtle glassmorphic overlays to create depth without sacrificing data density.

## Colors

The palette is dominated by the interaction between the Dark Charcoal background and the Electric Lime primary accent.

- **Primary (Electric Lime):** Used for critical calls to action, active states, and "glowing" borders. It represents energy and movement.
- **Secondary (Soft Cream):** Reserved for high-readability text on dark backgrounds and subtle dividers. It provides a premium, "off-white" contrast that is easier on the eyes than pure white.
- **Tertiary (Coral Red):** A functional accent for live status indicators, alerts, or losing streaks/negative data points.
- **Neutrals:** Tonal variations of the background (#262324) are used to define surface layers, ensuring the interface feels cohesive and deep.

## Typography

The typography strategy employs a "Dual-Tone" approach. **Anybody** is utilized for its aggressive, variable-width nature, mimicking the movement of a sprinter. It should be used for all headers, hero numbers, and impactful labels, always in uppercase for display sizes.

**Plus Jakarta Sans** provides the necessary balance, offering high legibility for long-form data, athlete bios, and technical specs. It maintains a modern, soft touch that offsets the sharpness of the display face. Tight letter-spacing on headlines is encouraged to increase the "compact" professional feel of the brand.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model optimized for high data density. The layout should feel "locked-in" and structured, similar to a broadcast scoreboard.

- **Desktop:** 12-column grid with a 16px gutter. Use large 48px margins to allow the content to breathe against the dark canvas.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** All spacing must be multiples of 8px. Use tight 4px or 8px spacing for related data points (e.g., player stats) and larger 48px+ gaps between major content sections.

Incorporate "Data Strips"—horizontal or vertical zones of high-density information—frequently used in sports journalism to provide quick-glance insights.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Glassmorphism**, rather than traditional drop shadows.

1.  **Base Layer:** Dark Charcoal (#262324) matte finish.
2.  **Surface Layer:** A slightly lighter shade (#322F30) with a subtle 1px inner border of white at 5% opacity to define edges.
3.  **Interactive Layer:** Glassmorphic cards with a 12px backdrop blur and 10% opacity white fill.
4.  **Highlight Layer:** Electric Lime glows. Use a "soft outer glow" (Box Shadow: 0 0 15px rgba(227, 254, 149, 0.3)) exclusively for active components or critical call-outs.

Avoid heavy black shadows; instead, use darker-than-background overlays to "sink" elements or lighter outlines to "lift" them.

## Shapes

The shape language is "Soft-Technical." Elements use a consistent **Soft (0.25rem)** radius for standard components like input fields and buttons. This small radius maintains a disciplined, professional look while feeling modern.

Larger containers and cards may use **rounded-lg (0.5rem)** to differentiate them from functional UI bits. Circular shapes are reserved strictly for athlete avatars and status pips to provide a geometric counterpoint to the rectangular grid.

## Components

- **Buttons:** Primary buttons are solid Electric Lime with black text (AnyBody Bold). Secondary buttons are outlined in Soft Cream with a subtle glass fill.
- **Sports Cards:** Use the glassmorphic style. The top border should be a 2px "status line" (e.g., Electric Lime if the game is live, Soft Cream if scheduled).
- **Data Tables:** High-density, no vertical borders. Use 1px horizontal dividers in Soft Cream at 10% opacity. Headers must be `label-bold`.
- **Chips/Badges:** Small, pill-shaped, using background tints of the accent colors (e.g., Coral Red at 15% opacity with solid Coral Red text for "Live").
- **Glow Borders:** Use a 1px Electric Lime border for "active" or "focused" states, paired with a subtle matching outer glow to simulate a screen-on-dark-room effect.

---

## Implementation Reference

Token names map to Tailwind utilities in `app/globals.css` (e.g. `bg-kinetic-surface`, `text-kinetic`, `glass-card`, `glow-border`, `kinetic-glass-card`).

### Home page components

| Component              | Role                                         |
| ---------------------- | -------------------------------------------- |
| `DesktopNavbar`        | Floating pill nav with GSAP active indicator |
| `MobileBottomNav`      | Fixed bottom tabs with Lucide icons          |
| `HeroSection`          | Split hero, profile image, social CTAs       |
| `StatsSection`         | Glass stat cards with counter animation      |
| `EventBanner`          | Live event CTA (`id="events"`)               |
| `RegisterEventDetails` | Match metadata on `/register`                |

### Connection-aware motion

`lib/animation.ts` → `shouldSkipAnimation()` disables GSAP on slow `navigator.connection` effective types to meet Sylhet 3G/4G performance targets.

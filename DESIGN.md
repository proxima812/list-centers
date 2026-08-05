---
name: Tatarverse
description: Bilingual catalog of Tatar, Bashkir, Tatar-Bashkir, and Crimean Tatar centers.
register: brand
colors:
  background: "#ffffff"
  foreground: "#1d1d1d"
  muted: "#f0f0f0"
  muted-foreground: "#6b6b6b"
  subtle: "#e6e6e6"
  subtle-foreground: "#757575"
  surface: "#ffffff"
  surface-foreground: "#1d1d1d"
  surface-muted: "#f5f5f5"
  border: "#dbdbdb"
  border-muted: "#ebebeb"
  ring: "#c7c7c7"
  primary: "#1d1d1d"
  primary-foreground: "#ffffff"
  link: "#1d1d1d"
  link-decoration: "#c7c7c7"
  depth-100: "#e6e6e6"
  depth-200: "#d1d1d1"
  depth-300: "#a3a3a3"
  depth-400: "#7a7a7a"
  depth-500: "#5c5c5c"
  depth-600: "#474747"
  depth-700: "#333333"
  accent: "#1c8743"
  accent-foreground: "#ffffff"
typography:
  display:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 7vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
    textTransform: "uppercase"
  headline:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  caption:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3333
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  card: "24px"
  catalog-card: "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "clamp(48px, 8vw, 96px)"
  page-x: "20px"
components:
  hero-title:
    color: "{colors.foreground}"
    accent: "{colors.accent}"
    typography: "{typography.display}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    typography: "{typography.label}"
  chip-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
    typography: "{typography.label}"
  stats-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 10px"
    typography: "{typography.label}"
  card-center:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.surface-foreground}"
    rounded: "{rounded.catalog-card}"
    padding: "20px"
---

# Design System: Tatarverse

## 1. Overview

**Creative North Star: "A Catalog With A Signal"**

Tatarverse is still a practical catalog, but the current site has a clearer public identity than the older flat system. The homepage introduces the project with a compact brand mark, uppercase hero typography, one controlled accent color, animated catalog statistics, and a screenshot-led search section. After that first impression, the product returns to a quiet, scannable catalog language.

The design system has two layers:

- **Brand layer:** homepage identity moments, the liquid-metal mark, hero accent, stats choreography, and product imagery.
- **Catalog layer:** centers list, cards, filters, search, MDX content, navigation, translation surfaces, and source-backed detail pages.

The brand layer should make the site memorable. The catalog layer should make the data easy to use.

## 2. Color

The base palette is neutral and semantic. It is defined in `src/styles/tailwind.css` through Tailwind v4 tokens: `background`, `foreground`, `muted`, `surface`, `border`, `ring`, `primary`, `link`, `depth-*`, and `accent`.

### Base Roles

- **Background / Surface:** the page, cards, menus, screenshots, and MDX content.
- **Foreground / Primary:** the main ink color for text, strong actions, and active filters.
- **Muted / Subtle:** low-emphasis surfaces, metadata, labels, chips, and quiet card backgrounds.
- **Border / Ring / Depth:** separators, inset rings, dividers, and tonal hierarchy.
- **Primary Foreground:** inverse text for active controls and primary buttons.
- **Accent / Accent Foreground:** the one signal color and its contrast pair.

### Themes

The site ships **light and dark** themes plus **three accent palettes**. Both are user
choices, persisted in `localStorage` and applied by an inline script in `<head>` before
first paint (`src/layouts/Layout.astro`).

- Theme: `.dark` class on `<html>`, chosen via `light` / `dark` / `system`.
- Accent: `data-accent` on `<html>` — `green` (default), `blue`, `violet`.

Every token is declared once in `@theme` (light values) and overridden in `.dark`.
Accent presets are `[data-accent="…"]` and `.dark[data-accent="…"]` blocks. **Light and
dark values of an accent are deliberately different** — a single hue cannot clear the
contrast threshold on both a white and a near-black background.

**In dark theme the accent also swaps the neutrals.** The same grey reads differently
under green, blue, and violet, so each preset ships its own dark paper. Light theme is
shared by all three — there the accent changes nothing but the accent tokens.

- `green` — the base `.dark` set: soft charcoal (`7%` page, `15%` surface), no pure black.
- `violet` — Vercel register: pure black page, surfaces barely lifted off it (`4%`/`10%`),
  quiet borders (`18%`), ink at `93%` instead of white. Hierarchy comes from type, not rules.
- `blue` — Uber Base register: the same black page, but visibly lifted surfaces
  (`8%`/`12%`), denser borders (`20%`), and pure-white ink. Louder and more contrasty.

**The page → surface step is the main depth signal in dark, and it is deliberately larger
than its light counterpart.** Light theme lets a shadow finish the job; dark theme has no
usable shadow, so the step has to carry it alone. Measured in perceptual lightness
(oklch `L`), all three dark palettes now clear `+8`, matching HeroUI's `12% → 21%`. Steps
below that read as flat. Deeper nesting needs far less — `surface → surface-muted` is
about `+4`.

All six theme × accent combinations are verified at >=4.5:1 for body text, footer text,
and the accent itself against its own background. Watch `subtle-foreground` in particular:
it is the dimmest text token and it lands on `bg-subtle`, the lightest fill, so that pair
is the binding constraint whenever a dark surface is raised.

### Brand Accent

The accent is green by default (`#1c8743` light, `#3ecc72` dark) and appears in the hero
word treatment, the liquid-metal mark, focus indicators, active filter chips, and the
filter badge. Treat it as a named signal, not a general palette. Do not apply it to cards,
prose, footer links, or center detail pages unless a specific design pass asks for that.

### Color Rules

**Neutrals Carry Structure.** Default to the semantic neutral tokens for layout, controls, content, and catalog surfaces.

**The Accent Is A Signal.** The accent belongs to identity moments, focus, and active state only. It should never become a generic decoration.

**Never Hardcode A Color.** Anything written as a literal hex or a Tailwind palette class (`bg-white`, `text-zinc-500`) will not survive a theme switch. The only exceptions are logo plates, which need white regardless of theme, and third-party brand colors.

**No Cultural Color Pastiche.** Do not infer a palette from flags, ethnic motifs, or ornamental references. Cultural meaning comes from the content and source-backed data.

## 3. Typography

The site uses **Tatarverse Sans**, a self-hosted variable font (`/fonts/tatarverse-sans.woff2`, weights 100-900, `font-display: optional`), with the system sans stack as fallback. `Twemoji Country Flags` sits first in the stack but only covers flag glyphs — Windows has no built-in flag emoji, so everything else falls through to Tatarverse Sans. The voice is practical and direct, with a sharper homepage display treatment.

### Hierarchy

- **Display:** homepage hero only. Use heavy uppercase sans, tight tracking no tighter than `-0.04em`, balanced wrapping, and short localized phrases.
- **Headline:** major page titles, list heroes, and content headers.
- **Title:** center card titles, post titles, compact section headings, and detail-page modules.
- **Body:** MDX content, summaries, factual descriptions, policy text, and explanatory copy.
- **Label:** buttons, chips, nav items, stats labels, metadata, and menu controls.
- **Caption:** filter counts, group headings, and other micro-labels. This is the floor — nothing meaningful goes below 12px.

### Typography Rules

**Display Is Scarce.** Heavy uppercase display type is for the homepage identity and rare page-level statements. Do not use it inside cards or dense content modules.

**Factual Copy Wins.** The site should not sound like marketing. Use direct labels, source-backed descriptions, and localized wording that stands alone.

**Respect Locale Length.** Russian and English strings must wrap without overflow. Long titles need `overflow-wrap`, balanced headings, or tighter component constraints before changing copy.

## 4. Layout

The site uses centered content, generous vertical rhythm on the homepage, and compact catalog modules on data-heavy pages.

- Homepage: stacked brand mark, hero title, quick links, stats, and a screenshot-led search section.
- Centers index: list hero, toolbar, search/filter controls, grid cards, and pagination.
- Center detail: compact navigation, centered header, metadata badges, source links, sidebar facts, and MDX body.
- MDX pages: a readable surface with clear prose styles and restrained borders.

### Layout Rules

**One Strong Idea Per Fold.** The homepage can breathe. Catalog pages should stay compact and practical.

**Cards Are Functional.** Use cards for center records, posts, MDX surfaces, and real grouped data. Do not add decorative card grids.

**Screenshots Are Product Imagery.** The search section should use real interface imagery when explaining behavior. Avoid placeholder panels.

## 5. Shape And Surface

The visual language uses squircle geometry through `@toolwind/corner-shape` and rounded Tailwind utilities.

- Buttons, chips, menus, stats pills: `rounded-2xl` or full-pill where appropriate.
- Center cards: large squircle identity, currently about `32px`.
- Marketing or screenshot blocks: `rounded-3xl`, with image clipping and `surface-lift`.
- MDX and utility panels: `rounded-2xl`, thin border or ring, and `shadow-2xs` only when separation is needed.

Avoid pairing a border with a large soft shadow on routine components. Stronger shadow belongs to screenshot-led sections or temporary overlays.

### Lift

Two utilities carry elevation, and both are theme-aware — never hand-write a
`dark:shadow-*` pair again.

- `surface-lift` — things in the flow (cards, feature sections). Soft shadow in light;
  **no shadow at all in dark**, where the lightness step and the ring already separate the
  layers.
- `overlay-lift` — things floating over the page (menus, popovers). Soft shadow in light;
  in dark a `1px` inset highlight along the top edge — light from above instead of shadow
  from below.

A black shadow on a near-black page draws nothing: it costs compositing and returns no
depth. This is HeroUI's conclusion too — their dark theme sets `--surface-shadow` to
transparent outright and gives overlays `inset 0 0 1px rgba(255,255,255,.3)`.

A floating panel must also sit on `bg-surface`, not `bg-background`. On `bg-background` it
is the same tone as the page behind it and survives on its border alone.

## 6. Motion

Motion is part of the new system, but it is limited.

- **Hero accent:** slow brand accent movement on the highlighted word, driven by `--color-accent`.
- **Stats:** short count and focus animation that emphasizes catalog scale.
- **Marquee / word imagery:** optional brand texture, only when it supports the page rhythm.
- **Controls:** small hover, focus, and active-state transitions.

Every animation needs a reduced-motion path. Motion must enhance already visible content, not gate content rendering.

### Two Off Switches

Motion has **two independent off switches**, and a component must survive both:

1. **OS preference** — `@media (prefers-reduced-motion: reduce)`.
2. **User toggle** — the appearance menu in the header writes `data-motion="off"`
   on `<html>` (localStorage key `motion`, `on` by default). It forces
   `animation: none` and `transition: none` on every element plus
   `scroll-behavior: auto`, killing the hero, the mark, marquees, and hovers
   while leaving colors and gradients intact.

Because the toggle removes animations outright, **any component whose state
machine waits on `animationend` or `transitionend` will hang**. Such components
must be carved out and given `animation-duration: 1ms` instead of `none` — the
mobile drawer (`[data-menu-list]`, `[data-menu-backdrop]`) is the existing
precedent. Check every animated surface in all three states: motion on, toggle
off, OS reduced-motion.

## 7. Components

### Liquid-Metal Mark

The homepage mark is a compact identity object. It should stay centered, decorative, and non-blocking. It is not a reusable card or icon style for the catalog.

Its shader is tinted by `--color-mark-tint`, not by `--color-accent-vivid`: LiquidMetal
darkens the input color with its own contours and highlights, so the tint token is a
lightened sibling of `vivid` in every theme × accent pair. The token must stay a plain
`hsl()` — the mark script reads it as a string and parses the computed color into hex,
and a `color-mix()` would compute to `oklab()`, which that parser cannot read.

### Hero Title

The hero title uses heavy uppercase lines with one accent phrase and quieter secondary lines. Keep words short enough for mobile. Do not add repeated section eyebrows around it.

### Home Links

Home links should be direct, localized navigation to key catalog surfaces. Keep them compact and useful.

### Catalog Stats

Stats are small, three-column pills with icons, tabular numbers, and muted labels. The animation should feel like a quick focus cue, not a dashboard metric showpiece.

### Search Screenshot Section

The homepage search section combines explanatory copy with localized screenshot imagery (`1-ru.png` / `1-en.png`). It may use stronger shadow than routine catalog cards because it is a product image feature.

### Buttons And Chips

Buttons and chips use compact padding, squircle rounding, and semantic tokens. Active filter chips use `accent` and `accent-foreground`; primary buttons use `primary` and `primary-foreground`.

### Focus

There is exactly one focus recipe, in `@layer base`: a 2px `accent` outline with a 2px offset on every interactive element. Components must not add their own focus ring and must not set `focus-visible:outline-none` — a per-component ring at 25-40% opacity does not clear the 3:1 contrast requirement, and `box-shadow` rings get clipped inside scroll containers.

### Center Cards

Center cards remain the core catalog primitive. They must keep titles readable, metadata compact, locations scannable, and localized routes stable.

### MDX Surfaces

MDX content should use the typography plugin tokens, readable line lengths, restrained borders, and clear link styling. Do not add marketing wrappers around factual content.

## 8. Do And Do Not

### Do

- Reuse `src/styles/tailwind.css` tokens before adding visual roles.
- Keep the homepage brand layer distinct from catalog utility surfaces.
- Use real product imagery where it clarifies a feature.
- Preserve source-backed content, locale routes, stable slugs, and metadata behavior.
- Verify contrast for muted labels, placeholders, metadata, and small controls.
- Keep both motion escape paths in every animated component: `prefers-reduced-motion` and the `[data-motion="off"]` toggle.

### Do Not

- Do not turn the whole site into the accent color.
- Do not hardcode hex values or Tailwind palette classes in components.
- Do not add extra cultural palettes or ornamental motifs.
- Do not add glossy SaaS gradients, glass panels, side stripes, or generic icon-card grids.
- Do not reuse homepage display treatment inside dense catalog surfaces.
- Do not add decorative motion to MDX pages, lists, or center detail content.
- Do not rewrite factual copy into slogans.

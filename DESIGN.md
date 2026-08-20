---
name: Tatarverse
description: Bilingual catalog of Tatar, Bashkir, Tatar-Bashkir, and Crimean Tatar centers.
register: brand
colors:
  background: "#f9f9f9"
  foreground: "#1d1d1d"
  muted: "#ececec"
  muted-foreground: "#595959"
  subtle: "#e3e3e3"
  subtle-foreground: "#656565"
  surface: "#ffffff"
  surface-foreground: "#1d1d1d"
  surface-muted: "#f2f2f2"
  border: "#cccccc"
  border-muted: "#dddddd"
  ring: "#c7c7c7"
  primary: "#1d1d1d"
  primary-foreground: "#ffffff"
  link: "#1d1d1d"
  link-decoration: "#909090"
  depth-100: "#d6d6d6"
  depth-200: "#c2c2c2"
  depth-300: "#9e9e9e"
  depth-400: "#7a7a7a"
  depth-500: "#5c5c5c"
  depth-600: "#474747"
  depth-700: "#333333"
  accent: "#1b8341"
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
  micro: "8px"
  control: "16px"
  card: "24px"
  catalog: "32px"
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
    rounded: "{rounded.control}"
    padding: "8px 16px"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
    typography: "{typography.label}"
  chip-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
    typography: "{typography.label}"
  stats-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
    typography: "{typography.label}"
  card-center:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface-foreground}"
    rounded: "{rounded.catalog}"
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

The base palette is neutral and semantic. Light neutrals live in `@theme` in `src/styles/tailwind.css`; each accent preset carries its own dark neutrals in `src/styles/palettes/<name>.css`. The Tailwind v4 tokens are `background`, `foreground`, `muted`, `surface`, `border`, `ring`, `primary`, `link`, `depth-*`, and `accent`.

### Base Roles

- **Background / Surface:** the page, cards, menus, screenshots, and MDX content.
- **Foreground / Primary:** the main ink color for text, strong actions, and active filters.
- **Muted / Subtle:** low-emphasis surfaces, metadata, labels, chips, and quiet card backgrounds.
- **Border / Ring / Depth:** separators, inset rings, dividers, and tonal hierarchy.
- **Primary Foreground:** inverse text for active controls and primary buttons.
- **Accent / Accent Foreground:** the one signal color and its contrast pair.

### Themes

The site ships **light and dark** themes plus **six accent palettes**. Both are user
choices, persisted in `localStorage` and applied by an inline script in `<head>` before
first paint (`src/layouts/Layout.astro`).

- Theme: `.dark` class on `<html>`, chosen via `light` / `dark` / `system`.
- Accent: `data-accent` on `<html>` — `green` (default), `blue`, `violet`, `red`,
  `orange`, `pink`.

The preset list lives in exactly one place, `src/utils/accents.ts`, and both the header
dropdown and the mobile toggle read it. Adding a palette means editing that file plus
adding `src/styles/palettes/<name>.css` — never a second copy of the swatch array.

**One preset — one file.** `src/styles/palettes/` holds six files, and each describes its
preset whole: the accent in both themes, the dark neutral paper, and the shape register.
Light neutrals are shared by all six and stay in `@theme` in `tailwind.css`. Previously a
single preset was spread across three blocks at opposite ends of one file, and keeping
them consistent was done by eye.

Selectors inside a palette file start with `:root` on purpose, not for looks: `(0,2,0)` and
`(0,3,0)` beat the `(0,1,0)` of `:root` from `@theme` and of `.dark`. That makes `@import`
order irrelevant, so palette files can be listed in any sequence.

**Light and dark values of an accent are deliberately different** — a single hue cannot
clear the contrast threshold on both a white and a near-black background.

**In dark theme the accent also swaps the neutrals.** The same grey reads differently
under each hue, so every preset ships its own dark paper. Light theme is shared by all
six — there the accent changes nothing but the accent tokens.

### The Surface Ladder

**`muted` sits between `background` and `surface`. This is the load-bearing rule of the
whole system.** A section band takes `bg-muted` and is recessed relative to the page; a
card on that band takes `bg-surface` and is raised above it. Order the two the other way
and the catalog collapses.

That is exactly what used to happen. `muted` sat *above* `surface` in dark, and at three
presets they landed on the same value or one point apart — `orange` `20%`/`20%`,
`pink` `15%/15%`, `red` `13%/12%`. Several hundred centre cards rendered the same colour
as the list band behind them. In light, `surface` and `background` were both pure white,
so every `bg-surface` panel on the page — `Box`, MDX, project cards — was white on white.

    dark:   background  <  muted  <  surface  <  surface-muted  <  subtle
    light:  surface  >  background  >  surface-muted  >  muted  >  subtle

| preset | background | muted | surface | surface-muted | subtle |
| --- | --- | --- | --- | --- | --- |
| light (all six) | 97.5% | 92.5% | 100% | 95% | 89% |
| `green` | 7% | 11% | 16% | 19% | 22% |
| `blue` | 0% | 4% | 8% | 12% | 16% |
| `violet` | 0% | 2% | 5% | 9% | 14% |
| `red` | 4% | 8% | 12% | 16% | 20% |
| `orange` | 11% | 15.5% | 20% | 24% | 28% |
| `pink` | 6% | 10.5% | 15% | 19% | 23% |

Each preset keeps its character: `violet` the Vercel register on pure black, `blue` the
louder Uber Base with pure-white ink, `red` the deepest paper, `orange` the lightest dark
theme at `11%`, `pink` the middle register, `green` the soft charcoal base.

**The page → surface step is the main depth signal in dark, and it is deliberately larger
than its light counterpart.** Light theme lets a shadow finish the job; dark theme has no
usable shadow, so the step has to carry it alone. All six dark palettes clear `+9` in
oklch `L`. Near white the scale is compressed and `surface → background` is only `ΔL 1.9` —
that is fine, because light theme still has a shadow and a border to finish the job.

Every value is solved numerically, not chosen by eye. The constraints: the ladder order
above, `card on band >= ΔL 4`, `border-muted >= 1.28:1` against both `surface` and
`background`, `border >= 1.5:1`, and `muted-foreground` / `subtle-foreground` at
`>= 4.55:1` against **all five fills of their own palette** — not just against the page.
The old values cleared AA on the page and failed on `bg-muted` (`4.01`) and `bg-subtle`
(`3.66`), which is precisely where the toolbar counter and the footer put them.

`depth-100` carries the catalog card ring and is solved for that duty: it must read on
`surface` and on `muted` at once. Do not put an alpha modifier on it. `ring-depth-100/70`
measured `1.04-1.22:1` across all twelve combinations — a ring that was not there.

### Derived Steps

Four tokens are **not authored per palette**. They are computed as their own backing
surface mixed toward its own ink, one proportion for the whole project:

| token | formula |
| --- | --- |
| `surface-muted` | `color-mix(in oklab, surface 94.5%, surface-foreground)` |
| `border-muted` | `color-mix(in oklab, surface 86%, surface-foreground)` |
| `border` | `color-mix(in oklab, surface 80%, surface-foreground)` |
| `depth-100` | `color-mix(in oklab, surface 84%, surface-foreground)` |

The point is not fewer lines. **A hand-written border can drift, and did** — `border-muted`
measured `1.10:1` on `surface` under `red` and `pink`, meaning it was not visible. A derived
value cannot fail that way: it is always a fixed perceptual distance from its own surface,
whatever that surface becomes.

This is HeroUI v3's approach, where `--border-secondary` and `--separator-secondary` are
mixes of `--surface` and `--surface-foreground`. **Their proportions are not ours**: HeroUI's
`78%` / `92%` produce `ΔL 2.6-3.7` against our anchors where we need `4`, because they are
tuned for a single dark palette with a `12% → 21%` gap. Ours are solved against our own
floors and verified in the browser across all twelve combinations.

**Not everything derives, and that is deliberate.** `muted`, `subtle` and the two ink tokens
stay authored per palette. A single global proportion would flatten the presets into each
other — a derived `muted` moves `blue`'s band from `L* 14.6` to `6.25`, erasing exactly the
"visibly lifted surfaces" register that makes `blue` the Uber Base entry. And `subtle` has no
feasible global proportion at all while the inks stay authored. Six dark papers with
deliberately different characters is the feature; the derivation serves it, not the reverse.

The authored `hsl()` values and these `color-mix()` formulas live in exactly one place —
the CSS. The percentages above are a reading of that source, not a second copy: when they
disagree, the CSS wins and this table is what needs fixing. (A standalone contrast-audit
script used to reproduce this arithmetic; it was removed as a second source of truth.
Contrast is now checked against the CSS directly, via the impeccable design hook or by
hand.)

### Brand Accent

The accent is green by default (`#1b8341` light, `#3ecc72` dark) and appears in the hero
word treatment, the liquid-metal mark, focus indicators, active filter chips, and the
filter badge. Treat it as a named signal, not a general palette. Do not apply it to cards,
prose, footer links, or center detail pages unless a specific design pass asks for that.

### Soft Accent

`accent-soft` / `accent-soft-hover` / `accent-soft-foreground` are the quiet fill of the
accent — currently only the hero badge. They are not authored per preset: each is a
`color-mix()` over the current `accent` and neutrals, so all twelve theme × accent pairs
follow for free.

Two things are deliberate there. The text is **not** pure `accent` — on a 12% fill light
green gives 3.9:1, below AA for 12px, so 25% `foreground` is mixed in and the worst pair
lands at 5.6:1. And the dark fill takes 18% accent instead of 12%: on a near-black page
12% lifted the pill by only 6.7-8.4 in perceptual lightness, at or under the flatness
threshold described below.

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
- Center detail: compact navigation, a left-aligned header, the MDX body in a measured
  column, and a facts aside. Everything sits on one left axis — the header must not be
  centered above left-aligned prose, and neither the body nor the aside is wrapped in a
  panel. Separation comes from spacing, column measure, and hairline rules.
- MDX pages: a readable surface with clear prose styles and restrained borders.

### Layout Rules

**One Strong Idea Per Fold.** The homepage can breathe. Catalog pages should stay compact and practical.

**Cards Are Functional.** Use cards for center records, posts, MDX surfaces, and real grouped data. Do not add decorative card grids.

**Screenshots Are Product Imagery.** The search section should use real interface imagery when explaining behavior. Avoid placeholder panels.

## 5. Shape And Surface

The visual language uses squircle geometry through `@toolwind/corner-shape` and a
**four-step semantic radius scale**. Never write a raw `rounded-2xl` / `rounded-3xl` /
`rounded-4xl` again — those numbers are the default preset's values, not the meaning.

- `rounded-micro` (`8px`) — badges, chips, inputs, small icon buttons.
- `rounded-control` (`16px`) — buttons, menu items, toolbars, popovers.
- `rounded-card` (`24px`) — panels, sections, ordinary cards, marketing and screenshot
  blocks (with image clipping and `surface-lift`).
- `rounded-catalog` (`32px`) — center cards and other large catalog surfaces.
- `rounded-full` stays raw. A pill is not a step on the scale: it must **not** move with
  the preset, or toggles and avatars would stop being circles.

MDX and utility panels take `rounded-control` plus a thin border or ring, and `shadow-2xs`
only when separation is needed.

### Radius Follows The Accent

Radius is part of the preset, not a constant. `data-accent` already swaps the entire dark
neutral palette (the Vercel / Uber Base registers above), and corner shape rides the same
register — this is how HeroUI themes work, where a theme carries `--heroui-radius-*`
alongside its colors. The scale is shared by light and dark: contrast depends on the
background, shape does not.

There are **three shape registers for six presets** — the hue already tells them apart,
and six different geometries would turn the scale into a set of accidents. The default
register lives in `@theme`; the two others sit in the palette files that use them, so a
preset is still described by exactly one file.

| register | presets | micro | control | card | catalog |
| --- | --- | --- | --- | --- | --- |
| default | `green`, `orange` | 8 | 16 | 24 | 32 |
| medium | `violet`, `pink` | 8 | 12 | 18 | 24 |
| small | `blue`, `red` | 6 | 8 | 12 | 16 |

`red` joins the small register on purpose: it is the loudest accent in the set, and the
strict shape balances it.

The steps compress **non-uniformly** — large radii give up proportionally more. A flat
multiplier would push `micro` down to `4px`, indistinguishable from a square corner, while
barely touching `catalog`, which is exactly where the change in shape is legible.

The print stylesheet (`src/pages/centers/print.astro`) keeps raw radii on purpose: paper
should not shift with a screen preset.

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

### Hero Badge

One soft-accent pill above the hero title (HeroUI's announcement pattern), rotating
through three project news items: the latest post, the newest center, and the current site
version. Every line is derived from data — posts by `pubDate`, centers by their sequential
`tbk-N` id, the version from `src/data/release.json` — so the badge never needs editing.

It is the only place the badge treatment is allowed: one pill, one fold, never a row of
them and never inside catalog surfaces. The cards are stacked with `absolute inset-0`,
so the height does not jump with caption length, and the hidden ones are `inert` rather
than hidden — out of focus order and out of the accessibility tree while staying in flow.

Rotation stops on hover, on focus, in a background tab, and under either motion escape
path. It is timer-driven on purpose: `[data-motion="off"]` removes transitions outright,
so anything waiting on `transitionend` would stall on the first card.

### Home Links

Home links should be direct, localized navigation to key catalog surfaces. Keep them compact and useful.

### Catalog Stats

Stats are small, three-column pills with icons, tabular numbers, and muted labels. The animation should feel like a quick focus cue, not a dashboard metric showpiece.

### Search Screenshot Section

The homepage search section combines explanatory copy with localized screenshot imagery (`1-ru.png` / `1-en.png`). It may use stronger shadow than routine catalog cards because it is a product image feature.

### Buttons And Chips

Buttons and chips use compact padding, squircle rounding, and semantic tokens. Primary
buttons use `primary` and `primary-foreground`.

### Catalog Filters

The filter list has **two registers driven by one markup**, switched at `lg`.

- **Below `lg`** the filters open as a band under the search field, where a wrapped row of
  chips works: `rounded-full`, a resting `border` on `bg-surface`, active in solid `accent`
  / `accent-foreground`.
- **From `lg`** the same buttons become full-width rows in the aside: label left, count
  right in `tabular-nums`, active in `accent-soft` / `accent-soft-foreground`.

A chip cloud in a 20rem column wraps raggedly and truncates long country and region names
mid-word, which is why the desktop register is a list. And a full-width row filled with
solid `accent` turns twenty rows into a carpet, so the row register takes the quiet fill
instead. The accent is still the signal in both — only its loudness follows the shape.

The count is plain text, never a filled pill: inside a chip that was a capsule within a
capsule. Resting hover fills must not use `bg-muted` on the catalog page — that is the
page background itself, so the hover would be invisible.

### Focus

There is exactly one focus recipe, in `@layer base`: a 2px `accent` outline with a 2px offset on every interactive element. Components must not add their own focus ring and must not set `focus-visible:outline-none` — a per-component ring at 25-40% opacity does not clear the 3:1 contrast requirement, and `box-shadow` rings get clipped inside scroll containers.

### Center Cards

Center cards remain the core catalog primitive. They must keep titles readable, metadata compact, locations scannable, and localized routes stable.

**One ring per nesting level.** The card owns exactly one ring, and nothing inside it gets
a second one. Metadata is carried by type and spacing — weight, tone, a `·` separator —
not by a pill, badge, or bordered segment per field. A card that nests four ringed
capsules inside its own ring flattens its hierarchy: every element reads equally
important, and the title stops leading.

The whole card is a link, so it must never contain a decorative "details" button, and it
must have a hover state — ring step, lift, and an underlined title. Resting elevation
stays off: a shadow under each of several hundred cards is noise plus compositing cost,
so `surface-lift` is spent on hover instead.

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

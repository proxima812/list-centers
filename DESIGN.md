---
name: Tatarverse
description: Bilingual catalog of Tatar, Bashkir, Tatar-Bashkir, and Crimean Tatar centers.
register: brand
colors:
  background: "#F6F3F9"
  foreground: "#1F1C21"
  muted: "#E9E5EE"
  muted-foreground: "#534F56"
  subtle: "#E1DCE6"
  subtle-foreground: "#646067"
  surface: "#FBF9FD"
  surface-foreground: "#1F1C21"
  surface-muted: "#EDEBEF"
  catalog: "#EDEBEF"
  border: "#CAC7CC"
  border-muted: "#D8D6DA"
  ring: "#C4C0C9"
  primary: "#1F1C21"
  primary-foreground: "#FBF9FD"
  link: "#1F53B8"
  link-decoration: "#447BE4"
  depth-100: "#D3D1D6"
  depth-200: "#C0BBC4"
  depth-300: "#9C97A0"
  depth-400: "#78747C"
  depth-500: "#5A565E"
  depth-600: "#454149"
  depth-700: "#312E35"
  accent: "#1F1C21"
  accent-foreground: "#FBF9FD"
  accent-glow: "#9C97A0"
  destructive: "#B23A26"
  favorite: "#BD1F3F"
typography:
  display:
    fontFamily: "'Twemoji Country Flags', 'Tatarverse Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, calc(7.1vw - 3px), 4.5rem)"
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
  hero-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
    typography: "{typography.caption}"
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
  filter-row-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
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
  section-feature:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "0"
    padding: "48px 0"
  platform-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "8px"
    typography: "{typography.caption}"
---

# Design System: Tatarverse

## 1. Overview

**Creative North Star: "A Catalog With A Signal"**

Tatarverse is a practical catalog with a public identity. The homepage introduces the
project with the flower mark, a rotating news badge, uppercase hero typography where one
line carries the accent, a short link list, and a stack of explanatory feature sections
built from real data and real interface imagery. After that first impression, the product
returns to a quiet, scannable catalog language.

The design system has two layers:

- **Brand layer:** homepage identity moments — the mark, the hero, the badge, the feature
  sections, product imagery.
- **Catalog layer:** centers list, cards, filters, search, saved, nearby, stats, MDX
  content, navigation, translation surfaces, and source-backed detail pages.

The brand layer should make the site memorable. The catalog layer should make the data
easy to use.

**The default is quiet.** The shipped accent preset is monochrome — the signal is ink, not
a hue. Everything below has to hold when the visitor never touches the appearance menu.

## 2. Color

The base palette is neutral and semantic. Light neutrals live in `@theme` in
`src/styles/tailwind.css`, dark ones under `.dark` in the same file; each accent preset
carries only its accent tokens in `src/styles/palettes/<name>.css`. The Tailwind v4 tokens
are `background`, `foreground`, `muted`, `subtle`, `surface`, `surface-muted`, `catalog`,
`border`, `ring`, `primary`, `link`, `depth-*`, `accent`, plus two role colors —
`destructive` and `favorite`.

### Base Roles

- **Background / Surface:** the page, cards, menus, screenshots, and MDX content.
- **Foreground / Primary:** the main ink color for text, strong actions, and active filters.
- **Muted / Subtle:** low-emphasis surfaces, metadata, labels, chips, and quiet card backgrounds.
- **Catalog:** the band the center grid sits on. It is an alias — `surface-muted` in light,
  `muted` in dark — so the card keeps its lightness step against the band in both themes.
- **Border / Ring / Depth:** separators, inset rings, dividers, and tonal hierarchy.
- **Primary Foreground:** inverse text for active controls and primary buttons.
- **Accent / Accent Foreground:** the one signal color and its contrast pair.
- **Link / Link Decoration:** prose links. Blue in both themes and **not** the accent:
  a link that changed hue with the appearance menu would stop reading as a link.
- **Destructive / Favorite:** clearing filters and the saved-center heart. Two fixed roles,
  authored per theme, never borrowed for decoration.

### Themes

The site ships **light and dark** themes plus **six accent palettes**. Both are user
choices, persisted in `localStorage` and applied by an inline script in `<head>` before
first paint (`src/layouts/Layout.astro`).

- Theme: `.dark` class on `<html>`, chosen via `light` / `dark` / `system`.
- Accent: `data-accent` on `<html>` — `default` (monochrome, the default), `green`,
  `blue`, `violet`, `red`, `pink`.

`default` is the odd one out and deliberately so: its accent is the ink itself — `#1F1C21`
in light, `#EFECF2` in dark — so the theme switch reverses the whole picture. A signal does
not have to be a hue; contrast is a signal too, and the catalog reads well without colour.
Its dark paper is the shared one, like everyone else's — a preset carries no paper of its
own.

The preset list lives in exactly one place, `src/utils/accents.ts`, and both the header
dropdown and the mobile toggle read it. Adding a palette means editing that file plus
adding `src/styles/palettes/<name>.css` — never a second copy of the swatch array. The
`from` / `to` pair in each preset is the swatch gradient in the menu, nothing else.

**A preset is colour and nothing but colour.** `src/styles/palettes/` holds six files,
and each holds exactly two blocks — the accent tokens in light and in dark. The neutral
paper, the borders, the ink and the depth ramp live in `tailwind.css`, and so does the
radius scale. Switching palette repaints the interface; it does not change its shape, its
depth or its contrast.

This used to be otherwise: every preset shipped its own dark surface ladder and its own
shape register, so the palettes read as that many different sites rather than that many
colours of one. Removing that removed the class of bug it caused — a ladder solved once is
solved for all six, instead of six ladders each drifting on its own.

Selectors inside a palette file start with `:root` on purpose, not for looks: `(0,2,0)` and
`(0,3,0)` beat the `(0,1,0)` of `:root` from `@theme` and of `.dark`. That makes `@import`
order irrelevant, so palette files can be listed in any sequence.

**Light and dark values of an accent are deliberately different** — a single hue cannot
clear the contrast threshold on both a white and a near-black background.

**Neither theme's neutrals depend on the accent.** Light and dark paper are both shared by
all six presets; the accent changes nothing but the accent tokens.

### The Surface Ladder

**`muted` sits between `background` and `surface`. This is the load-bearing rule of the
whole system.** A section band takes `bg-muted` and is recessed relative to the page; a
card on that band takes `bg-surface` and is raised above it. Order the two the other way
and the catalog collapses.

That is exactly what used to happen. `muted` sat *above* `surface` in dark, and at several
presets they landed on the same value or one point apart — `pink` `15%/15%`,
`red` `13%/12%`, and the since-removed `orange` `20%/20%`. Several hundred centre cards rendered the same colour
as the list band behind them. In light, `surface` and `background` were both pure white,
so every `bg-surface` panel on the page — `Box`, MDX, project cards — was white on white.

    dark:   background  <  muted  <  surface  <  surface-muted  <  subtle
    light:  surface  >  background  >  surface-muted  >  muted  >  subtle

| theme | background | muted | surface | surface-muted | subtle |
| --- | --- | --- | --- | --- | --- |
| light (all six) | `#F6F3F9` | `#E9E5EE` | `#FBF9FD` | derived | `#E1DCE6` |
| dark (all six) | `#090211` | `#150C1C` | `#201727` | derived | `#2F2936` |

**Neither end of the ladder is neutral, and no end is pure.** The paper is `#FBF9FD` and
the ink is `#090211` — a near-white and a near-black, both carrying the same violet hue
(`H 308` in OKLCH). Pure `#FFFFFF` and pure `#000000` are gone from the project entirely:
white paper glares next to a tinted interface, and a pure-black page kills every shadow
while making any accent on top of it look detached. Every fill, every line and every depth
step is now a step of that one hue at a different lightness and a decreasing chroma.

The dark steps are **not** the old ones with a tint added. The old ladder stood on `L* 0`
and could spend its whole range going up; this one starts at the ink's own lightness, so
the steps above it are re-solved rather than shifted — the constraints below are what they
are solved against, and `card on band` lands at `ΔL* 4.96` in dark and `4.87` in light.

One ladder per theme, no per-preset variants. The dark one is the former `violet`
register — the Vercel read: pure black canvas, surfaces raised sparingly, quiet borders,
ink that is not white (`93%`). It was picked over the louder registers because it is the
one that survives every hue sitting on top of it: an accent is a signal, and a signal
needs quiet paper, not paper competing with it.

`surface-muted` and both border tokens are derived from `surface` in `@theme`, so the
whole ladder moves together and only four values are ever authored.

**The page → surface step is the main depth signal in dark, and it is deliberately larger
than its light counterpart.** Light theme lets a shadow finish the job; dark theme has no
usable shadow, so the step has to carry it alone. Near white the scale is compressed and
`surface → background` is only `ΔL 1.9` — that is fine, because light theme still has a
shadow and a border to finish the job.

Every value is solved numerically, not chosen by eye. The constraints: the ladder order
above, `card on band >= ΔL 4`, `border-muted >= 1.28:1` against both `surface` and
`background`, `border >= 1.5:1`, and `muted-foreground` / `subtle-foreground` at
`>= 4.55:1` against **all five fills of their own palette** — not just against the page.
The old values cleared AA on the page and failed on `bg-muted` (`4.01`) and `bg-subtle`
(`3.66`), which is precisely where the toolbar counter and the footer put them.

`depth-100` is the quiet hairline: section dividers, MDX panel rings, pagination, filter
group separators. It is derived so it reads on `surface` and on `muted` at once. Do not put
an alpha modifier on it — `ring-depth-100/70` measured `1.04-1.22:1` across all twelve
combinations, a line that was not there.

It used to carry an accent ring on the catalog card as well. That ring is gone: first the
arc stopped running, then the gradient flattened, and it still read as ripple across four
hundred cards. A card is now separated by its own fill against the catalog band, and the
hover lift does the signalling.

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
stay authored. A single global proportion would flatten the recessed band into the page,
and `subtle` has no feasible global proportion at all while the inks stay authored.

The authored `hsl()` values and these `color-mix()` formulas live in exactly one place —
the CSS. The percentages above are a reading of that source, not a second copy: when they
disagree, the CSS wins and this table is what needs fixing. (A standalone contrast-audit
script used to reproduce this arithmetic; it was removed as a second source of truth.
Contrast is now checked against the CSS directly, via the impeccable design hook or by
hand.)

### Brand Accent

The accent appears in the hero line, the flower mark, focus indicators, active filter
chips and rows, and the filter badge. Treat it as a named signal, not a general palette.
Do not apply it to cards, prose, footer links, or center detail pages unless a specific
design pass asks for that.

Two satellites exist for the hero only: `accent-vivid` (the saturated twin) and
`accent-glow` (the halo behind the pulsing hero line). They are authored per preset next
to the accent and are not general-purpose colors.

### Soft Accent

`accent-soft` / `accent-soft-hover` / `accent-soft-foreground` are the quiet fill of the
accent — the hero badge and the active filter row in the desktop aside. They are not
authored per preset: each is a `color-mix()` over the current `accent` and neutrals, so
all twelve theme × accent pairs follow for free.

Two things are deliberate there. The text is **not** pure `accent` — on a 12% fill light
green gives 3.9:1, below AA for 12px, so 25% `foreground` is mixed in and the worst pair
lands at 5.6:1. And the dark fill takes 18% accent instead of 12%: on a near-black page
12% lifted the pill by only 6.7-8.4 in perceptual lightness, at or under the flatness
threshold described below.

### Color Rules

**Neutrals Carry Structure.** Default to the semantic neutral tokens for layout, controls, content, and catalog surfaces.

**The Accent Is A Signal.** The accent belongs to identity moments, focus, and active state only. It should never become a generic decoration.

**Never Hardcode A Color.** Anything written as a literal hex or a Tailwind palette class (`bg-white`, `text-zinc-500`) will not survive a theme switch. `bg-white` and `text-black` are doubly wrong now: those two values do not exist in this project at all — the paper is `#FBF9FD` and the ink is `#090211`. The only exceptions are third-party brand colors — the platform tiles in the homepage link showcase and the social buttons are the sanctioned list, and they are brand marks, not interface color.

**No Cultural Color Pastiche.** Do not infer a palette from flags, ethnic motifs, or ornamental references. Cultural meaning comes from the content and source-backed data.

## 3. Typography

The site uses **Tatarverse Sans**, a self-hosted variable font (weights 100-900,
`font-display: optional`, loaded through Astro's font pipeline as
`--font-tatarverse-sans`), with the system sans stack as fallback. `Twemoji Country Flags`
sits first in the stack but is scoped to flag glyphs by `unicodeRange` — everything else
falls through to Tatarverse Sans. The voice is practical and direct, with a sharper
homepage display treatment.

### Hierarchy

- **Display:** homepage hero only. Heavy uppercase sans, tight tracking no tighter than
  `-0.04em`, balanced wrapping, short localized phrases.
- **Headline:** major page titles, list heroes, feature section titles, and content headers.
- **Title:** center card titles, post titles, compact section headings, and detail-page modules.
- **Body:** MDX content, summaries, factual descriptions, policy text, and explanatory copy.
- **Label:** buttons, chips, nav items, stats labels, metadata, and menu controls.
- **Caption:** filter counts, group headings, and other micro-labels. This is the floor — nothing meaningful goes below 12px.

### The Hero Scale Is Measured, Not Guessed

The hero size is a `clamp()` tied to viewport width, and **each locale has its own**: the
container is the same but the longest line is not — «Язык. Культура. Люди.» is 13.4em,
"Language. Culture. People." is 15.4em, and the Russian coefficient broke English onto
three lines with an orphan. Change the hero copy and re-measure all three numbers: slope =
`100 / width` with ~5% headroom, ceiling = `984 / width`, floor = `280 / width`. Write the
class as a whole literal — Tailwind scans source text and will not see a class assembled
from a variable.

### Typography Rules

**Display Is Scarce.** Heavy uppercase display type is for the homepage identity and rare page-level statements. Do not use it inside cards or dense content modules.

**Factual Copy Wins.** The site should not sound like marketing. Use direct labels, source-backed descriptions, and localized wording that stands alone.

**Respect Locale Length.** Russian and English strings must wrap without overflow. Long titles need `overflow-wrap`, balanced headings, or tighter component constraints before changing copy.

## 4. Layout

The site uses centered content, generous vertical rhythm on the homepage, and compact catalog modules on data-heavy pages.

- Homepage: badge, hero title, quick links, then a stack of unframed feature sections — the
  project statement with an illustration, the search explainer with a localized screenshot,
  the link showcase, and the people numbers. Rhythm comes from vertical spacing, not from
  panels.
- Centers index: list hero, toolbar, search/filter controls, grid cards, and pagination.
  Filters live in a left aside from `lg` and in a collapsible band below it.
- Center detail: compact navigation, a left-aligned header, the MDX body in a measured
  column, and a facts aside. Everything sits on one left axis — the header must not be
  centered above left-aligned prose, and neither the body nor the aside is wrapped in a
  panel. Separation comes from spacing, column measure, and hairline rules.
- Saved and nearby: the same card primitive as the catalog, an empty state that links back
  to the catalog, and no filters. They are views, not a second catalog.
- Stats: catalog numbers and country breakdown, built entirely from the collections.
- MDX pages: a readable surface with clear prose styles and restrained borders.

### Layout Rules

**One Strong Idea Per Fold.** The homepage can breathe. Catalog pages should stay compact and practical.

**Cards Are Functional.** Use cards for center records, posts, MDX surfaces, and real grouped data. Do not add decorative card grids.

**Screenshots Are Product Imagery.** The search section should use real interface imagery when explaining behavior. Avoid placeholder panels.

**Every Number Is Computed.** Counts on the homepage come from `catalogStats` and from the
same link parser the card uses. A figure that cannot be derived from the collections needs
a visible source, or it does not ship.

## 5. Shape And Surface

The visual language uses squircle geometry through `@toolwind/corner-shape` and a
**four-step semantic radius scale**. Never write a raw `rounded-2xl` / `rounded-3xl` /
`rounded-4xl` again — those numbers are the default preset's values, not the meaning.

- `rounded-micro` (`8px`) — badges, chips, inputs, small icon buttons.
- `rounded-control` (`16px`) — buttons, menu items, toolbars, popovers.
- `rounded-card` (`24px`) — panels, ordinary cards, and the images inside the homepage
  feature sections.
- `rounded-catalog` (`32px`) — center cards and other large catalog surfaces.
- `rounded-full` stays raw. A pill is not a step on the scale: it must **not** move with
  the preset, or toggles and avatars would stop being circles.

MDX and utility panels take `rounded-control` plus a thin border or ring, and `shadow-2xs`
only when separation is needed.

### Radius Is A Constant

Radius does **not** follow the accent. One scale — `8 / 16 / 24 / 32` for
`micro / control / card / catalog` — lives in `@theme` and serves all six presets, in
both themes: contrast depends on the background, shape does not, and neither depends on
which colour the visitor picked.

Presets used to carry three different shape registers (`8/16/24/32`, `8/12/18/24`,
`6/8/12/16`). It made choosing a colour silently rebuild the geometry of every card,
button and chip on the page, which is not what a colour picker promises. Palette files no
longer declare `--radius-*` at all; if a component needs a different corner it asks for a
different step of the one scale.

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

Motion is part of the system, but it is limited. Everything animated in the project is CSS
in `src/styles/tailwind.css` or in a component's own `<style>` block — there is no JS
animation library, and adding one is a design decision, not an implementation detail.

- **Hero line:** `hero-pulse`, a slow halo on the accent line driven by `--color-accent-glow`.
- **Hero badge:** a short entrance per rotation; the rotation itself is timer-driven.
- **Drawer:** `drawer-in` / `drawer-out` plus `fade-in` / `fade-out` for the mobile menu and its backdrop.
- **Controls:** small hover, focus, and active-state transitions.

Every animation needs a reduced-motion path. Motion must enhance already visible content,
not gate content rendering.

### Two Off Switches

Motion has **two independent off switches**, and a component must survive both:

1. **OS preference** — `@media (prefers-reduced-motion: reduce)`.
2. **User toggle** — the appearance menu in the header writes `data-motion="off"`
   on `<html>` (localStorage key `motion`, `on` by default). It forces
   `animation: none` and `transition: none` on every element plus
   `scroll-behavior: auto`, killing the hero, the badge rotation, and hovers
   while leaving colors and gradients intact.

Because the toggle removes animations outright, **any component whose state
machine waits on `animationend` or `transitionend` will hang**. Such components
must be carved out and given `animation-duration: 1ms` instead of `none` — the
mobile drawer (`[data-menu-list]`, `[data-menu-backdrop]`) is the existing
precedent. Check every animated surface in all three states: motion on, toggle
off, OS reduced-motion.

## 7. Components

### Logo Mark

The mark is `flower.svg` used as a CSS mask, not as an image: the file is filled black and
the colour comes from a token, so the shape follows theme and accent for free. The colour
is `var(--logo-mark-color, var(--color-accent))` — an inverted surface such as the footer
overrides the variable rather than shipping a second SVG.

It is **one flat fill, and it does not move.** The gradient sweep and the nine-second
shimmer are gone — a permanently animating logo reads as a separate effect competing with
the identity it is supposed to be, and it was the only decoration on the site that never
stopped. Changing the accent changes the mark; nothing else does.

### Hero Title

The hero title uses heavy uppercase lines with one accent line and quieter secondary lines.
Keep words short enough for mobile; the scale is measured per locale (see Typography). Do
not add repeated section eyebrows around it.

### Hero Badge

One soft-accent pill above the hero title, rotating through three project news items: the
latest post, the newest center, and the current site version. Every line is derived from
data — posts by `pubDate`, centers by their sequential `tbk-N` id, the version from
`src/data/release.json` — so the badge never needs editing.

It is the only place the badge treatment is allowed: one pill, one fold, never a row of
them and never inside catalog surfaces. The cards are stacked with `absolute inset-0`,
so the height does not jump with caption length, and the hidden ones are `inert` rather
than hidden — out of focus order and out of the accessibility tree while staying in flow.

Rotation stops on hover, on focus, in a background tab, and under either motion escape
path. It is timer-driven on purpose: `[data-motion="off"]` removes transitions outright,
so anything waiting on `transitionend` would stall on the first card.

### Home Links

Home links should be direct, localized navigation to key catalog surfaces. Keep them compact and useful.

### Home Feature Sections

The homepage stack after the links is four sections. **They are not panels.** Each one sits
directly on the page: no `bg-surface`, no ring, no `surface-lift`. Two-column split at `md`
with alternating image side, columns separated by `gap`, and the only rounding is on the
image itself. Four full-width cards stacked down the page read as a template; the content
is what should be legible, not the container. They are explanatory, not promotional — each
one either shows a real image of the product or a number the catalog can prove.

- **Statement:** illustration plus the project's own description, with live counts.
- **Search:** copy plus a localized screenshot (`1-ru.png` / `1-en.png`).
- **Link showcase:** platform tiles in a sparse grid, each with a count parsed from the
  catalog by the same `getCenterLinks` the card uses. A platform with no links in the
  catalog does not render a tile. The tiles **stay** cards — `rounded-control`, `bg-surface`,
  a ring, `surface-lift` — because there the frame is the grid's structure, not decoration.
  Brand hues here are brand marks, the one sanctioned exception to the no-literal-color rule.
- **People numbers:** three large figures, centered, straight from the 2021 Russian census
  (Rosstat, volume 5), unrounded, with the source linked in small type underneath. The
  labels say "in Russia" and not "worldwide" on purpose: the census counts nobody outside
  the country, and the copy says so instead of letting the figure imply more than it is.

### Catalog Stats

Stats are small pills with icons, tabular numbers, and muted labels, used on the stats
page. The animation should feel like a quick focus cue, not a dashboard metric showpiece.

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

The one interactive exception is the save button: a small icon control in `favorite`,
layered above the card link, with its own accessible label. It is the only thing allowed
to sit on top of a card link, and it stays icon-only.

### MDX Surfaces

MDX content should use the typography plugin tokens, readable line lengths, restrained borders, and clear link styling. Prose links take `link` / `link-decoration`, not the accent. Do not add marketing wrappers around factual content.

### Print

`/centers/print` is a separate layout with raw radii, no shadows, no accent, and no
appearance state. Screen tokens do not apply there and screen fixes do not need to be
mirrored into it — but a change to the card's content model does.

## 8. Do And Do Not

### Do

- Reuse `src/styles/tailwind.css` tokens before adding visual roles.
- Keep the homepage brand layer distinct from catalog utility surfaces.
- Use real product imagery where it clarifies a feature.
- Preserve source-backed content, locale routes, stable slugs, and metadata behavior.
- Verify contrast for muted labels, placeholders, metadata, and small controls — against every fill they sit on, not just the page.
- Keep both motion escape paths in every animated component: `prefers-reduced-motion` and the `[data-motion="off"]` toggle.
- Check a visual change in the monochrome default first: if it only reads under a colored preset, it does not read.

### Do Not

- Do not turn the whole site into the accent color.
- Do not hardcode hex values or Tailwind palette classes in components — outside the sanctioned platform and social brand marks.
- Do not add extra cultural palettes or ornamental motifs.
- Do not add glossy SaaS gradients, glass panels, side stripes, or generic icon-card grids.
- Do not reuse homepage display treatment inside dense catalog surfaces.
- Do not add decorative motion to MDX pages, lists, or center detail content.
- Do not rewrite factual copy into slogans.
- Do not ship a number the catalog cannot compute or a source cannot back.

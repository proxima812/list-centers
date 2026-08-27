# Product

## Register

brand

## Product Purpose

`tatarverse.cc` is a practical bilingual catalog of Tatar, Bashkir, Tatar-Bashkir, and Crimean Tatar cultural and community centers. Success means a visitor can quickly understand the project, find relevant centers, verify source-backed details, and switch between Russian and English without losing context.

## Users

- People looking for a center, community, source, or related reference page.
- Contributors who can verify and improve center data.
- Translators maintaining English versions of Russian source entries.
- Researchers and community members who need stable source-backed links.

## Current Scope

- Static Astro 7 site (`output: "static"`, no SSR adapter), deployed to Cloudflare Pages.
  Builds are incremental: `experimental.incrementalBuild` plus a `cacheKey` on the
  center and post routes.
- Public locales: Russian (`ru`, default, unprefixed) and English (`en`, under `/en/`).
- Russian center entries are the source content in `src/data/centers_formatted` (424 entries).
- English center entries live in `src/data/centers_i18n/en` (366 entries — translation coverage is partial).
- UI strings live in `src/i18n/locales/ru.ts` and `src/i18n/locales/en.ts`; page-level
  copy that is too long for a dictionary lives in `src/data/pages_i18n`.
- Public surfaces: homepage, centers index, center detail, saved, nearby, stats, sources,
  translations, policy, thanks, posts index, post detail, print view, 404.
- Machine surfaces: RSS for centers and posts, a client search index and a nearby index as
  JSON, `robots.txt`, sitemap, `llms.txt`, `ai.txt`, a Markdown twin of every page via
  dualmark (the copy-page menu), and a PWA manifest with an offline service worker.
- Secondary content: 11 posts (all translated to English in `src/data/posts_i18n/en`),
  7 thanks entries.

## What The Visitor Can Do

- Browse and filter the catalog client-side: search with Fuse.js, facets by country,
  region, and kind, plus URL state so a filtered view is shareable.
- Save centers to a local favorites list (`/saved`, `localStorage`, not indexed).
- Find centers near them (`/nearby`), by geolocation when available and by picking a
  country when it is not — the country list is built at build time so the page works
  without geolocation and without Cloudflare.
- Read the catalog on paper (`/centers/print`) or copy any page as Markdown.
- Set their own presentation: light/dark/system theme, six accent presets (monochrome
  `default`, green, blue, violet, red, pink), and a motion on/off toggle, all in
  the header appearance menu and all persisted in `localStorage`.

## Brand Personality

Useful, precise, compact, cultural, modern, and restrained. The design system is neutral
by default — the shipped default accent is monochrome ink, not a hue — and the homepage
carries a single controlled brand layer: the flower mark, a compact uppercase hero title
with one accent line, a rotating news badge, a short link list, and a few explanatory
sections. The catalog itself remains quiet and factual.

## Anti-references

No glossy SaaS styling, marketplace templates, generic startup hero language, decorative
card grids, invented slogans, cultural-color pastiche, or broad new palettes. Do not make
the functional catalog feel like a campaign page. Do not expand motion beyond the hero,
the drawer, and small control feedback.

## Design Principles

1. Keep the catalog useful first.
2. Make center information easy to scan, compare, and verify.
3. Preserve factual wording, source links, locale routing, and stable slugs.
4. Use the neutral token system for structure and the accent only as a signal — hero
   phrase, focus, active state. Never hardcode a hue: the accent is the visitor's choice,
   and it is monochrome unless they change it.
5. Let real interface imagery carry explanation where it is clearer than text.
6. Use motion sparingly: the hero line, the news badge, the drawer, and small control
   feedback only.
7. Keep localization behavior predictable and visible.
8. Show no number the project cannot source. Catalog counts are computed from the
   collections; anything else needs a link.

## Accessibility & Inclusion

Aim for clear readable contrast in both themes and all six accent presets,
keyboard-accessible controls, semantic structure, meaningful alt text, and multilingual
consistency. Motion must respect both `prefers-reduced-motion` and the in-app motion
toggle (`[data-motion="off"]`). Placeholder text, muted metadata, and small labels must
remain legible against every fill they sit on, not just against the page.

## Known Debt

- `HomePeopleStats` ships rounded population estimates with no source, and its copy is a
  draft. Either source the numbers or drop the section — the file says so in place.
- `HomeFollowersCarousel` is not mounted on any page and still carries placeholder English
  copy from its template origin.

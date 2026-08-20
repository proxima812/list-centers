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

- Static Astro 7 site, deployed to Cloudflare Pages.
- Public locales: Russian (`ru`, default, unprefixed) and English (`en`, under `/en/`).
- Russian center entries are the source content in `src/data/centers_formatted` (420 entries).
- English center entries live in `src/data/centers_i18n/en` (363 entries — translation coverage is partial).
- UI strings live in `src/i18n/locales/ru.ts` and `src/i18n/locales/en.ts`.
- Primary public surfaces: homepage, centers index, center detail pages, stats, sources, translations, policy, projects, thanks, and posts.
- Secondary content: 11 posts, 2 projects, 7 thanks entries.

## Brand Personality

Useful, precise, compact, cultural, modern, and restrained. The design system is neutral by default with one signal accent, and the homepage carries a single controlled brand layer: a liquid-metal mark above a compact hero title and a short link list. The catalog itself remains quiet and factual. Presentation belongs to the visitor: light/dark/system theme, six accent presets (green default, blue, violet, red, orange, pink), and a motion on/off toggle, all in the header appearance menu.

## Anti-references

No glossy SaaS styling, marketplace templates, generic startup hero language, decorative card grids, invented slogans, cultural-color pastiche, or broad new palettes. Do not make the functional catalog feel like a campaign page. Do not expand motion beyond meaningful hero, stat, and state transitions.

## Design Principles

1. Keep the catalog useful first.
2. Make center information easy to scan, compare, and verify.
3. Preserve factual wording, source links, locale routing, and stable slugs.
4. Use the neutral token system for structure and the accent only as a signal — hero phrase, focus, active state. Never hardcode a hue: the accent is the visitor's choice.
5. Let real interface imagery carry explanation where it is clearer than text.
6. Use motion sparingly: page identity, the homepage brand mark, and small control feedback only.
7. Keep localization behavior predictable and visible.

## Accessibility & Inclusion

Aim for clear readable contrast in both themes and all three accent presets, keyboard-accessible controls, semantic structure, meaningful alt text, and multilingual consistency. Motion must respect both `prefers-reduced-motion` and the in-app motion toggle (`[data-motion="off"]`). Placeholder text, muted metadata, and small labels must remain legible against their surfaces.

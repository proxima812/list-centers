---
name: tt-xima-ui-edits
description: Use when editing Astro UI in tt.xima.work: list screens, cards, toolbar/filter behavior, MDX-facing components, or Tailwind v4 classes while preserving the current visual language and minimal-change discipline.
---

# TT Xima UI Edits

Use this skill for narrow UI work in `tt.xima.work`.

## Current Surface Area

- Astro pages and components
- Tailwind CSS v4 via `src/styles/tailwind.css`
- `@/` alias for imports
- `astro-icon` for icons
- `corner-squircle` is part of the active visual language

Most common edit targets:

- `src/components/list/ListCards.astro`
- `src/components/list/ToolBar.astro`
- `src/components/list/GridCards.astro`
- `src/components/ui/CardItem.astro`
- `src/components/ui/ButtonLink.astro`
- `src/components/markdown/A.astro`
- `src/components/widgets/SocialButton.astro`
- `src/layouts/MDX.astro`
- `src/layouts/Layout.astro`
- `src/components/partials/SEO.astro`

## Existing Design Language

- White background, zinc-first text, restrained chrome
- Shared width and page rhythm come from `src/components/partials/Container.astro`
- Primary interaction color is dark and understated, not bright-accent UI
- Rounded shapes commonly use `rounded-2xl` with `corner-squircle`
- Cards, chips, and controls rely on rings, subtle fills, and light hover states
- The project has expressive homepage typography, but list/detail screens are more utilitarian

## Reuse First

Prefer existing components before adding new patterns:

- Buttons and CTA links: `src/components/ui/ButtonLink.astro`
- Center cards: `src/components/ui/CardItem.astro`
- Page shell: `src/components/partials/Container.astro`, `src/layouts/Layout.astro`
- List toolbar, search, country and region filters: `src/components/list/ToolBar.astro`
- MDX outbound/social links: `src/components/markdown/A.astro`, `src/components/widgets/SocialButton.astro`

## Editing Rules

- Match the current zinc-first palette unless the user asks for a visual change.
- Do not introduce a new spacing scale, corner style, shadow style, or button treatment without a concrete need.
- Prefer Tailwind utilities. Use component-local styles only when utilities are not enough.
- Keep list/filter behavior stable. `ToolBar.astro` owns the search and chip interactions.
- Preserve SEO and layout wiring in `src/layouts/Layout.astro` and `src/components/partials/SEO.astro`.
- Treat MDX link rendering as UI too: changes in `A.astro` can affect editorial pages globally.

## Watchouts

- There is some coupling between `ListCards.astro`, `GridCards.astro`, `ToolBar.astro`, and `CardItem.astro`.
- The list page depends on `data-*` attributes for client-side filtering; preserve that contract.
- File naming may be case-sensitive across environments. Check actual paths before renaming imports.
- Do not normalize expressive homepage typography or MDX prose styles unless requested.

## Safe Workflow

1. Inspect the nearest existing component with the same behavior.
2. Reuse classes, structure, and `data-*` hooks already present in the repo.
3. Edit the smallest possible file set.
4. Run a lightweight check only if the change touches syntax or interactive behavior.

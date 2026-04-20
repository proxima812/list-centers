---
name: tt-xima-design-review
description: Use when auditing or tightening visual consistency in tt.xima.work: component reuse, list/detail cohesion, Tailwind token discipline, MDX/UI alignment, and design-system drift across Astro components.
---

# TT Xima Design Review

Use this skill when the task is to assess or tighten the project's design system without expanding into an unsolicited redesign.

## Current System Snapshot

The project has a lightweight real design system, centered on a few repeated surfaces:

- tokens and utilities in `src/styles/tailwind.css`
- shared layout shell via `src/layouts/Layout.astro` and `src/components/partials/Container.astro`
- shared button/link treatment via `src/components/ui/ButtonLink.astro`
- reusable list card surface via `src/components/ui/CardItem.astro`
- repeated filter/chip patterns inside `src/components/list/ToolBar.astro`
- shared social-link rendering through `src/components/markdown/A.astro` and `src/components/widgets/SocialButton.astro`

It is cohesive enough to protect, but not abstracted enough to tolerate broad refactors casually.

## Strengths

- Consistent neutral palette across layout, cards, filters, and text
- Repeated rounded-squircle shape language
- Clear distinction between landing/editorial surfaces and utilitarian list surfaces
- Shared social-link treatment across MDX and widget contexts
- Sensible component boundaries for layout, cards, and button-like UI

## Weak Points To Check

- Toolbar/filter UI is centralized, but still contract-heavy because it depends on card dataset values
- Button, chip, and icon-link treatments are similar but not fully normalized
- MDX, list, and landing surfaces can drift apart if edited independently
- SEO and metadata changes are easy to scope badly because they live in shared layout components
- Local AI docs/skills can go stale and cause incorrect future edits

## Review Heuristics

When reviewing, check these in order:

1. Are tokens reused before raw color values or one-off treatments?
2. Does a new element match existing radius, border, ring, and spacing patterns?
3. Does the change preserve the `ToolBar` to `CardItem` filter contract?
4. Should a repeated pattern become a shared UI component?
5. Is expressive homepage styling leaking into utilitarian list/detail screens?
6. Did the change improve consistency without forcing a redesign?

## Preferred Direction

- Keep the current monochrome editorial feel.
- Consolidate repeated chip/button/social-link styles gradually.
- Expand tokens only when a second real use case appears.
- Avoid broad refactors unless the user asks for a system pass.

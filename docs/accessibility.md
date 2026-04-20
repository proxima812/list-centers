# Accessibility / A11Y Guide

This document is the working accessibility checklist for `tt.xima.work`.

## Core Rules

- Keep the document language correct: `html[lang]` must match the active UI language.
- Every page must have one clear `h1`.
- Use semantic landmarks: `header`, `nav`, `main`, `footer`, `aside` where appropriate.
- Interactive UI must use real interactive elements:
  - navigation -> `<a>`
  - actions -> `<button>`
  - grouped toggles -> buttons or radios with keyboard support
- Do not rely on color alone for state.
- Keep focus styles visible in both light and dark themes.

## Links, Buttons, and Toggles

- Every icon-only control needs an accessible name via visible text or `aria-label`.
- Decorative icons must use `aria-hidden="true"`.
- External links should keep meaningful labels and safe `rel` values.
- Current navigation items should expose `aria-current="page"`.
- Toggle groups must support:
  - Tab to enter the control
  - Arrow keys to move between options
  - Enter/Space to activate if needed
  - correct pressed/checked state via `aria-pressed` or `aria-checked`

## Forms, Filters, and Search

- Every input needs a label, visible or programmatic.
- Search/filter controls should expose what they affect with `aria-controls` when practical.
- Dynamic empty states like “No results found” should use polite live regions.
- Filter chips must remain keyboard reachable and expose active state.

## Cards and Content

- Card titles should remain real headings or clear text anchors.
- Repeated card actions must have unique accessible names.
- MDX content must preserve semantic headings order.
- Markdown links rendered through shared components must keep valid labels for:
  - websites
  - email
  - phone
  - message links

## Images, Motion, and Visual Contrast

- Use empty `alt=""` only for decorative images.
- Informative images must describe purpose, not appearance alone.
- Maintain readable contrast for text, controls, borders, and focus rings.
- Respect reduced-motion expectations:
  - avoid essential meaning in animation
  - animated text/effects should degrade safely if motion is reduced later
- Touch/click targets should stay comfortably tappable.

## I18N Requirements

- UI text must not mix languages after navigation.
- Client-side translation must re-run after Astro page swaps.
- Dates, labels, and country names rendered on the client must update with language changes.
- Default first visit stays English unless a stored preference exists.

## Manual QA Before Release

- Open `/`, `/list`, one center detail page, `404`, and one MDX page.
- Test with keyboard only:
  - tab order
  - visible focus
  - language switcher
  - theme switcher
  - list filters
- Switch EN -> RU -> TT and navigate between pages; confirm text does not partially revert.
- Filter list results and confirm empty state is announced and visible.
- Check icon-only links/buttons for accessible names.
- Spot-check light and dark theme contrast.
- Run `bun run build`.

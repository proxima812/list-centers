---
name: tt-xima-content-centers
description: Use when adding, fixing, or reviewing center content in tt.xima.work: `centers` collection schema, MDX entry shape, list/detail data flow, location/filter fields, and editorial-safe content corrections.
---

# TT Xima Content Centers

Use this skill for content tasks around centers.

## Source of Truth

- Center collection key: `centers`
- Loader base path: `src/data/centers`
- Schema file: `src/content.config.ts`
- List page composition: `src/components/list/ListCards.astro`
- Toolbar/filter behavior: `src/components/list/ToolBar.astro`
- Card preview UI: `src/components/ui/CardItem.astro`
- Center detail page: `src/pages/list/centers/[slug].astro`
- MDX page wrapper: `src/layouts/MDX.astro`

Do not rely on older notes that mention `src/data/cards/`. In this repo, the active content path is `src/data/centers`.

## Working Rules

- Keep frontmatter aligned with the current `centers` schema before editing content.
- Prefer fixing content shape instead of patching UI around malformed entries.
- Preserve existing language and editorial tone unless the user requests copy changes.
- When content is missing, favor omission over noisy placeholder text.
- Remember that list filtering depends on normalized `country` and `region` values.

## Expected Fields

Common fields used by the current UI:

- `title`
- `summary`
- `pubDate`
- `type`
- `category`
- `source`
- `location`
- `location.flag`
- `location.city`
- `location.country`
- `location.region`

Check the actual schema before introducing new fields. The active schema currently keeps all these fields optional except `title`.

## UI-Sensitive Content Notes

- Very long dump-style summaries are intentionally suppressed in `CardItem.astro`.
- Country and region values affect client-side filters.
- `CardItem.astro` treats `Нет данных.` as missing location data.
- `pubDate` is consumed for ordering and recency behavior.
- Missing country data falls back to `Прочее` in filtering.
- Social links on detail or MDX surfaces may be auto-rendered through `A.astro` and `SocialButton.astro`.

## Safe Workflow

1. Read `src/content.config.ts`.
2. Inspect one or two nearby entries in `src/data/centers`.
3. Make the narrowest content change.
4. Run `bunx astro sync` only if schema or collection wiring changed.
5. Prefer a lightweight verification over a full build.

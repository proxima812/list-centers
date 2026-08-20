# AGENTS.md

## Project

`tatarverse.cc` is a static Astro site about Tatar, Bashkir, Tatar-Bashkir, and
Crimean Tatar communities, centers, sources, and multilingual reference content.

## Stack

- Astro 7 with static output (`output: "static"`, no SSR adapter).
- MDX content collections and Astro components. No UI framework islands: there
  is no React, Vue, or Svelte in this project, and no JS animation library —
  motion is CSS keyframes in `src/styles/tailwind.css`.
- Tailwind CSS v4 through `@tailwindcss/vite` (single entry: `src/styles/tailwind.css`).
- Bun is the preferred package manager.
- Deploy: Cloudflare Pages via `wrangler` (`bun run cf:deploy`).
- Main source folders: `src/pages`, `src/components`, `src/layouts`, `src/data`,
  `src/i18n`, `src/styles`, `src/utils`, `src/integrations`.
- Site-wide settings live in `main.config.ts`; collection schemas in
  `src/content.config.ts`.

## Content Collections

Defined in `src/content.config.ts`, all schemas are `.strict()`:

| Collection | Base | Notes |
| --- | --- | --- |
| `centers` | `src/data/centers_formatted` | Russian source entries |
| `centersEn` | `src/data/centers_i18n/en` | English translations |
| `posts` | `src/data/posts` | Editorial notes |
| `projects` | `src/data/projects` | Business/media/education projects |
| `thanks` | `src/data/thanks` | Contributor credits |

Geography is not part of the collection schema: `src/data/geo`
(`ruRegions`, `macroRegions`, `places`) normalizes `location` at render time
for facets, search, and cards. There are no coordinates and no `mapUrl` —
the map was removed.

## Working Rules

- Keep changes narrowly scoped to the requested task.
- The agent layer (`.agents/`, `.claude/`, `.codex/`, `AGENTS.md`, `CLAUDE.md`,
  `docs/`) is tracked in git and shared between Codex, Claude, and humans.
  Edit skills only in `.agents/skills/` — `.claude/skills/` symlinks to them.
- Do not modify generated screenshots or local browser artifacts unless explicitly asked.
- Do not redesign UI, spacing, hierarchy, colors, or interactions unless the task asks for UI changes.
- Prefer existing Astro component patterns and Tailwind utilities.
- Do not add dependencies when the existing stack is enough.
- Use `rg` for search.
- Do not edit `src/data/release.json` or `package.json` version by hand — use
  `bun run release:bump`.

## Skills

Every skill lives in `.agents/skills/`. `.claude/skills/` symlinks to the same
directories, so Codex and Claude see one identical set and there is one copy to
maintain. The single exception is `.claude/skills/impeccable/`: a separate
vendor build for Claude that sits next to the Codex build in `.agents/`.
Third-party skills are pinned in `skills-lock.json` — update them with
`bunx skills add`, never by hand-editing `SKILL.md`.

Project skills are prefixed `tatarverse-`.

| Skill | Use for |
| --- | --- |
| `tatarverse-astro-content` | Content, center data, i18n routes, SEO metadata, robots, sitemap. |
| `tatarverse-posts` | Writing and editing `src/data/posts/*.mdx` — voice plus the hard bans below. |
| `tatarverse-ui-tailwind` | Small UI edits: component styling, layout, responsive behavior, a11y. |
| `tatarverse-motion` | CSS keyframe animation that survives `[data-motion="off"]` and reduced motion. |
| `tatarverse-i18n` | Adding locale keys or languages, plus the dictionary completeness audit. |
| `tatarverse-page-weight` | HTML/JS/CSS weight and gzip regressions in `dist` after a build. |
| `tatarverse-collab` | Splitting a task between Claude and Codex; writes a handoff note. |
| `impeccable` | Design work: audits, polish, layout, motion, live picker. Codex variant uses `$impeccable <command>` and `.agents/` script paths. |
| `design-taste-frontend` | Landing/hero/brand-layer work that needs a design direction inferred, not a template. |
| `high-end-visual-design` | Soft, premium visual register when a surface asks for it. |
| `redesign-existing-projects` | Audit-first reworks of a surface that already exists. |
| `full-output-enforcement` | Long exhaustive generations where truncation or `// ...` placeholders would break the file. |
| `find-skills` | Discovering and installing new skills from the open ecosystem. |

`DESIGN.md` is the human-readable design system; `.impeccable/design.json` is
its machine sidecar. They must agree — when you change one, change the other.
Both are authoritative over any aesthetic instinct a design skill brings in.
Three things here are the user's, and every new surface must survive all three:

- **Accent** — six presets (`green`, `blue`, `violet`, `red`, `orange`,
  `pink`) via `[data-accent]`. Single list: `src/utils/accents.ts`; palettes:
  `src/styles/palettes/*.css`.
- **Theme** — light / dark / system via `.dark`.
- **Motion** — the `[data-motion="off"]` toggle plus `prefers-reduced-motion`.

No literal hex and no raw Tailwind palettes — semantic tokens only. Read
`strategy.rules` and `narrative.donts` in `design.json` before touching visuals.

## Content And SEO

- Preserve existing meaning, language, frontmatter, headings, canonical intent, and internal linking behavior.
- Be careful with locale routes: `ru` is the default locale and is served
  unprefixed (`prefixDefaultLocale: false`); `en` lives under `/en/` and
  `src/pages/[locale]/`.
- For center data, preserve stable slugs and existing field semantics.
- `location.flag` is derived from the country at render time via
  `countryFlagsByRu` in `src/data/worldCountries.ts` — do not write it into MDX.
- When editing MDX, avoid broad formatting churn.

### Posts (`src/data/posts`)

Единственный источник этих правил — этот раздел. Скилл `tatarverse-posts`
ссылается сюда и добавляет только голос и формат.

- **Никаких длинных тире.** Только дефис `-`: ни `—` (em dash), ни `–` (en dash).
- **Никакой буквы `ё`.** Только `е`: «темная», «черный», «ведет», «все».
- **Никогда `TatarVerse`.** Верно `Tatarverse` в явных упоминаниях бренда и
  строчное `tatarverse` в теле поста. Написание с большой `V` запрещено везде.
- Правила распространяются и на `title`/`description` во frontmatter, и на тело
  поста. Каждый пост живет и своей страницей `/posts/<id>`, и карточкой в
  ленте: обе поверхности берут один и тот же текст.
- Проверка перед сдачей: `grep -n '[—–ё]\|TatarVerse'` по черновику должен
  быть пустым.

## Validation

- Do not run full builds by default.
- Prefer targeted checks such as `bunx astro check`, focused type checks, or parsing the files touched when useful.
- Run `bun run build` only when the change affects routing, Astro config, integrations, or site-wide data behavior.

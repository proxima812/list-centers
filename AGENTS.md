# AGENTS.md

## Project

`tatarverse.cc` is a static Astro site about Tatar, Bashkir, Tatar-Bashkir, and
Crimean Tatar communities, centers, sources, and multilingual reference content.

## Glossary

Use these words in this sense, including when reporting back:

| Word | Means |
| --- | --- |
| **you** | The agent doing the work right now — Claude Code or Codex. |
| **the other agent** | The one you are not. Both work in this checkout on `main`; pull with `--rebase` before starting and before pushing. |
| **the owner** | Kamil, who runs this project and reads your reports. Decisions about scope, deletions, and design are the owner's. |
| **a contributor** | An outside person following `CONTRIBUTING.ru.md` / `CONTRIBUTING.en.md`. They submit verified center data and translations, not architecture. |
| **a visitor** | Someone reading tatarverse.cc. Owns the presentation: theme, accent, motion toggle. |

Say "the catalog" for the centers listing, "a card" for one center entry, and
"a post" only for `src/data/posts` — not for center entries or docs.

## Stack

- Astro 7 with static output (`output: "static"`, no SSR adapter).
- MDX content collections and Astro components. No UI framework islands: there
  is no React, Vue, or Svelte in this project, and no JS animation library —
  motion is CSS keyframes in `src/styles/tailwind.css`.
- Tailwind CSS v4 through `@tailwindcss/vite` (single entry: `src/styles/tailwind.css`).
- Bun is the preferred package manager.
- Deploy: Cloudflare Pages via `wrangler` (`bun run cf:deploy`).
- Main source folders: `src/pages`, `src/components`, `src/layouts`, `src/data`,
  `src/i18n`, `src/styles`, `src/utils`, `src/integrations`, plus four that hold
  logic pulled out of pages and components:
  - `src/domain` — правила предметной области без DOM и без сети: порядок
    центров, нормализация поиска, статистика каталога, ссылки проекта,
    таблица переключателей оформления.
  - `src/dom` — объявления `data-*`-контрактов между разметкой и клиентскими
    скриптами (`cardAttributes`, `appearanceAttributes`).
  - `src/features` — клиентские фичи, разложенные по ответственности
    (`catalog`: состояние фильтров, URL, поиск, подсказки).
  - `src/seo` — сборка графа schema.org.
- Site-wide settings live in `src/config.ts`; collection schemas in
  `src/content.config.ts`.
- Components are imported directly by path through the `@/*` alias — there is
  no barrel file.
- Cloudflare Pages settings (project name, build output dir) live only in
  `wrangler.jsonc`; the account id only in the `cf:deploy:dist` script.

## Content Collections

Defined in `src/content.config.ts`, all schemas are `.strict()`:

| Collection | Base | Notes |
| --- | --- | --- |
| `centers` | `src/data/centers_formatted` | Russian source entries |
| `centersEn` | `src/data/centers_i18n/en` | English translations |
| `posts` | `src/data/posts` | Editorial notes |
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
- **Pick up the traces.** After deleting or renaming a file, an export, a route,
  or a constant, `rg` its name across the whole repo — including `.md` docs,
  `.agents/skills/`, and hooks — and fix or remove every hit. An edit is not
  finished while dead references survive. This rule is paid for: deleting the
  accent-audit scripts left `DESIGN.md` pointing at them, and removing the map
  left `CONTRIBUTING` documenting `geo` fields that no longer existed.
- **`export *` does not bring a name into the re-exporting module's own scope.**
  Moving a shared constant into a leaf module means the barrel that uses it now
  needs an explicit `import` too. `astro check` passes; the build is what fails.

## Surfaces

A change is not done until it survives every surface it touches. The catalog
card alone lives under all of these at once:

| Surface | Check |
| --- | --- |
| Accent | Seven presets via `[data-accent]` — `default` (monochrome, the default), `green`, `blue`, `violet`, `red`, `orange`, `pink`. Semantic tokens only, never literal hex. |
| Theme | Light, dark, and system (`.dark`). Contrast holds in both. |
| Motion | `[data-motion="off"]` and `prefers-reduced-motion`. Kill animation with `1ms`, not `animation: none` — `animationend` still has to fire. |
| Locale | `ru` unprefixed and `en` under `/en/`. Routes with no EN version are listed in `ruOnlyRoutes` (`src/i18n/index.ts`). |
| Print | `/centers/print` renders the catalog for paper; it has its own layout. |
| Client filter | Тулбар фильтрует карточки по `data-*`. Имена атрибутов объявлены один раз в `src/dom/cardAttributes.ts`: пиши через `cardDataset`, читай через `readCard`. Менять контракт — там же, расхождение станет ошибкой типов, а не багом в рантайме. |

Say which of these you checked and how. "Builds fine" is not a check.

## Skills

Every skill lives in `.agents/skills/`. `.claude/skills/` symlinks to the same
directories, so Codex and Claude see one identical set and there is one copy to
maintain. The single exception is `.claude/skills/impeccable/`: a separate
vendor build for Claude that sits next to the Codex build in `.agents/`.
Third-party skills are pinned in `skills-lock.json` — update them with
`bunx skills add`, never by hand-editing `SKILL.md`.

Project skills are prefixed `tatarverse-`: `astro-content`, `posts`,
`ui-tailwind`, `brand`, `motion`, `i18n`, `page-weight`, `collab`, `research`.
Third-party:
`impeccable`, `design-taste-frontend`, `high-end-visual-design`,
`redesign-existing-projects`, `full-output-enforcement`.

What each one is for is not repeated here. Every skill's `description` is
injected into context anyway, so a second copy in this file only buys drift —
it already had some. A description carries **trigger words**, not a summary of
the skill body: it is paid for in every session, including the ones where the
skill never fires. Keep new ones short and keyword-shaped.

## Design System

`DESIGN.md` is the human-readable design system (27 KB of reasoning);
`.impeccable/design.json` is its machine sidecar. They must agree — when you
change one, change the other. Both are authoritative over any aesthetic
instinct a design skill brings in.

Read them at the depth the task needs — loading 57 KB to restyle one button
costs context that the work then does not have:

| Task | Read |
| --- | --- |
| Applying the system (a component, spacing, a state, a color from tokens) | `strategy.rules` and `narrative.donts` in `design.json`. The impeccable hook checks the rest after each edit. |
| Changing the system (a token, the radius scale, a palette, the type ramp) | `DESIGN.md` in full, then update the sidecar. |
| Judging whether something is off | Let the hook speak first; open `DESIGN.md` for the section it names. |

Single sources: accents in `src/utils/accents.ts`, palettes in
`src/styles/palettes/*.css`, tokens in `src/styles/tailwind.css`. No literal
hex and no raw Tailwind palettes — semantic tokens only. What every surface has
to survive is in **Surfaces** above.

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
Эти три бана проверяет машина, а не память: `.agents/hooks/posts_style_check.py`
висит на PostToolUse у обоих агентов и после каждой правки в `src/data/posts`
возвращает найденные нарушения с номерами строк. Правку он не отменяет —
поэтому чинить их надо до того, как отчитываешься о готовности.

## Validation

- Do not run full builds by default.
- Prefer targeted checks such as `bunx astro check`, focused type checks, or parsing the files touched when useful.
- Run `bun run build` only when the change affects routing, Astro config, integrations, or site-wide data behavior.

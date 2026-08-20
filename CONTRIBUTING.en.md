# Contributing Guide

Thanks for your interest in `tatarverse.cc` — an open catalog of Tatar,
Bashkir, Tatar-Bashkir, and Crimean Tatar centers and communities.

The most valuable contribution is **verified data**: a new center, updated
contacts, an English translation, a source link. That kind of contribution
requires **no programming experience** and nothing installed on your machine.

## Contents

- [Pick your path](#pick-your-path)
- [For newcomers: editing on the GitHub website](#for-newcomers-editing-on-the-github-website)
- [For experienced contributors: fork and local setup](#for-experienced-contributors-fork-and-local-setup)
- [Branches and keeping your fork in sync](#branches-and-keeping-your-fork-in-sync)
- [Commit messages](#commit-messages)
- [Opening a pull request](#opening-a-pull-request)
- [General rules](#general-rules)
- [Where center data lives](#where-center-data-lives)
- [Adding a new center](#adding-a-new-center)
- [Updating existing information](#updating-existing-information)
- [Center field schema](#center-field-schema)
- [Categories and types](#categories-and-types)
- [Other content collections](#other-content-collections)
- [UI translations](#ui-translations)
- [Validation before opening a PR](#validation-before-opening-a-pr)
- [Review and what happens next](#review-and-what-happens-next)
- [Troubleshooting](#troubleshooting)
- [Licensing](#licensing)

## Pick your path

| What you want to do | Recommended path |
| --- | --- |
| Fix a typo, link, or city; add one center | [Edit on the GitHub website](#for-newcomers-editing-on-the-github-website) |
| Add several centers, translations, UI or code changes | [Fork and local setup](#for-experienced-contributors-fork-and-local-setup) |
| Just report a data problem | Open an [issue](https://github.com/proxima812/tatarverse/issues/new) — no code needed |

Not sure the data is accurate? Open an issue with the source link anyway —
that already helps.

## For newcomers: editing on the GitHub website

This path works entirely in the browser. No Git, terminal, or Node.js
required — only a free [github.com](https://github.com) account.

### Step 1. Find the file

Center entries live in
[`src/data/centers_formatted/`](https://github.com/proxima812/tatarverse/tree/main/src/data/centers_formatted).
One file is one center, for example `tbk-389.mdx`.

To find a center faster: open the folder on GitHub and press `t` to start the
file finder. If you only know the center's name, search the repository — enter
the name in GitHub's search box and add `path:src/data`.

### Step 2. Click the pencil

In the top-right corner of the file, click the pencil icon
(**Edit this file**). GitHub automatically creates your fork — a copy of the
repository under your account. Nothing else to set up.

### Step 3. Make your edit

Edit the text directly in the browser. Follow the
[general rules](#general-rules) and the [field schema](#center-field-schema).

The **Preview** tab shows how the Markdown will render.

### Step 4. Describe the change

Click **Commit changes**. In the dialog:

- Put a short summary on the first line, e.g.
  `fix(centers): update Instagram link for Karaganda center`.
- In the description, add a **source link** — this is required for factual
  changes.
- Leave **Create a new branch for this commit and start a pull request**
  selected.

### Step 5. Open the pull request

Click **Propose changes**, then **Create pull request**. Done — see
[Review and what happens next](#review-and-what-happens-next).

If review asks for changes, open the file on your branch (GitHub links it from
the PR) and click the pencil again — new commits are added to the same pull
request automatically.

## For experienced contributors: fork and local setup

### Requirements

- **Bun** 1.3 or newer — the project's package manager
  ([install](https://bun.sh/docs/installation)).
- **Node.js** 20 or newer — used by the release script and Wrangler.
- **Git**.

The project runs on Astro 7 (static output), MDX content collections,
Tailwind CSS v4, and deploys to Cloudflare Pages.

### Step 1. Fork

Open the [repository](https://github.com/proxima812/tatarverse) and click
**Fork** in the top-right corner. This creates a copy under your account.

With the [GitHub CLI](https://cli.github.com), the same thing in one command —
including the clone and the `upstream` remote:

```bash
gh repo fork proxima812/tatarverse --clone
cd tatarverse
```

### Step 2. Clone and add upstream

If you forked through the web UI, clone your fork and add the original
repository as `upstream` — you need it to pull in later changes:

```bash
git clone https://github.com/<your-username>/tatarverse.git
cd tatarverse
git remote add upstream https://github.com/proxima812/tatarverse.git
git remote -v
```

Now `origin` is your fork (you push there) and `upstream` is the original
repository (you pull from there).

### Step 3. Install and run

```bash
bun install
bun run dev
```

The site starts at `http://localhost:4321`.

You do **not** need a `.env` file to work on content, layout, or translations.
It is only required for the server-side submission functions (Telegram bot and
Supabase) and holds secrets that are not in the repository. Locally the
submission forms simply will not send — that is expected and does not block
anything else.

### Step 4. Create a branch

Do not work on your fork's `main` — a topic branch keeps syncing simple and
lets you run several changes in parallel:

```bash
git switch -c centers/karaganda-instagram
```

Useful prefixes: `centers/`, `i18n/`, `ui/`, `docs/`, `fix/`.

### Step 5. Edit and validate

Make your changes, then run the [validation steps](#validation-before-opening-a-pr).

### Step 6. Commit and push

```bash
git add src/data/centers_formatted/tbk-389.mdx
git commit -m "fix(centers): update Instagram link for Karaganda center"
git push -u origin centers/karaganda-instagram
```

The `git push` output includes a link to open the pull request.

> **About the `pre-push` hook.** The repository contains
> `.githooks/pre-push`, which auto-bumps the release version. It is intended
> for maintainers and **should not be enabled in a fork** — it is inactive by
> default. If you previously set `core.hooksPath` and it blocks your push, use
> `RELEASE_BUMP_SKIP=1 git push`. Do not bump the version in `package.json` in
> your PR; the maintainer handles releases.

## Branches and keeping your fork in sync

Before starting new work, pull the latest `main` so you avoid needless
conflicts:

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

If your branch fell behind `main` during review:

```bash
git switch centers/karaganda-instagram
git fetch upstream
git rebase upstream/main
git push --force-with-lease
```

`--force-with-lease` is safer than plain `--force`: it refuses to overwrite
commits someone else pushed to the branch.

## Commit messages

The project follows [Conventional Commits](https://www.conventionalcommits.org/):

```txt
<type>(<scope>): <short summary>
```

Types used here: `feat`, `fix`, `docs`, `refactor`, `style`, `chore`.
Common scopes: `centers`, `i18n`, `ui`, `projects`.

```txt
feat(centers): add center in Aktobe
fix(i18n): correct English label for category filter
docs(contributing): add fork instructions
```

The summary may be written in English or Russian. Keep the type and scope in
Latin characters.

## Opening a pull request

1. On your fork's page, or from the `git push` output, click
   **Compare & pull request**.
2. Confirm the base is `proxima812/tatarverse`, branch `main`, with your
   branch on the right.
3. Use the commit format for the title (see above).
4. In the description, state:
   - **what** changed and **why**;
   - a **source link** for every factual change;
   - the issue number if the PR closes one, as `Closes #12`.
5. One PR, one topic. A new center, a data fix, a translation, and a UI change
   belong in separate PRs — they are easier to review and to revert.

Still work in progress? Open it as a **Draft pull request**.

## General rules

- Keep one pull request focused on one topic: a new center, a data update, a
  translation, or a small fix.
- Do not reformat or edit neighboring files without a direct reason.
- For factual changes, include a source: website, social profile, official
  post, organization page, or another verifiable link.
- If data is unknown, omit the field. Do not add placeholders like `unknown`,
  `n/a`, or `-`.
- Keep the tone neutral: no advertising, claims, or unsupported wording.
- Preserve stable `tbk-*` file names. They act as public slugs, and renaming
  them breaks inbound links and SEO.
- Never commit `dist/`, `.astro/`, `node_modules/`, or `.env` — they are in
  `.gitignore`.
- Do not add dependencies without discussing it in an issue first.

### On personal data

Publish only **public** organizational contacts: website, social profiles,
work email, a center's public phone number. Do not add personal phone numbers,
home addresses, or private contact details, even if you know them. A leader's
name is fine when it is already published officially.

## Where center data lives

Russian source entries:

```txt
src/data/centers_formatted/
```

English center translations:

```txt
src/data/centers_i18n/en/
```

File names must match across languages:

```txt
src/data/centers_formatted/tbk-366.mdx
src/data/centers_i18n/en/tbk-366.mdx
```

Russian is the source version. When you update it, check whether the English
translation needs the same factual update. An English translation is not
required for a new center but is welcome — not every entry is translated yet.

Both directories are read by the `centers` and `centersEn` collection glob
loaders in [`src/content.config.ts`](./src/content.config.ts).

## Adding a new center

1. Find the next available `tbk-*` number:

   ```bash
   ls src/data/centers_formatted | sort -V | tail -1
   ```

   In the web UI, just open the folder — files are sorted.

2. Create an `.mdx` file with that number in `src/data/centers_formatted/`.
3. Fill the frontmatter per the [schema](#center-field-schema).
4. Add MDX content below the frontmatter: description, links, details — only
   what your sources support.
5. When possible, add the matching English file in `src/data/centers_i18n/en/`
   under the same file name.

Minimal example:

```mdx
---
title: Center name
type: Зарубежный
category: Татарский
source: https://example.com/
location:
  country: Kazakhstan
  region: Karaganda Region
  city: Karaganda
---

# Center name

## Links

- [Official website](https://example.com/)

## Details

- Short, verified facts

## About

Neutral description with verifiable information.

## Sources

- [Source name](https://example.com/)
```

Heading structure inside an entry is flexible, but stick to the established
order — `Contacts`, `Links`, `Details`, `About`, `Sources` — so entries read
consistently.

## Updating existing information

- Change only the fields and text that are outdated or incorrect.
- Do not rename the `tbk-*` file.
- Do not remove information without a reason; replace outdated data with
  verified data.
- When editing `title`, `summary`, `location`, `source`, `type`, or
  `category`, make sure the source supports the change.
- Keep the same factual meaning between source and translated files.
- Did a center close? Do not delete the file silently — open an issue or
  explain it in the PR with a link to confirmation; the maintainer decides.

## Center field schema

The schema is defined with Zod in
[`src/content.config.ts`](./src/content.config.ts) and marked `.strict()`:
**an unknown frontmatter field breaks the build**.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Non-empty |
| `type` | enum | no | See [types](#categories-and-types) |
| `category` | enum | no | See [categories](#categories-and-types) |
| `source` | URL | no | Must be a valid URL |
| `summary` | string | no | Short description |
| `pubDate` | string | no | Date |
| `location` | object | no | See below |

`location` fields (all optional; the object is `.strict()` too):

- `country`
- `region`
- `city`
- `flag`

## Categories and types

Centers have no separate `tags` field. Grouping is handled by `category` and
`type`, both defined as Zod enums.

Allowed `category` values:

- `Татарский`
- `Татаро-Башкирский`
- `Башкирский`
- `Крымотатарский`

Allowed `type` values:

- `Регион РФ`
- `Зарубежный`
- `Онлайн`

These values are stored **in Russian in both locales** — English entries use
the Cyrillic values too, and translation happens in the UI layer. Do not
translate them in frontmatter.

Do not add new categories or types directly in MDX. If a new value is needed,
discuss it in an issue first: it changes the schema and the filter logic in
the UI.

## Other content collections

Besides centers, `src/data/` holds collections with their own schemas
(all `.strict()`, see `src/content.config.ts`):

- `posts/` — editorial posts. `title`, `description`, `pubDate`, `author`, and
  `category` are required; `tags` is an array and `ogImage` is optional.
- `projects/` — projects and businesses. `title`, `description`, and
  `category` are required, with `category` one of `Общепит`, `Бизнес`,
  `Медиа`, `Образование`.
- `thanks/` — credits. All fields optional: `name`, `instagram`, `telegram`,
  `social`, `sortOrder`.

The rules on sources, neutral tone, and privacy apply to these as well.

## UI translations

UI strings live in [`src/i18n/locales/ru.ts`](./src/i18n/locales/ru.ts) and
[`src/i18n/locales/en.ts`](./src/i18n/locales/en.ts). They are flat
`Record<string, string>` dictionaries with dot-separated keys.

When adding a UI label:

1. Add the **same key** to both files. If a key is missing from `en`,
   `useTranslations` falls back to the Russian string and the page shows mixed
   languages.
2. Use an existing namespace: `nav.*`, `list.*`, `detail.*`, `copy.*`,
   `feedback.*`, `menu.*`.
3. In components, use `useTranslations(locale)` and `t("key.name")`.
4. Do not leave hardcoded user-facing text in components.

Interpolation uses `{token}`:

```ts
"list.found": "Found {count} centers",
```

```astro
{t("list.found", { count: centers.length })}
```

Locales and helpers (`localizePath`, `getSwitcherHref`, `defaultLocale`) live
in [`src/i18n/index.ts`](./src/i18n/index.ts). Russian is the default locale
and is served without a prefix; English is served under `/en/`. Build internal
links with `localizePath(locale, href)` rather than assembling paths by hand.

## Validation before opening a PR

For ordinary content edits, re-read the changed `.mdx` files carefully. If
schema, frontmatter, routes, or locale logic changed:

```bash
bunx astro sync    # validates frontmatter against the collection schemas
```

This is the quick way to catch schema violations — they are the most common
cause of a broken build.

Run a full build when the change affects routing, Astro config, integrations,
or site-wide data behavior:

```bash
bun run build      # full static build
bun run preview    # inspect the built site
```

Pre-submit checklist:

- [ ] `.mdx` passes `bunx astro sync` with no schema errors;
- [ ] no unknown frontmatter fields;
- [ ] factual changes include a source link;
- [ ] `tbk-*` file names unchanged;
- [ ] new UI keys added to `ru.ts` **and** `en.ts`;
- [ ] the diff contains no `dist/`, `.astro/`, `node_modules/`, `.env`, or a
      version bump in `package.json`;
- [ ] the PR covers a single topic.

## Review and what happens next

The project is maintained by one person, so a reply may take a few days —
that is normal, and a nudge in the PR comments is welcome.

Review looks at: whether the source is verifiable, schema compliance, neutral
wording, slug stability, and how narrow the diff is.

Once merged, the change reaches `tatarverse.cc` on the next Cloudflare Pages
deploy. Release versioning and deployment are handled by the maintainer.

## Troubleshooting

**The build fails with a collection schema error.** Most likely the
frontmatter has a field that is not in the schema, or a `category`/`type`
value outside the enum. The schema is `.strict()` — check it against the
[field table](#center-field-schema).

**`source` fails validation.** It needs a full URL including the scheme:
`https://example.com/`, not `example.com`.

**Russian text shows up on an English page.** The key exists in `ru.ts` but is
missing from `en.ts`, so the default-locale fallback kicked in.

**`bun install` fails.** Check your Bun version (`bun -v`, needs 1.3+).
As a last resort, delete `node_modules` and reinstall.

**`git push` is rejected with a message about a release commit.** The
`pre-push` hook is active. It is not needed in a fork:
`RELEASE_BUMP_SKIP=1 git push`.

**Your PR conflicts with `main`.** See
[keeping your fork in sync](#branches-and-keeping-your-fork-in-sync).

## Licensing

By submitting a pull request you agree that your contribution is published
under the project's licenses:

- code — [MIT](./LICENSE);
- content, center data, translations, and documentation —
  [CC BY 4.0](./CONTENT-LICENSE.md).

The `tatarverse.cc` name, logos, brand assets, and recognizable site design
are **not** covered by these licenses and may not be reused without written
permission.

Do not copy copyrighted text into the project. Restate facts in your own words
and link to the source.

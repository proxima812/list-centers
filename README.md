# tatarverse.cc

Static multilingual Astro catalog of Tatar, Bashkir, Tatar-Bashkir, and Crimean Tatar communities, centers, sources, translations, and reference materials.

## Status

The project is prepared for focused open-source contributions. The most useful changes are verified center-data updates, English translations, source references, accessibility fixes, and small UI improvements that preserve the existing visual language.

Current public locale surface:

- `ru` - default source routes and source center entries.
- `en` - localized routes and translated center entries.

## Stack

- Astro 7 static output.
- MDX content collections.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- Bun as the preferred package manager.
- Cloudflare Pages deployment through Wrangler.

## Project Structure

```txt
src/
  components/          Astro UI components
  data/centers_formatted/
                       Russian source MDX files for center pages
  data/centers_i18n/en/
                       English center translations
  data/posts/          editorial posts
  i18n/locales/        UI translation dictionaries
  layouts/             page layouts
  pages/               Astro pages and localized routes
  styles/tailwind.css  Tailwind v4 theme tokens and global utilities
```

## Commands

```bash
bun install
bun run dev
bun run build
bun run preview
```

Cloudflare helpers:

```bash
bun run cf:preview
bun run cf:deploy
```

## Contributing

Keep contributions focused and easy to review. Use the guide in the language most convenient for you:

- [Русский](./CONTRIBUTING.ru.md)
- [English](./CONTRIBUTING.en.md)

## Translations

UI dictionaries live in `src/i18n/locales`. Center translations live in `src/data/centers_i18n/en`.

When adding a UI string:

1. Add the same key to every active locale file.
2. Use an existing key namespace such as `nav.*`, `list.*`, `detail.*`, `copy.*`, or `feedback.*`.
3. In components, use `useTranslations(locale)` and `t("key.name")`.
4. Do not leave hardcoded user-facing text in components.

## Content And SEO

- Preserve stable `tbk-*` slugs.
- Preserve canonical route behavior and localized links.
- Keep headings meaningful and structured.
- Preserve source links and factual intent.
- Avoid broad MDX formatting churn.
- Be careful with metadata, robots behavior, structured data, and visible page titles.

## Additional Docs

- [Product notes](./PRODUCT.md)
- [Design system](./DESIGN.md)
- [Content license](./CONTENT-LICENSE.md) ([Русский](./CONTENT-LICENSE.ru.md))
- [UI/UX review archive](./UI-UX-REVIEW.md)
- [UI/UX plan archive](./plan-ui-ux.md)

## License

This repository uses separate licenses for code and content:

- Code is licensed under the [MIT License](./LICENSE).
- Content, center data, translations, and documentation are licensed under [CC BY 4.0](./CONTENT-LICENSE.md), unless otherwise noted.
- The `tatarverse.cc` name, logos, brand assets, visual identity, and recognizable site design are not licensed for reuse without written permission.

## Current Issues

<!-- open-issues:start -->
- No open issues.
<!-- open-issues:end -->

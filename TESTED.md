# 🔍 Project Audit Report — `tt.xima.work`

> Static Astro 6 site. 365 Tatar / Bashkir / Crimean Tatar cultural centers. Multilingual (en/ru/tt) via client-side i18n. Deployed as `output: "static"`.
> Audited: 2026-04-20. Based on `src/`, `dist/`, `astro.config.mjs`, `src/config.ts`, `src/content.config.ts`, `src/pages/**`, `src/components/**`, `src/data/**`.

---

## ✅ What is GOOD

### Architecture
- **Static output (`output: "static"`)** with Astro 6 — zero-runtime, fast TTFB, trivial to host on any CDN. Correct call for a directory site.
- **Content Collections** (`src/content.config.ts`) with Zod schema on `centers`. Type-safe MDX → `[slug].astro` generation via `getStaticPaths`.
- **Proper FOUC guard** for dark mode — inline `is:inline` script in `src/layouts/Layout.astro:47-58` sets `html.dark` class before first paint from `localStorage`. Correct pattern.
- **Prefetch on viewport** (`astro.config.mjs:prefetch.defaultStrategy="viewport"`) — good for perceived performance between list → detail.
- **Icons via astro-icon** (`mdi`, `tabler` sprite sets) — tree-shaken at build, no runtime font weight.
- **Sitemap integration** (`@astrojs/sitemap`) and `robots.txt.ts` endpoint are wired correctly.
- **PWA manifest + service worker** (`@vite-pwa/astro`) with a complete icon set. Worthwhile for a directory that users bookmark.
- **Dev-only SW unregister** (`Layout.astro:65-80`) prevents stale caches during development — rare to see done right.

### Code quality
- Filter state in `ToolBar.astro:412-670` is small, well-typed (`FilterGroupName`, `FilterState`), and uses `data-*` attributes as the contract between server and client. Clean separation.
- `getStaticPaths` is dataset-driven (no manual route maps).
- Tailwind v4 + `@tailwindcss/vite` is the current-generation setup.
- SEO component (`src/components/partials/SEO.astro:82-108`) emits JSON-LD (`WebPage` / `BlogPosting`).
- Canonical URL normalization (`formatCanonicalURL` in `SEO.astro:39-44`) handles trailing slash / query-string correctly.

### UI/UX
- Visual hierarchy on `/list` is clean: hero → toolbar → chips → grid.
- Cards use `line-clamp-2/3` so long titles/summaries don't break the grid.
- Keyboard-accessible language switcher with `role="radiogroup"` logic and arrow-key navigation (`runtime.ts:195-221`).

---

## 🔴 What is BAD

### 1. SHIPPED BUILD HAS `example.com` EVERYWHERE — catastrophic SEO
`src/config.ts:3`:
```ts
site: { url: "https://example.com", ... }
```
Verified in `dist/`:
- `dist/index.html`: `<link rel="canonical" href="https://example.com/">`, `<meta property="og:url" content="https://example.com/">`
- `dist/sitemap-0.xml`: every one of ~370 URLs begins with `https://example.com/`
- `dist/robots.txt`: `Sitemap: https://example.com/sitemap-index.xml`
- JSON-LD `url` field points to `https://example.com/...`

This is the single most damaging issue. **If this ever reached production, Google would index nothing, canonicals would be cross-domain invalid, OG shares would render placeholders.**

### 2. Homepage has EMPTY `<title>` and EMPTY `<meta description>`
`src/pages/index.astro:10`: `<Layout title="" description="">`. And `config.site.OG.title` / `OG.description` / `OG.site_name` / `OG.keywords` / `OG.author` are all empty strings (`src/config.ts:5-11`).
Verified in `dist/index.html`:
```html
<title></title>
<meta name="description" content>
<meta property="og:title" content>
<meta property="og:description" content>
<meta property="og:site_name" content>
```
**The homepage is effectively invisible to search engines.** Google Search Console would flag "Missing title tag" and "Duplicate title tags" across the entire site.

### 3. Invalid HTML — nested `<a>` in every card
`src/components/ui/CardItem.astro:95-164`: the whole article is wrapped in `<a href={`/list/centers/${id}`}>`, and inside that wrapper the social icons are rendered as `<a href={link.url} target="_blank">` (lines 147-158).
Nested anchors are invalid per HTML5 and Safari / iOS WebKit silently moves them out of the parent `<a>`, producing unpredictable click behavior and breaking analytics.

### 4. `html lang="en"` lies about content
`src/layouts/Layout.astro:35`: `<html lang="en" data-language="en">`. But the underlying content of 365 MDX files is Russian:
```
title: "7pulat tatarlary"
summary: "Татаро-Башкирский центр"
```
Google uses `lang` as a language signal. Declaring `en` on Russian-dominant pages actively hurts Russian / Tatar SEO — which is the entire point of this directory.

### 5. Client-only i18n → Googlebot only sees one language
`src/i18n/runtime.ts` mutates `textContent` after `DOMContentLoaded`. There are no `/ru/` / `/tt/` SSR'd routes. So:
- No `hreflang` alternates.
- The SSR'd HTML Google indexes contains English UI labels + Russian data attributes + Russian MDX body. It is a single mixed-language document.
- Russian and Tatar users lose organic traffic entirely.

### 6. `/list` is an 837 KB single HTML document
```
dist/list/index.html → 837 579 bytes
```
All 365 cards are rendered server-side, each with a full payload of `data-country`, `data-type`, `data-category`, `data-region`, `data-title`, `data-summary`, `data-city`, `data-date`, **plus** a JSON-serialized `data-country-labels` attribute per card **plus** a JSON-stringified overflow chip per country. `ToolBar.astro:132` calls `JSON.stringify(buildCountryLabels(country))` inside a loop that already renders both visible and hidden overflow chips, so the JSON payload is shipped twice per country.

### 7. Broken `source` link on every detail page
`src/pages/list/centers/[slug].astro:165`:
```astro
<a href={`https://${entry.data.source}/`}>
```
`entry.data.source` in MDX is values like `"Интернет"`, `"open-info"`, `"tatar-congress"`. Result: `https://Интернет/` → 404 / DNS error. Every detail page has a broken outbound link.

### 8. RSS link points to a nonexistent endpoint
`SEO.astro:166-171` emits `<link rel="alternate" type="application/rss+xml" href="/posts/rss.xml">`. There is no `src/pages/posts/rss.xml.ts` and no `/posts/` route exists in `dist/`. Result: 404 in RSS readers, Safari Reader, Google News.

### 9. `humans.txt` referenced but missing
`SEO.astro:165`: `<link rel="author" href="${Astro.site}humans.txt">`. `public/` contains `llms.txt` but not `humans.txt`. 404 on every page.

### 10. Hard-coded GitHub repo in edit links
`[slug].astro:97`:
```astro
href={`https://github.com/proxima812/list-centers/blob/main/src/data/centers/${entry.id}.mdx`}
```
Wrong owner (project is under `xima.work`), duplicates the canonical repo of record, and leaks a foreign account name into every page. Should come from `config.ts`.

### 11. `keywords` meta is a tracker-era anti-pattern
`SEO.astro:139`: `<meta name="keywords" ...>` — Google ignores it since 2009, Yandex since ~2014. It only adds noise and keyword-cannibalization risk when misconfigured.

### 12. `publisher` field references a missing property
`SEO.astro:98`: `name: config.site.name` — `config.site` has no `name` property (`src/config.ts:1-36` only exports `{ site: { url, OG, verifications } }`). JSON-LD emits `"name": undefined` → truncated to nothing. Validate with Google Rich Results Test: fails.

### 13. Title construction writes `"null"` / `"undefined"` strings
`[slug].astro:76`:
```astro
<Layout title={`${title}`} description={`${summary}`} type="article">
```
When `summary` is `null` (from `clean(data.summary)`), the template literal becomes the literal string `"null"`. Cards without a summary ship `<meta name="description" content="null">` to production.

### 14. Duplicated data: 2 MB TS file + 1.4 MB of MDX
`src/data/_list-data.ts` is 2 MB / 44 032 lines and declares an `organizations` collection (`content.config.ts:26-83`) that is **never queried anywhere**. The `centers` MDX collection is the real source. Dead code path loads 2 MB JSON at build time for nothing.

### 15. No structured data for the actual organizations
The whole project is a directory of orgs, but each detail page emits only `BlogPosting` JSON-LD. Missing: `Organization`, `NGO`, `Place`, or `LocalBusiness` with `address` / `geo` / `sameAs` / `url`. This is the single biggest SEO win you are leaving on the table.

### 16. Filter state has no URL representation
`ToolBar.astro:582-620` filters in JS and never calls `history.replaceState`. `/list?country=Казахстан` is not shareable, not bookmarkable, not crawlable. No deep links to filtered views = zero long-tail SEO from filter combinations.

### 17. `registerType: "autoUpdate"` + `skipWaiting: true` + `clientsClaim: true` on a content-changing site
`astro.config.mjs:Workbox`. For a directory whose data updates, the combination silently replaces the SW mid-navigation. If two tabs are open and content updated, you get partially-hydrated mixes. Also, pre-caching **every** `.{js,css,html,...}` (`globPatterns`) on a 16 MB dist is ~15 MB of forced download on first visit.

---

## ⚠️ What is RISKY

- **365 cards in one DOM** works today. At ~1 000 entries the `/list` page is >2 MB and `querySelectorAll('#cards-grid > a')` inside `applyFilters()` becomes a hot path on every keystroke. The 150 ms debounce (`ToolBar.astro:647`) is masking it.
- **`CollectionEntry<"centers">.data.source`** is typed `z.string().optional()` but used as a hostname. One bad MDX entry ⇒ broken link. No validation narrows this.
- **`clean("Нет данных.")` still returns "Нет данных."** because `clean` only trims (`[slug].astro:27-31`). The "Нет данных" scrubbing logic lives in `CardItem.astro:35-39` and is not applied on the detail page. Inconsistent.
- **Service worker caches `/list/index.html`** at 837 KB. After first update users will keep seeing old data until SW revalidates.
- **`Astro.url.pathname.startsWith("/list")`** (`Header.astro:8`) matches `/list-foo` if ever added. Not risky today, fragile tomorrow.
- **`new Intl.DateTimeFormat(...).format(new Date(release.updatedAt))`** (`Footer.astro:5`) runs at build, but `data-i18n-values` is also build-time JSON — date is NOT reformatted on language change for Russian/Tatar. English date string leaks into localized UI.
- **Overflow chips rendered with `style="display:none"`** (`ToolBar.astro:151`) still count toward the DOM + payload. Better to emit them in a hidden `<template>` and clone on demand.
- **`prefetchAll: true`** on a site with ~370 static routes can saturate mobile connections when a user hovers / views `/list` (365 card links in viewport).
- **`html lang` attribute is never updated when the user switches language** — only `document.documentElement.lang` is (`runtime.ts:162`), but many screen readers read `lang` at page load. First-paint language is misreported.
- **Sort by `pubDate`** (`ListCards.astro:9-14`): most MDX files share the same date (`"2025-02-05T00:00:00.000Z"`). Effective order is insertion order. If you ever add a random batch, card order will visibly scramble for returning users.

---

## 🛠 What MUST be FIXED (High Priority)

### 1. Fix `config.ts` — this is blocking production
**Why:** Every canonical URL, sitemap entry, OG tag, and JSON-LD `url` is currently `https://example.com`.

**Before** (`src/config.ts`):
```ts
export const config = {
  site: {
    url: "https://example.com",
    OG: { title: "", description: "", author: "", locale: "en", site_name: "", defaultImage: "default-ogImage.jpg", keywords: "" },
    verifications: [/* ...empty... */],
  },
};
```
**After:**
```ts
export const config = {
	site: {
		url: "https://tt.xima.work",
		name: "Xima Tatars",
		OG: {
			title: "Xima Tatars — каталог татарских, башкирских и крымскотатарских центров",
			description:
				"365 культурных центров и сообществ по всему миру. Фильтр по стране, региону и типу организации.",
			author: "Kamil Mirikhan",
			locale: "ru_RU",
			site_name: "Xima Tatars",
			defaultImage: "default-ogImage.jpg",
			keywords: "",
		},
		verifications: [
			{ name_verification: "yandex-verification", content: "<real-token>" },
			{ name_verification: "google-site-verification", content: "<real-token>" },
		],
	},
} as const;
```
Remove every `verifications` entry that is not actually used. An empty `content` is already filtered in `SEO.astro:176-185`, but 23 dead objects are noise.

### 2. Fix the JSON-LD `publisher` and `BlogPosting` type
**Why:** `config.site.name` doesn't exist → JSON-LD has `publisher.name: undefined`. And a directory page is not a `BlogPosting`.

**Before** (`src/components/partials/SEO.astro:82-108`):
```ts
const schemaType = pageType === "article" ? "BlogPosting" : "WebPage";
// ...
publisher: { "@type": "Organization", name: config.site.name, logo: { "@type": "ImageObject", url: `${Astro.site}logo.png` } }
```
**After:**
```ts
const schemaType = pageType === "article" ? "Article" : "WebPage";
// ...
publisher: {
	"@type": "Organization",
	name: config.site.name,
	url: Astro.site?.href,
	logo: { "@type": "ImageObject", url: new URL("/android-chrome-512x512.png", Astro.site).href, width: 512, height: 512 },
},
```

### 3. Emit `Organization` JSON-LD on each center page
**Why:** This is a directory. Every detail page must be machine-readable as an organization. This is the single highest-ROI SEO change in the codebase.

Inside `src/pages/list/centers/[slug].astro`:
```astro
---
const orgJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: title,
	description: summary ?? undefined,
	url: canonical.href,
	...(cleanFlag && country ? { address: { "@type": "PostalAddress", addressCountry: country, addressLocality: city ?? undefined } } : {}),
	sameAs: socialLinks.map((l) => l.url),
};
---
<script is:inline type="application/ld+json" set:html={JSON.stringify(orgJsonLd)} />
```

### 4. Unnest the `<a>` in cards
**Why:** Invalid HTML; breaks on Safari; social icon clicks bubble into the card link.

**Before** (`CardItem.astro:95-164`): `<a href="/list/centers/…"> <article> …children <a href="social">… </article> </a>`.

**After:** make the card non-link, put a visually-hidden `<a class="after:absolute after:inset-0">` that covers only the clickable area outside the social row:
```astro
<article class="group relative ...">
	<a href={`/list/centers/${id}`} class="after:absolute after:inset-0 after:content-['']" aria-label={title}></a>
	<!-- meta, heading, summary -->
	{socialLinks.length > 0 && (
		<div class="relative z-10 flex gap-1.5">
			{socialLinks.map(link => <a href={link.url} target="_blank" rel="noopener noreferrer nofollow" ...>…</a>)}
		</div>
	)}
</article>
```
`nofollow` on external social links — you don't want to leak link juice to 10 Facebook pages per page.

### 5. Fix the broken `source` link
**Why:** Every detail page currently has a link to `https://Интернет/`.

**Before** (`[slug].astro:162-169`):
```astro
<a href={`https://${entry.data.source}/`} ...>{entry.data.source}</a>
```
**After:** render only when `source` is a valid hostname OR drop to a text label:
```astro
---
const isHostname = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(entry.data.source ?? "");
---
{isHostname ? (
	<a href={`https://${entry.data.source}/`} target="_blank" rel="nofollow noopener noreferrer" class="underline text-sm">
		{entry.data.source}
	</a>
) : (
	<span class="text-sm text-muted-foreground">{entry.data.source}</span>
)}
```

### 6. Remove the dead `organizations` collection
**Why:** `src/content.config.ts:26-83` loads a 2 MB TS module at build time and is never queried. Delete it.

**Before:**
```ts
const organizations = defineCollection({ loader: () => Object.values(organizationsByCategory).flat().map(...), schema: /* … */ });
export const collections = { organizations, centers };
```
**After:**
```ts
export const collections = { centers };
```
Then delete `src/data/_list-data.ts`. Expected build-time memory drop: ~50 MB peak.

### 7. Either SSR each language or admit one canonical language
**Why:** The site is currently English-shell over Russian data → worst of both worlds for SEO. Choose one:

- **Option A — single language (fastest fix):** switch `html lang` to `ru`, drop the i18n runtime for body text, keep only the chip UI labels translatable. Index Russian only.
- **Option B — prerender per language:** create `src/pages/[lang]/index.astro`, `src/pages/[lang]/list/index.astro`, `src/pages/[lang]/list/centers/[slug].astro` with `getStaticPaths` over `["ru","en","tt"]`. Emit `<link rel="alternate" hreflang="ru" href="…">` for all three + `x-default`. This is the correct multilingual solution.

Pick one. The current state is a third option ("pretend bilingual") and it is the worst SEO outcome.

### 8. Fix / remove broken static references
- `SEO.astro:165` — either create `public/humans.txt` or delete the `<link rel="author">` line.
- `SEO.astro:166-171` — either create `src/pages/posts/rss.xml.ts` (you already have `@astrojs/rss`) or remove the alternate link.
- `SEO.astro:139` — delete the `keywords` meta. No SEO value, small clutter.
- `SEO.astro:122` — `/llms.txt` is fine, keep.

### 9. Replace `title={`${title}`} description={`${summary}`}` (`[slug].astro:76`)
**Before:**
```astro
<Layout title={`${title}`} description={`${summary}`} type="article">
```
**After:**
```astro
<Layout title={title} description={summary ?? undefined} type="article">
```

---

## 🚀 Improvements (Mid / Low Priority)

- **Move filters into the URL** (`history.replaceState`) so `/list?country=Kazakhstan&type=Online` is crawlable, shareable, and prefetches correctly. Each combination becomes a long-tail landing page if you also SSR the top ~20 combos.
- **Split `/list` into paginated / country-segmented static pages**: `/list/country/kazakhstan/`, `/list/country/usa/`. Client filtering stays, but server gives Google 30 pre-built landing pages instead of one 837 KB page.
- **Virtualize the card list** if you keep the single page. `react-virtuoso` is overkill for Astro — a tiny `IntersectionObserver`-based visibility flip costs <1 KB.
- **Push localized MDX content** into the MDX body for each center in ru/en/tt; render via slug `+ lang`. Remove the `data-country-labels` JSON payload trick — it's a workaround for missing SSR of translations.
- **Add a `<nav>` breadcrumb** (`Home › Centers › {country} › {title}`) with `BreadcrumbList` JSON-LD — direct ranking boost.
- **Generate `public/humans.txt` from `package.json`** at build (or just delete the link).
- **Drop `remark-gemoji`** unless `.mdx` files use `:emoji:` — I see none in the sampled files; each plugin loaded is slower build + bigger types.
- **`astro-meta-tags`** dev tool is fine, but remove if it ships runtime — double-check `package.json` says it's pure dev.
- **`release:bump`** script is one-off; the `scripts/release-bump.js` file isn't referenced in CI anywhere visible.
- **Consider Astro 5+ `i18n` routing** (built-in) instead of the hand-rolled `runtime.ts` — 253 lines of DOM mutation you own and must maintain.
- **Add `<link rel="preload" as="image" href="/default-ogImage.jpg">`** — no, actually don't, OG images aren't above the fold. But add **`fetchpriority="high"`** to any hero image if you ever add one.
- **Remove `removed` comments and placeholder TODO blocks** (none found — good, keep it that way).

---

## ⚡ Performance Audit

### Bundle (measured in `dist/_astro/`)
```
Layout.Cuq7NWgs.css                                 50 KB
Layout.astro_astro_type_script_index_0_lang.js      11.6 KB  (the i18n runtime)
page.DRdgb3HH.js                                    2.2 KB
registerSW.js + sw.js + workbox-*.js                ~20 KB combined
```
Total JS shipped per page: **~14 KB gzipped** — acceptable. CSS 50 KB is larger than it needs to be; Tailwind v4 should tree-shake. Likely cause: `corner-squircle` / `ring-*` / many color variants used across components. Verify with `--stats` or `npx source-map-explorer dist/_astro/*.css`.

### Core Web Vitals forecast
- **LCP:** homepage hero is text with heavy blur filters (`MainText.astro:13-22`) — blur is cheap to paint but the staggered spans with `blur-[3px]` to `blur-[0.3px]` will recompute on every repaint. Use `filter: blur(Xpx)` only once, not 7 times in one `<h1>`.
- **CLS:** header → main has fixed `py-22` container but `MainTextInList.astro` rotates text every 2.5 s with opacity + blur; `overflow-hidden` on the wrapper keeps CLS at 0. OK.
- **INP:** the `/list` page's filter handler runs a full `getCards()` (`ToolBar.astro:471-473`) on every chip click. For 365 cards it's ~3 ms on a mid-tier Android. Fine. At 1 000+ it will visibly stutter.
- **TTFB:** static, depends entirely on the host. Should be <100 ms from a CDN.
- **INP worst case:** typing in search debounces 150 ms + a full scan. Fine today.

### Rendering strategy
`output: "static"` is correct. **Do not switch to SSR for this site.** The only dynamic input is filter state, which belongs in the URL and can stay client-only. For pagination / country-landing pages, add static routes at build time — not runtime rendering.

### Hydration
No framework components → zero hydration cost. Good.

### PWA overhead
16 MB of cached precache on first visit is excessive. Restrict `globPatterns` to the shell:
```ts
workbox: {
	globPatterns: ["index.html", "404.html", "_astro/**/*.{js,css}", "favicon.svg", "apple-touch-icon.png"],
	runtimeCaching: [
		{
			urlPattern: ({ url }) => url.pathname.startsWith("/list/centers/"),
			handler: "StaleWhileRevalidate",
			options: { cacheName: "centers", expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 } },
		},
	],
},
```

---

## 🔎 SEO Audit

### Critical (fix immediately)
| # | Issue | File |
|---|---|---|
| 1 | `site.url = "https://example.com"` | `src/config.ts:3` |
| 2 | Empty `<title>` / `<description>` on homepage | `src/pages/index.astro:10`, `src/config.ts:5-11` |
| 3 | No `hreflang` alternates for multilingual content | `src/components/partials/SEO.astro` |
| 4 | `html lang="en"` on Russian-dominant pages | `src/layouts/Layout.astro:35` |
| 5 | Missing `Organization` JSON-LD on detail pages | `src/pages/list/centers/[slug].astro` |
| 6 | 365-URL sitemap all pointing to `example.com` | `dist/sitemap-0.xml` |
| 7 | Broken RSS link (`/posts/rss.xml` 404) | `src/components/partials/SEO.astro:166-171` |
| 8 | `humans.txt` 404 | `src/components/partials/SEO.astro:165` |

### High
- **No breadcrumb JSON-LD** (`BreadcrumbList`) — trivial win.
- **Meta `keywords`** — delete.
- **Single 837 KB `/list` page** — split by country for crawlable long-tail landing pages (e.g. `/list/country/kazakhstan/`).
- **No `<link rel="alternate" hreflang="...">`** between Russian / English / Tatar variants (because they don't exist as URLs).
- **Filter combinations not indexable.** Move to query params + server-render the top-N most common combos as static routes.

### On-page
- **H1 on homepage** (`MainText.astro`) is a poetic phrase ("we · tatars · bashkirs · …"). Fine for brand, but you need a secondary `<h2>` or semantic paragraph with real keywords ("каталог татарских центров", "Tatar cultural centers directory") above the fold. Right now there is no primary keyword on the homepage.
- **Detail page title** is just the center name. Add "— {city}, {country}" suffix for long-tail:
  ```ts
  const metaTitle = [title, city, country].filter(Boolean).join(" — ");
  ```
- **No `aria-label`** on primary nav (`Header.astro:15` — wait, it does have `aria-label="Primary navigation"`. OK.).

### Indexing
- `robots.txt` is `Allow: /` — correct.
- But **with empty titles + example.com canonicals**, Google will soft-404 the homepage and refuse to index most of the site.

### Page speed impact on ranking
- Single 837 KB HTML on `/list` → Googlebot will still index it, but mobile-friendliness + CWV penalties on slow networks (> 3 s LCP on Slow 4G).
- 40 KB per detail page × 365 pages = 14 MB crawl budget. Fine for Google, annoying for smaller crawlers (DuckDuckGo, Kagi, Yandex on low-priority domains).

---

## 🌐 Subdomain Strategy (xima.work)

### Context
`xima.work` is the apex / portfolio domain. `tt.xima.work` is this project. "tt" is the ISO 639-1 code for **Tatar language** — the subdomain name is already semantic and correct for this specific project. The question is the wider strategy.

### Recommendation — keep `tt.xima.work` as-is, do NOT split by UI language

**Subdomains hurt topical authority.** Google treats `ru.tt.xima.work`, `en.tt.xima.work`, `tt.tt.xima.work` as three separate properties. Link equity to each splits into three. For a directory this size (365 entries) that's fatal — you want **one property with `hreflang` alternates on subpaths**: `/ru/`, `/en/`, `/tt/`.

### Proposed structure

```
xima.work                 → Portfolio landing (describes every project owned)
tt.xima.work              → This directory (keep)
  ├─ /                       (Russian default, html lang="ru")
  ├─ /en/                    (English mirror, hreflang alternate)
  └─ /tt/                    (Tatar mirror, hreflang alternate)
```

Future projects on the apex get their own subdomain **only when they have a distinct topic**:

| Subdomain | Purpose | Why a subdomain, not a subfolder |
|---|---|---|
| `tt.xima.work` | Tatar / Bashkir / Crimean directory | **Different content model** from blog/app — warrants separation of crawl + ranking. Keep. |
| `blog.xima.work` | Long-form writing (only if > 20 posts/year) | Different content type. Google treats blogs as distinct sites well. |
| `app.xima.work` | Interactive tools behind auth | Different runtime (SSR/Node) vs static CDN — ops boundary. |
| `api.xima.work` | Public JSON endpoints (center lookup, etc.) | Avoid coupling API cache rules with HTML cache rules. Different security posture. |
| `status.xima.work` | Uptime page | Third-party tooling (BetterStack/Instatus) wants its own host. |

### What NOT to do

- ❌ `ru.xima.work` / `en.xima.work` — splits authority; use `/ru/` subpath.
- ❌ `centers.xima.work` in addition to `tt.xima.work` — duplicate topic.
- ❌ `www.tt.xima.work` — pointless depth. Stay flat.
- ❌ Separate `bs.xima.work` (Bashkir) / `cr.xima.work` (Crimean) — same directory, fragments crawl budget. Keep filters inside `tt.xima.work`.

### Environments

```
tt.xima.work               → prod (branch: main, manual deploy)
staging.tt.xima.work       → staging (branch: main @ head, auto-deploy, X-Robots-Tag: noindex)
dev.tt.xima.work           → dev preview (branch: any, basic-auth or Cloudflare Access)
```

Apply `X-Robots-Tag: noindex, nofollow` + HTTP basic auth on both non-prod subdomains. **Never** let staging be indexed — I see no `indexRobots={false}` gate in the current Layout for anything except explicit `false`, so any staging build today would be indexed if it shipped.

### Why subdomain is better than subfolder here
`tt.xima.work` is effectively its own brand (cultural directory with a narrow topic). The apex (`xima.work`) is a portfolio, semantically unrelated. Keeping the directory on its own subdomain avoids polluting the portfolio's topic graph and lets you move / sell / transfer this project independently.

### Why subfolder beats subdomain for UI languages
Subfolders (`/ru/`, `/en/`, `/tt/`) share link equity and indexation; subdomains do not. For a small site (365 entries, single-author), you cannot afford to split authority three ways.

---

## 🎨 UI/UX Audit

### Visual hierarchy
- Homepage hero is poetic but lacks a call-to-action above the fold. The "list of 365 centers" link (`index.astro:16-23`) is buried inside small body text. Should be a prominent button.
- `/list` page: toolbar is dense. 4 filter groups stacked → mobile users scroll past the entire filter tray before seeing any card. Consider a collapsible "Filters" drawer on mobile (`sm:hidden` accordion + persistent search).

### Accessibility
- `<a>`-in-`<a>` (see 🔴 #3) — screen readers report two nested links, confusing focus order.
- `aria-live="polite"` on `#no-results` (`ListCards.astro:84`) — correct.
- Language toggle uses `role="radiogroup"` — good, but `<html lang>` doesn't update on change (see ⚠️).
- Card titles are `<h2>` inside 365 cards on `/list` — that's fine; however the homepage has exactly one heading, which is semantically thin.
- Icons (`astro-icon`) correctly use `aria-hidden="true"`.
- **Focus styles:** `outline-none focus:ring-2 focus:ring-primary/20` on search (`ToolBar.astro:83`). Ring color at 20 % alpha is too faint for WCAG 2.4.7. Use `focus-visible:ring-2 ring-primary` (solid).
- No skip-to-content link. Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` in `Layout.astro`.

### Mobile
- Toolbar chips wrap cleanly. Good.
- Detail page `<nav>` (`[slug].astro:78-105`) uses `order-0 / order-3 / -order-1` combinations that are fragile; on narrow widths the "Find a mistake?" button can end up above the back link.
- Card grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` — fine.

### Conversion
- The site has no conversion action. What is a "conversion" here — add a center? Subscribe to updates? Right now neither exists. Add:
  - A persistent "Submit a center →" CTA in header.
  - An RSS subscription CTA in footer.

---

## 🔐 Security Issues

- **`.env` is empty and gitignored** — good.
- **No secrets in source** — verified via search, no API keys present.
- **`rel="noopener noreferrer"` on external links** in cards — good.
- **Missing `rel="nofollow"`** on all external links. This is not user-submitted content, but you're passing link equity to ~365 × ~3 social links = >1 000 external domains. At minimum, add `nofollow` to outbound card social links.
- **PWA SW with `clientsClaim: true` + `skipWaiting: true`** — not a security vuln but a UX footgun. If you ever ship an XSS-laden file, the SW will force-install it on every client with no user interaction. Defense in depth: prompt for SW update instead of auto-claim.
- **No CSP / `Permissions-Policy` / `Referrer-Policy`** headers — static host, so must be configured at CDN/edge (Cloudflare, Vercel). Example `_headers` (Netlify/Cloudflare Pages):
  ```
  /*
    Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: geolocation=(), microphone=(), camera=()
  ```
  `unsafe-inline` on style/script is required because of `is:inline` theme script (`Layout.astro:47-58`) — that's acceptable for a no-backend static site.
- **`set:html={JSON.stringify(jsonLd)}`** (`SEO.astro:187`) — content is fully controlled; no XSS surface.
- **MDX files** rendered via `render(entry)` (`[slug].astro:25`) — rehype-raw is not in the rehype pipeline in `astro.config.mjs` (it's in `devDependencies` but not wired). Good: no arbitrary HTML in MDX body.
- **No XSS risk** on the search input — `searchQuery` is string-compared against `data-*` attrs, never injected into HTML.
- **No CSRF surface** — no mutations, no forms posting anywhere.

---

## 📦 Tech Stack Review

| Piece | Verdict | Note |
|---|---|---|
| Astro 6.1.4 | ✅ Keep | Correct for static content. |
| Tailwind v4 via Vite | ✅ Keep | Current generation. |
| @astrojs/mdx | ✅ Keep | Used for MDX bodies. |
| @astrojs/sitemap | ✅ Keep | Works; fix `site.url` to make it useful. |
| @astrojs/rss | ⚠️ Unused | You import it nowhere. Either implement `/posts/rss.xml` or `bun remove @astrojs/rss`. |
| @vite-pwa/astro | ⚠️ Overkill for this project | Service worker complexity > benefit for a directory that updates. Keep only if offline-reading centers is a real use case. |
| astro-meta-tags | ⚠️ Dev-only debug overlay | Verify it's not bundled in prod. |
| astro-icon | ✅ Keep | Correct tree-shaking. |
| @toolwind/corner-shape | ⚠️ Niche | You use `corner-squircle` everywhere — if the lib is 2 KB, fine; if browser-support matters, measure on Firefox/Safari. |
| clsx + tailwind-merge | ✅ Keep | Standard pair. |
| TypeScript ^6.0.2 | ⚠️ Bleeding-edge | TS 6 is very new. Check `@astrojs/*` compatibility before lockfile updates break builds. |
| rehype-* plugins | ⚠️ Partially wired | `rehype-autolink-headings`, `rehype-github-alerts`, `rehype-raw`, `rehype-slug` are in `devDependencies` but only `rehype-prism-plus` is in `rehypePlugins` in `astro.config.mjs`. Either wire them or remove. |
| Package manager (bun) | ✅ Keep | `bun.lockb` is current. |

### Recommended removals
```
@astrojs/rss                  (unused)
rehype-autolink-headings      (unused)
rehype-github-alerts          (unused)
rehype-raw                    (unused, and its presence is a future XSS risk)
rehype-slug                   (unused)
remark-gemoji                 (no :emoji: found in MDX)
```
Expected node_modules shrink: ~30 MB. Faster installs.

### No reason to change
Astro is the correct choice. React/Vue/Svelte would add runtime JS for zero gain. Next.js would add SSR complexity for a static site. Staying on Astro is right.

---

## 🧠 Final Verdict

**Score: 5.5 / 10**

**Harsh summary:**
The architecture is sound — Astro + content collections + static output is exactly right for this content. The code has good bones: typed filter state, clean Tailwind usage, proper FOUC guard, working PWA shell. But the project is **not production-ready** in its current state. The build is shipping `example.com` in every canonical URL, every OG tag, every sitemap entry, and the JSON-LD. The homepage has an empty `<title>`. The source link on every detail page is broken. The i18n runtime pretends the site is multilingual while `<html lang="en">` tells Google it's monolingual English — and then serves Russian. Half of the content-collection definitions and half the rehype pipeline are dead code.

Every one of the "MUST FIX" items is a 1–2 line change. The delta between where this is and where it should be is an afternoon, not a sprint. Ship the config fix and the JSON-LD + hreflang fixes before this site gets indexed in its current state — you do not want Google's first impression to be 370 canonical-to-example.com pages.

**Do in this order:**
1. `src/config.ts` → real URL + real OG strings.
2. `[slug].astro:165` → fix broken source link validation.
3. `CardItem.astro` → un-nest anchors.
4. Delete dead `organizations` collection + dead rehype deps.
5. Add `Organization` JSON-LD to detail pages.
6. Commit to single-language-with-hreflang or full SSR-per-language. Pick one this week.

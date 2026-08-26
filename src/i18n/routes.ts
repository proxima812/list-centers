import { defaultLocale, locales } from "@/i18n";

/**
 * `getStaticPaths` для всего, что живёт под `src/pages/[locale]/`.
 *
 * Русский отдаётся без префикса (`prefixDefaultLocale: false`), поэтому
 * динамический сегмент собирается только из остальных локалей. Один и тот же
 * `filter(...).map(...)` был скопирован в десять файлов — добавление третьей
 * локали означало десять одинаковых правок.
 */
export const secondaryLocales = () => locales.filter((locale) => locale !== defaultLocale);

export const secondaryLocalePaths = () =>
	secondaryLocales().map((locale) => ({ params: { locale } }));

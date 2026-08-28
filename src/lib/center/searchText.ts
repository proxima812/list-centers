/**
 * Нормализация поисковых строк — общая для сборки и для браузера.
 *
 * Индекс `/centers/search-index.json` строится этими функциями на сборке
 * (`utils/centersSearchIndex.ts`), а клиентский тулбар применяет их же к
 * тексту, вычитанному из DOM. Раньше это были две независимые копии: любое
 * расхождение на один символ молча ломало поиск в одном из двух режимов.
 *
 * Модуль обязан оставаться свободным от Node- и DOM-API: он попадает и в
 * серверную сборку, и в клиентский бандл.
 */

const DIACRITICS = /\p{Diacritic}/gu;
const QUOTES = /[“”«»"']/g;

export function normalizeSearchText(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(DIACRITICS, "")
		.replace(/ё/g, "е")
		.replace(QUOTES, "")
		.trim();
}

/** Термы для автодополнения: без пустых, без дублей, без односимвольных. */
export function uniqueTerms(terms: readonly (string | undefined)[]): string[] {
	return Array.from(
		new Set(
			terms
				.filter((term): term is string => Boolean(term))
				.map((term) => term.trim())
				.filter((term) => term.length > 1),
		),
	);
}

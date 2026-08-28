import { MACRO_REGIONS, getMacroRegion, type MacroRegion } from "@/data/geo";
import { countryFlagsByRu, getCountryLabel, worldCountriesRu } from "@/data/worldCountries";
import { countByCountry } from "@/lib/center/stats";
import type { AppLocale } from "@/i18n";
import type { CollectionEntry } from "astro:content";

type SourceCenter = CollectionEntry<"centers">;

export interface CountryRow {
	/** Русское название страны — ключ группировки и значение фильтра каталога. */
	country: string;
	label: string;
	flag: string;
	count: number;
}

export interface MacroCountryGroup {
	macro: MacroRegion;
	/** Страны, где центры есть, — по убыванию количества. */
	present: CountryRow[];
	/** Страны без единого центра — по алфавиту. Это и есть карта пробелов. */
	missing: CountryRow[];
	total: number;
}

/**
 * Разложить страны по макрорегионам для `/stats`.
 *
 * Считается из двух источников сразу: страны каталога и полный справочник
 * `worldCountriesRu`. Без второго страница показывала бы только то, что уже
 * найдено, и пробел «здесь центров нет» перестал бы быть виден.
 *
 * Подпись макрорегиона здесь не переводится: `t` живёт в компонентах,
 * а модуль остаётся чистым и пригодным для любой локали.
 */
export function groupCountriesByMacroRegion(
	centers: readonly SourceCenter[],
	locale: AppLocale,
): MacroCountryGroup[] {
	const counts = countByCountry(centers);
	const known = new Set([...counts.keys(), ...worldCountriesRu]);

	const toRow = (country: string): CountryRow => ({
		country,
		label: getCountryLabel(country, locale),
		flag: countryFlagsByRu[country] ?? "",
		count: counts.get(country) ?? 0,
	});

	return MACRO_REGIONS.map((macro: MacroRegion) => {
		const inMacro = [...known].filter((country) => getMacroRegion(country) === macro);
		const present = inMacro
			.filter((country) => counts.has(country))
			.map(toRow)
			.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, locale));
		const missing = inMacro
			.filter((country) => !counts.has(country))
			.map(toRow)
			.sort((a, b) => a.label.localeCompare(b.label, locale));

		return {
			macro,
			present,
			missing,
			total: present.reduce((sum, row) => sum + row.count, 0),
		};
	}).filter((group) => group.present.length > 0 || group.missing.length > 0);
}

/** Сколько стран из справочника остались без центров — строка под таблицей. */
export const countMissingCountries = (groups: readonly MacroCountryGroup[]) =>
	groups.reduce((sum, group) => sum + group.missing.length, 0);

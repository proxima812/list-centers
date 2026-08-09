import {
	findRuRegion,
	getFederalDistrict,
	getRuRegionLabel,
	normalizeRuRegion,
	suggestRuRegion,
} from "./ruRegions";
import { getMacroRegion } from "./macroRegions";
import { normalizeCity, normalizeForeignRegion } from "./places";

export * from "./ruRegions";
export * from "./macroRegions";
export * from "./places";

export const RUSSIA = "Россия";

/**
 * Верхний уровень каталога. Раньше это было поле `type` («Регион РФ» /
 * «Зарубежный» / «Онлайн»), которое стояло в панели четвёртым равноправным
 * списком чипов и при этом на 99% повторяло страну: «Регион РФ» = Россия,
 * «Зарубежный» = не Россия, «Онлайн» = страны нет. Теперь это не фильтр в
 * общем ряду, а корень дерева — он решает, какая география вообще
 * показывается ниже.
 */
export type CenterScope = "ru" | "abroad" | "online";

export interface CenterGeo {
	scope: CenterScope;
	/**
	 * Корзина мира: Россия, СНГ, Европа, Азия, Америка, Африка и Океания.
	 * Сводит 43 страны к шести строкам.
	 */
	macro: string;
	/**
	 * Федеральный округ. Заполнен только у российских карточек и сводит 64
	 * живых субъекта к восьми строкам.
	 *
	 * Два промежуточных уровня, а не один: они не конкурируют, а живут в
	 * разных ветках дерева — округа видны, когда выбрана Россия, макрорегионы
	 * во всех остальных случаях.
	 */
	okrug: string;
	country: string;
	region: string;
	city: string;
	district: string;
}

interface RawLocation {
	country?: string;
	region?: string;
	city?: string;
	district?: string;
}

const EMPTY_GEO: CenterGeo = {
	scope: "online",
	macro: "",
	okrug: "",
	country: "",
	region: "",
	city: "",
	district: "",
};

/**
 * Единая точка, где сырой frontmatter превращается в ключи фильтров. Все
 * потребители — панель, карточки, поисковый индекс — обязаны ходить сюда,
 * иначе ключ фильтра и ключ карточки разъедутся и фильтр перестанет находить
 * собственные карточки.
 */
export function resolveCenterGeo(location: RawLocation | undefined): CenterGeo {
	const country = location?.country?.trim();
	if (!country) return EMPTY_GEO;

	const isRussia = country === RUSSIA;
	const region = isRussia
		? normalizeRuRegion(location?.region)
		: normalizeForeignRegion(country, location?.region);

	return {
		scope: isRussia ? "ru" : "abroad",
		macro: getMacroRegion(country) ?? "",
		okrug: (isRussia ? getFederalDistrict(region) : undefined) ?? "",
		country,
		region: region ?? "",
		city: normalizeCity(location?.city) ?? "",
		district: location?.district?.trim() ?? "",
	};
}

/** Подпись региона в чипе: короткая форма, если каноническая не влезает. */
export function getRegionLabel(region: string): string {
	return findRuRegion(region) ? getRuRegionLabel(region) : region;
}

export { findRuRegion, getFederalDistrict, normalizeRuRegion, suggestRuRegion, getMacroRegion };

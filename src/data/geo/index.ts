import {
	findRuRegion,
	getFederalDistrict,
	getRuRegionLabel,
	normalizeRuRegion,
	RUSSIA,
	suggestRuRegion,
} from "./ruRegions";
import { getMacroRegion } from "./macroRegions";
import { normalizeCity, normalizeForeignRegion } from "./places";

export * from "./ruRegions";
export * from "./macroRegions";
export * from "./places";

export type CenterScope = "ru" | "abroad" | "online";

export interface CenterGeo {
	scope: CenterScope;
	macro: string;
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

export function getRegionLabel(region: string): string {
	return findRuRegion(region) ? getRuRegionLabel(region) : region;
}

export { findRuRegion, getFederalDistrict, normalizeRuRegion, suggestRuRegion, getMacroRegion };

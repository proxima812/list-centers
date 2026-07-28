import { getMapCityCoordinates, getMapCountryCoordinates } from "@/data/mapCityCoordinates";
import { defaultLocale, localizePath } from "@/i18n";
import { createCenterRouteIdMap, getCenterPath } from "@/utils/centers";
import { getCollection } from "astro:content";
import { feature } from "topojson-client";
import countriesTopology from "world-atlas/countries-110m.json";

const countryPalette = [
	{ base: "#2f5fbe", soft: "#dce7ff" },
	{ base: "#0f8a67", soft: "#d8f2e9" },
	{ base: "#b45b33", soft: "#f2dfd4" },
	{ base: "#7556a8", soft: "#e7def8" },
	{ base: "#0b7285", soft: "#d7eef2" },
	{ base: "#a9345d", soft: "#f2dbe5" },
];

export const mapCopy = {
	title: "Карта центров",
	description: "Интерактивный глобус центров с проверенными координатами из каталога.",
	heading: "Карта",
	intro: "Центры с geo-данными на вращающемся глобусе.",
	countLabel: "точки с координатами",
	totalLabel: "центров в каталоге",
	selected: "Выбрано",
	openCenter: "Открыть центр",
	openMap: "Открыть карту",
	search: "Поиск центров",
	searchPlaceholder: "Город, страна, центр",
	listTitle: "Центры на карте",
	exactLabel: "точно",
	cityLabel: "по городу",
	countryLabel: "по стране",
	noResults: "Ничего не найдено.",
	dragHint: "Глобус можно двигать",
	empty: "Пока нет центров с координатами.",
	loading: "Загружаем карту...",
	loadError: "Не удалось загрузить данные карты.",
	continents: {
		europe: "Европа",
		asia: "Азия",
		africa: "Африка",
		northAmerica: "Сев. Америка",
		southAmerica: "Юж. Америка",
		australia: "Австралия",
	},
};

type CountryFeature = {
	id?: string | number;
	properties?: { name?: string };
	geometry?: {
		type: "Polygon" | "MultiPolygon";
		coordinates: number[][][] | number[][][][];
	};
};

const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

const simplifyRing = (ring: number[][]) => {
	if (ring.length <= 18) {
		return ring.map(([lng, lat]) => [roundCoordinate(lng), roundCoordinate(lat)]);
	}

	const step = ring.length > 180 ? 4 : ring.length > 90 ? 3 : 2;
	const simplified = ring
		.filter((_, index) => index === 0 || index === ring.length - 1 || index % step === 0)
		.map(([lng, lat]) => [roundCoordinate(lng), roundCoordinate(lat)]);

	return simplified.length >= 4 ? simplified : [];
};

export const getMapCopy = () => mapCopy;

export async function getMapCountries() {
	const countryFeatureCollection = feature(
		countriesTopology as never,
		countriesTopology.objects.countries as never,
	) as unknown as { features: CountryFeature[] };

	return countryFeatureCollection.features
		.map((country) => {
			if (!country.geometry) return null;

			const polygons =
				country.geometry.type === "Polygon"
					? [country.geometry.coordinates as number[][][]]
					: (country.geometry.coordinates as number[][][][]);
			const simplifiedPolygons = polygons
				.map((polygon) => polygon.map(simplifyRing).filter((ring) => ring.length > 0))
				.filter((polygon) => polygon.length > 0);

			if (!simplifiedPolygons.length) return null;

			return {
				id: String(country.id ?? country.properties?.name ?? ""),
				name: country.properties?.name ?? "",
				polygons: simplifiedPolygons,
			};
		})
		.filter(Boolean);
}

export async function getMapCentersPayload() {
	const sourceCenters = await getCollection("centers");
	const routeIds = createCenterRouteIdMap(sourceCenters);
	const copy = getMapCopy();

	const centersWithMapCoordinates = sourceCenters
		.map((center) => {
			const fallbackCityGeo = getMapCityCoordinates(
				center.data.location?.city,
				center.data.location?.region,
			);
			const fallbackCountryGeo = getMapCountryCoordinates(center.data.location?.country);

			return { center, fallbackCityGeo, fallbackCountryGeo };
		})
		.filter(
			({ center, fallbackCityGeo, fallbackCountryGeo }) =>
				center.data.geo || fallbackCityGeo || fallbackCountryGeo,
		)
		.sort((a, b) => a.center.data.title.localeCompare(b.center.data.title, defaultLocale));

	const countriesWithGeo = Array.from(
		new Set(
			centersWithMapCoordinates
				.map(({ center }) => center.data.location?.country)
				.filter(Boolean),
		),
	);
	const countryPaint = new Map(
		countriesWithGeo.map((country, index) => [
			country,
			countryPalette[index % countryPalette.length],
		]),
	);

	const centers = centersWithMapCoordinates.map(
		({ center, fallbackCityGeo, fallbackCountryGeo }) => {
			const title = center.data.title;
			const routeId = routeIds.get(center.id) ?? center.id;
			const exactGeo = center.data.geo;
			const geo = exactGeo ?? fallbackCityGeo ?? fallbackCountryGeo!;
			const city = center.data.location?.city;
			const country = center.data.location?.country;
			const region = center.data.location?.region;
			const location = [city, region, country].filter(Boolean).join(", ");
			const precision = exactGeo?.precision ?? (fallbackCityGeo ? "city" : "country");
			const address = exactGeo?.address ?? fallbackCityGeo?.label ?? fallbackCountryGeo?.label;

			return {
				id: center.id,
				title,
				location,
				city,
				country,
				color: countryPaint.get(country)?.base ?? countryPalette[0].base,
				softColor: countryPaint.get(country)?.soft ?? countryPalette[0].soft,
				href: localizePath(defaultLocale, getCenterPath(routeId)),
				lat: geo.lat,
				lng: geo.lng,
				address,
				mapUrl: exactGeo?.mapUrl,
				precision,
				precisionLabel:
					precision === "exact"
						? copy.exactLabel
						: precision === "city"
							? copy.cityLabel
							: copy.countryLabel,
				searchText: [title, city, region, country, address].filter(Boolean).join(" ").toLowerCase(),
			};
		},
	);

	return {
		centers,
		totalCenters: sourceCenters.length,
		exactCentersCount: centers.filter((center) => center.precision === "exact").length,
		cityCentersCount: centers.filter((center) => center.precision === "city").length,
		countryCentersCount: centers.filter((center) => center.precision === "country").length,
	};
}

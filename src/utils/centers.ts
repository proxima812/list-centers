import type { CollectionEntry } from "astro:content";

const CENTER_ROUTE_PREFIX = "tbk-";
const CENTER_ROUTE_ID_PATTERN = /^tbk-\d+$/;
const CENTER_TRANSLATION_COLLECTIONS = {
	en: "centersEn",
} as const;

export type CenterTranslationLocale = keyof typeof CENTER_TRANSLATION_COLLECTIONS;
export type CenterTranslationCollection =
	(typeof CENTER_TRANSLATION_COLLECTIONS)[CenterTranslationLocale];

export const getCenterPath = (routeId: string) => `/centers/${routeId}`;

/* ─── Оттенок метки центра ────────────────────────────────────────────────
   Логотипов у центров нет — ни поля в схеме, ни файлов, — поэтому место
   логотипа на карточке держит градиентный кружок. Он не украшение: в сетке
   четыре сотни карточек, различимых только длиной заголовка, и цветное пятно
   даёт глазу якорь, по которому карточка узнаётся при повторном заходе.

   Монограммы здесь быть не может, хотя это и стандартный фолбэк аватара:
   129 названий из 420 начинаются с «Общественная организация», ещё 87 —
   с «Татарский». Стена одинаковых «О» различала бы карточки хуже, чем
   ничего. Остаётся цвет.

   Оттенок выводится из id, а не из title: id общий у русской карточки и её
   перевода, и метка не перекрашивается при переключении локали. И не из
   routeId: у файла не вида `tbk-N` он синтетический и зависит от того, какой
   набор карточек попал на страницу, — метка бы съезжала между каталогом и
   блоком похожих центров.

   Шаг — золотой угол, а не хэш. Хэш ровно покрывает круг, но соседей в сетке
   не разводит: на наших id 70 пар из 419 оказывались ближе 25° друг к другу,
   то есть рядом лежали два одинаковых на глаз кружка. Филлотаксисный шаг в
   137.5° этого не допускает структурно — соседи по строке расходятся минимум
   на 137°, соседи по вертикали в сетке из четырёх колонок на 169°, — а
   покрытие круга остаётся ровным (34-36 меток на каждые 30°). */
const MARK_GOLDEN_ANGLE = 137.50776405003785;

/** FNV-1a с финализатором fmix32: короткие похожие строки должны расходиться. */
const hashSeed = (value: string) => {
	let hash = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}

	hash ^= hash >>> 16;
	hash = Math.imul(hash, 0x85ebca6b);
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 0xc2b2ae35);
	hash ^= hash >>> 16;

	return hash >>> 0;
};

export const getCenterMarkHue = (id: string) => {
	// Порядковый номер id — это и есть индекс в филлотаксисе. Файл не вида
	// `tbk-N` номера не имеет, ему индекс заменяет хэш собственного id.
	const seed = CENTER_ROUTE_ID_PATTERN.test(id)
		? Number(id.slice(CENTER_ROUTE_PREFIX.length))
		: hashSeed(id);

	return Math.round((seed * MARK_GOLDEN_ANGLE) % 360);
};

export const getCenterTranslationCollection = (locale: string) =>
	CENTER_TRANSLATION_COLLECTIONS[locale as CenterTranslationLocale];

export const createCenterRouteIdMap = (
	entries: CollectionEntry<"centers" | "centersEn">[],
) => {
	const sortedEntries = [...entries].sort((a, b) => {
		const aRouteNumber = a.id.match(CENTER_ROUTE_ID_PATTERN)?.[0].slice(CENTER_ROUTE_PREFIX.length);
		const bRouteNumber = b.id.match(CENTER_ROUTE_ID_PATTERN)?.[0].slice(CENTER_ROUTE_PREFIX.length);

		if (aRouteNumber && bRouteNumber) {
			return Number(aRouteNumber) - Number(bRouteNumber);
		}

		return a.id.localeCompare(b.id, "en");
	});

	// Синтетический id для файла не вида tbk-N берёт первый свободный номер,
	// а не позицию в сортировке: позиционный `tbk-${index+1}` мог совпасть с
	// реальным id другого файла и дать дубликат маршрута в getStaticPaths.
	const usedRouteIds = new Set(
		entries.map((entry) => entry.id).filter((id) => CENTER_ROUTE_ID_PATTERN.test(id)),
	);
	let nextNumber = 1;

	return new Map(
		sortedEntries.map((entry) => {
			if (CENTER_ROUTE_ID_PATTERN.test(entry.id)) return [entry.id, entry.id] as const;

			while (usedRouteIds.has(`${CENTER_ROUTE_PREFIX}${nextNumber}`)) nextNumber += 1;
			const routeId = `${CENTER_ROUTE_PREFIX}${nextNumber}`;
			usedRouteIds.add(routeId);
			return [entry.id, routeId] as const;
		}),
	);
};

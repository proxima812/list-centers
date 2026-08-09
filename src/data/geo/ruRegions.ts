// Канонический справочник субъектов РФ.
//
// Нужен по двум причинам. Первая — фильтр «Регион» строится по значению
// `location.region` из frontmatter, и любое расхождение в написании создаёт
// вторую строку в панели: до нормализации Югра существовала одновременно через
// дефис и через тире, а Башкортостан был расколот на шесть узлов районами.
// Вторая — `federalDistrict` даёт промежуточный уровень: 69 живых регионов
// схлопываются в восемь округов, и свёрнутая панель показывает восемь строк
// вместо семидесяти.
//
// `aliases` — это не синонимы «на будущее», а зафиксированные написания,
// которые реально встречались в данных или которые редактор напишет по
// привычке («г. Москва», «Республика Удмуртия»). Схема коллекции резолвит
// `region` через этот справочник и роняет билд на неизвестном значении, так
// что список алиасов — единственное место, где расширяется словарь.

export const FEDERAL_DISTRICTS = [
	"Центральный",
	"Северо-Западный",
	"Приволжский",
	"Уральский",
	"Сибирский",
	"Дальневосточный",
	"Южный",
	"Северо-Кавказский",
] as const;

export type FederalDistrict = (typeof FEDERAL_DISTRICTS)[number];

export interface RuRegion {
	/** Каноническое имя. Оно же ключ фильтра и значение в frontmatter. */
	name: string;
	federalDistrict: FederalDistrict;
	/** Короткая подпись для чипа, если каноническое имя не влезает в колонку. */
	short?: string;
	/** Написания, которые резолвятся в каноническое имя. */
	aliases?: string[];
}

export const RU_REGIONS: RuRegion[] = [
	// Центральный
	{ name: "Москва", federalDistrict: "Центральный", aliases: ["г. Москва", "город Москва"] },
	{ name: "Белгородская область", federalDistrict: "Центральный" },
	{ name: "Брянская область", federalDistrict: "Центральный" },
	{ name: "Владимирская область", federalDistrict: "Центральный" },
	{ name: "Воронежская область", federalDistrict: "Центральный" },
	{ name: "Ивановская область", federalDistrict: "Центральный" },
	{ name: "Калужская область", federalDistrict: "Центральный" },
	{ name: "Костромская область", federalDistrict: "Центральный" },
	{ name: "Курская область", federalDistrict: "Центральный" },
	{ name: "Липецкая область", federalDistrict: "Центральный" },
	{ name: "Московская область", federalDistrict: "Центральный" },
	{ name: "Орловская область", federalDistrict: "Центральный" },
	{ name: "Рязанская область", federalDistrict: "Центральный" },
	{ name: "Смоленская область", federalDistrict: "Центральный" },
	{ name: "Тамбовская область", federalDistrict: "Центральный" },
	{ name: "Тверская область", federalDistrict: "Центральный" },
	{ name: "Тульская область", federalDistrict: "Центральный" },
	{ name: "Ярославская область", federalDistrict: "Центральный" },

	// Северо-Западный
	{
		name: "Санкт-Петербург",
		federalDistrict: "Северо-Западный",
		aliases: ["г. Санкт-Петербург", "город Санкт-Петербург", "Санкт-Петербург (город)"],
	},
	{ name: "Республика Карелия", federalDistrict: "Северо-Западный", short: "Карелия" },
	{ name: "Республика Коми", federalDistrict: "Северо-Западный", short: "Коми" },
	{ name: "Архангельская область", federalDistrict: "Северо-Западный" },
	{ name: "Вологодская область", federalDistrict: "Северо-Западный" },
	{ name: "Калининградская область", federalDistrict: "Северо-Западный" },
	{ name: "Ленинградская область", federalDistrict: "Северо-Западный" },
	{ name: "Мурманская область", federalDistrict: "Северо-Западный" },
	{ name: "Новгородская область", federalDistrict: "Северо-Западный" },
	{ name: "Псковская область", federalDistrict: "Северо-Западный" },
	{
		name: "Ненецкий автономный округ",
		federalDistrict: "Северо-Западный",
		short: "Ненецкий АО",
	},

	// Приволжский
	{
		name: "Республика Башкортостан",
		federalDistrict: "Приволжский",
		short: "Башкортостан",
		aliases: ["Башкирия", "Республика Башкирия"],
	},
	{ name: "Республика Марий Эл", federalDistrict: "Приволжский", short: "Марий Эл" },
	{ name: "Республика Мордовия", federalDistrict: "Приволжский", short: "Мордовия" },
	{
		name: "Республика Татарстан",
		federalDistrict: "Приволжский",
		short: "Татарстан",
		aliases: ["Татарстан", "Республика Татарстан (Татарстан)"],
	},
	{
		name: "Удмуртская Республика",
		federalDistrict: "Приволжский",
		short: "Удмуртия",
		aliases: ["Республика Удмуртия", "Удмуртия"],
	},
	{
		name: "Чувашская Республика",
		federalDistrict: "Приволжский",
		short: "Чувашия",
		aliases: ["Республика Чувашия", "Чувашия"],
	},
	{ name: "Пермский край", federalDistrict: "Приволжский" },
	{ name: "Кировская область", federalDistrict: "Приволжский" },
	{ name: "Нижегородская область", federalDistrict: "Приволжский" },
	{ name: "Оренбургская область", federalDistrict: "Приволжский" },
	{ name: "Пензенская область", federalDistrict: "Приволжский" },
	{ name: "Самарская область", federalDistrict: "Приволжский" },
	{ name: "Саратовская область", federalDistrict: "Приволжский" },
	{ name: "Ульяновская область", federalDistrict: "Приволжский" },

	// Уральский
	{ name: "Курганская область", federalDistrict: "Уральский" },
	{ name: "Свердловская область", federalDistrict: "Уральский" },
	{ name: "Тюменская область", federalDistrict: "Уральский" },
	{ name: "Челябинская область", federalDistrict: "Уральский" },
	{
		name: "Ханты-Мансийский автономный округ — Югра",
		federalDistrict: "Уральский",
		short: "ХМАО — Югра",
		// Дефис против тире — тот самый дубль, из-за которого округ был двумя
		// разными фильтрами.
		aliases: [
			"Ханты-Мансийский автономный округ - Югра",
			"Ханты-Мансийский автономный округ – Югра",
			"ХМАО",
			"ХМАО — Югра",
			"Югра",
		],
	},
	{
		name: "Ямало-Ненецкий автономный округ",
		federalDistrict: "Уральский",
		short: "ЯНАО",
		aliases: ["ЯНАО"],
	},

	// Сибирский
	{ name: "Республика Алтай", federalDistrict: "Сибирский", short: "Алтай" },
	{
		name: "Республика Тыва",
		federalDistrict: "Сибирский",
		short: "Тыва",
		aliases: ["Республика Тува", "Тува", "Тыва"],
	},
	{ name: "Республика Хакасия", federalDistrict: "Сибирский", short: "Хакасия" },
	{ name: "Алтайский край", federalDistrict: "Сибирский" },
	{ name: "Красноярский край", federalDistrict: "Сибирский" },
	{ name: "Иркутская область", federalDistrict: "Сибирский" },
	{
		name: "Кемеровская область",
		federalDistrict: "Сибирский",
		aliases: ["Кемеровская область — Кузбасс", "Кузбасс"],
	},
	{ name: "Новосибирская область", federalDistrict: "Сибирский" },
	{ name: "Омская область", federalDistrict: "Сибирский" },
	{ name: "Томская область", federalDistrict: "Сибирский" },

	// Дальневосточный
	{ name: "Республика Бурятия", federalDistrict: "Дальневосточный", short: "Бурятия" },
	{
		name: "Республика Саха (Якутия)",
		federalDistrict: "Дальневосточный",
		short: "Якутия",
		aliases: ["Якутия", "Республика Саха"],
	},
	{ name: "Забайкальский край", federalDistrict: "Дальневосточный" },
	{
		name: "Камчатский край",
		federalDistrict: "Дальневосточный",
		// Область упразднена в 2007 году, в данных встречалась.
		aliases: ["Камчатская область"],
	},
	{ name: "Приморский край", federalDistrict: "Дальневосточный" },
	{ name: "Хабаровский край", federalDistrict: "Дальневосточный" },
	{ name: "Амурская область", federalDistrict: "Дальневосточный" },
	{ name: "Магаданская область", federalDistrict: "Дальневосточный" },
	{ name: "Сахалинская область", federalDistrict: "Дальневосточный" },
	{
		name: "Еврейская автономная область",
		federalDistrict: "Дальневосточный",
		short: "Еврейская АО",
	},
	{
		name: "Чукотский автономный округ",
		federalDistrict: "Дальневосточный",
		short: "Чукотка",
	},

	// Южный
	{ name: "Республика Адыгея", federalDistrict: "Южный", short: "Адыгея" },
	{ name: "Республика Калмыкия", federalDistrict: "Южный", short: "Калмыкия" },
	{ name: "Республика Крым", federalDistrict: "Южный", short: "Крым", aliases: ["Крым"] },
	{ name: "Севастополь", federalDistrict: "Южный", aliases: ["г. Севастополь"] },
	{ name: "Краснодарский край", federalDistrict: "Южный" },
	{ name: "Астраханская область", federalDistrict: "Южный" },
	{ name: "Волгоградская область", federalDistrict: "Южный" },
	{ name: "Ростовская область", federalDistrict: "Южный" },

	// Северо-Кавказский
	{ name: "Республика Дагестан", federalDistrict: "Северо-Кавказский", short: "Дагестан" },
	{ name: "Республика Ингушетия", federalDistrict: "Северо-Кавказский", short: "Ингушетия" },
	{
		name: "Кабардино-Балкарская Республика",
		federalDistrict: "Северо-Кавказский",
		short: "Кабардино-Балкария",
	},
	{
		name: "Карачаево-Черкесская Республика",
		federalDistrict: "Северо-Кавказский",
		short: "Карачаево-Черкесия",
	},
	{
		name: "Республика Северная Осетия — Алания",
		federalDistrict: "Северо-Кавказский",
		short: "Северная Осетия",
		aliases: [
			"Республика Северная Осетия",
			"Республика Северная Осетия - Алания",
			"Северная Осетия",
		],
	},
	{ name: "Чеченская Республика", federalDistrict: "Северо-Кавказский", short: "Чечня" },
	{ name: "Ставропольский край", federalDistrict: "Северо-Кавказский" },
];

const REGION_BY_KEY = new Map<string, RuRegion>();

function keyOf(value: string): string {
	// Тире, дефис и неразрывный пробел в названиях субъектов пишут вразнобой,
	// поэтому ключ их не различает — иначе `aliases` пришлось бы наполнять
	// комбинаторикой знаков препинания.
	return value
		.toLowerCase()
		.replace(/ё/g, "е")
		.replace(/[‐-―]/g, "-")
		.replace(/\s+/g, " ")
		.replace(/\s*-\s*/g, "-")
		.trim();
}

for (const region of RU_REGIONS) {
	REGION_BY_KEY.set(keyOf(region.name), region);
	for (const alias of region.aliases ?? []) {
		REGION_BY_KEY.set(keyOf(alias), region);
	}
}

/** Каноническая запись субъекта по любому известному написанию. */
export function findRuRegion(value: string | undefined): RuRegion | undefined {
	if (!value) return undefined;
	return REGION_BY_KEY.get(keyOf(value));
}

/** Каноническое имя субъекта или `undefined`, если написание неизвестно. */
export function normalizeRuRegion(value: string | undefined): string | undefined {
	return findRuRegion(value)?.name;
}

export function getRuRegionLabel(name: string): string {
	const region = findRuRegion(name);
	return region?.short ?? region?.name ?? name;
}

export function getFederalDistrict(region: string | undefined): FederalDistrict | undefined {
	return findRuRegion(region)?.federalDistrict;
}

/**
 * Ближайшее по написанию каноническое имя. Нужно только для сообщения об
 * ошибке валидации: подсказать редактору, что он имел в виду.
 */
export function suggestRuRegion(value: string): string | undefined {
	const key = keyOf(value);
	let best: { name: string; score: number } | undefined;

	for (const region of RU_REGIONS) {
		for (const candidate of [region.name, ...(region.aliases ?? [])]) {
			const candidateKey = keyOf(candidate);
			const shared = candidateKey.startsWith(key.slice(0, 4)) ? key.slice(0, 4).length : 0;
			const contains = candidateKey.includes(key) || key.includes(candidateKey) ? 8 : 0;
			const score = shared + contains;
			if (score > 0 && (!best || score > best.score)) {
				best = { name: region.name, score };
			}
		}
	}

	return best?.name;
}

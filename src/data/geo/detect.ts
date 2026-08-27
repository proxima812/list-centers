import { countryFlagsByRu } from "@/data/worldCountries";

/**
 * Перевод того, что о посетителе знает Cloudflare, на язык карточек.
 *
 * Снаружи приходит ISO-код страны (`KZ`) и город латиницей в английской
 * традиции (`Almaty`, `Moscow`). В карточках то же самое записано по-русски
 * («Казахстан», «Алматы»). Здесь только это сопоставление — ни DOM, ни сети:
 * модуль уезжает в браузер вместе со страницей «Центры рядом».
 */

const REGIONAL_INDICATOR_BASE = 0x1f1e6;

/**
 * ISO-код из флага: 🇰🇿 — это буквы K и Z, записанные региональными
 * индикаторами. Отдельной таблицы кодов заводить не надо: она уже есть в
 * проекте, просто хранится эмодзи.
 */
function flagToCode(flag: string): string {
	const points = [...flag].map((char) => char.codePointAt(0) ?? 0);
	if (points.length !== 2) return "";

	const letters = points.map((point) => point - REGIONAL_INDICATOR_BASE);
	if (letters.some((index) => index < 0 || index > 25)) return "";

	return letters.map((index) => String.fromCharCode(65 + index)).join("");
}

/** ISO-код → название страны так, как оно стоит в карточках. */
export const countryRuByCode: Record<string, string> = Object.fromEntries(
	Object.entries(countryFlagsByRu)
		.map(([country, flag]) => [flagToCode(flag), country] as const)
		.filter(([code]) => code.length === 2),
);

const CYRILLIC_TO_LATIN: Record<string, string> = {
	а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
	и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
	с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
	щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/** Место, куда `ch` прячется, пока `c` превращается в `k`. Не буква — уцелеет. */
const CH_PLACEHOLDER = "0";

/**
 * Начальный полугласный: «Йошкар» и «Yoshkar» должны сойтись с «Ioshkar».
 * Срабатывает только перед гласной, поэтому «Ивье» и «Измир» не страдают.
 */
function dropLeadingGlide(word: string): string {
	const first = word[0];
	const second = word[1];
	if (!second || (first !== "y" && first !== "i")) return word;

	return VOWELS.has(second) ? word.slice(1) : word;
}

function transliterate(value: string): string {
	let result = "";
	for (const char of value) result += CYRILLIC_TO_LATIN[char] ?? char;

	return result;
}

/**
 * Скелет названия, по которому сравниваются две записи одного места.
 *
 * Всё, чем расходятся транслитерации, сводится к одному виду: `kh` и `h`,
 * `y` и `i`, `c` и `k` (но не внутри `ch`), удвоенные буквы, дефисы и
 * пробелы, `dzh` и `j`, `q` и `k`, `w` и `v`. «Алматы» и «Almaty» дают
 * `almati`, «Набережные Челны» и
 * «Naberezhnyye Chelny» — `naberezhnichelni`. Словаря это не заменяет: то,
 * что расходится не написанием, а корнем («Москва» / «Moscow»), лежит ниже.
 */
export function placeKey(value: string): string {
	return transliterate(value.toLowerCase())
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.split(/[^a-z]+/)
		.filter(Boolean)
		.map(dropLeadingGlide)
		.join("")
		.replaceAll("ch", CH_PLACEHOLDER)
		.replaceAll("c", "k")
		.replaceAll(CH_PLACEHOLDER, "ch")
		.replaceAll("kh", "h")
		.replaceAll("dzh", "j")
		.replaceAll("q", "k")
		.replaceAll("w", "v")
		.replaceAll("y", "i")
		.replace(/(.)\1+/g, "$1");
}

/**
 * Города, которые никакой транслитерацией из русского не получаются: у них
 * другое английское имя, а не другое написание. Ключ — как называет город
 * Cloudflare, значение — как он записан в карточках. Лишняя строка безвредна:
 * если такого города в каталоге нет, совпадения просто не случится.
 */
const CITY_EXONYMS: Record<string, string> = {
	Moscow: "Москва",
	"Saint Petersburg": "Санкт-Петербург",
	"St Petersburg": "Санкт-Петербург",
	"Rostov-on-Don": "Ростов-на-Дону",
	"Nizhny Novgorod": "Нижний Новгород",
	Kyiv: "Киев",
	Odesa: "Одесса",
	Lviv: "Львов",
	Kharkiv: "Харьков",
	Mykolaiv: "Николаев",
	Zaporizhzhia: "Запорожье",
	Kropyvnytskyi: "Кропивницкий",
	Chisinau: "Кишинев",
	Istanbul: "Стамбул",
	Warsaw: "Варшава",
	Bialystok: "Белосток",
	Olsztyn: "Ольштын",
	Vienna: "Вена",
	Prague: "Прага",
	Munich: "Мюнхен",
	Cologne: "Кельн",
	Geneva: "Женева",
	Rome: "Рим",
	Paris: "Париж",
	"The Hague": "Гаага",
	Copenhagen: "Копенгаген",
	"New York": "Нью-Йорк",
	"New Delhi": "Нью-Дели",
	Chicago: "Чикаго",
	Montreal: "Монреаль",
	Melbourne: "Мельбурн",
	Cairo: "Каир",
	Tehran: "Тегеран",
	Ashgabat: "Ашхабад",
	Oskemen: "Усть-Каменогорск",
	"Nur-Sultan": "Астана",
	Seoul: "Сеул",
	Urumqi: "Урумчи",
	Yining: "Кульджа",
	Johannesburg: "Йоханнесбург",
	Constanta: "Констанца",
	Budapest: "Будапешт",
	Bucharest: "Бухарест",
	Brussels: "Брюссель",
	Jizzax: "Джизак",
	Buxoro: "Бухара",
	Toshkent: "Ташкент",
	Samarqand: "Самарканд",
	Urganch: "Ургенч",
	"San Francisco": "Сан-Франциско",
	Oral: "Уральск",
	"Rishon LeZiyyon": "Ришон-ле-Цион",
	"Kohtla-Jarve": "Кохтла-Ярве",
	Eskisehir: "Эскишехир",
	Kutahya: "Кютахья",
};

const EXONYMS_BY_KEY = new Map(
	Object.entries(CITY_EXONYMS).map(([foreign, russian]) => [placeKey(foreign), russian]),
);

/** Страна каталога по коду от Cloudflare; пусто, если такой у нас нет. */
export function matchCountry(code: string): string {
	return countryRuByCode[code.trim().toUpperCase()] ?? "";
}

/**
 * Город каталога по названию от Cloudflare. Ищем только среди тех городов,
 * что реально есть в выборке: промах ничем не грозит — посетитель увидит всю
 * страну и выберет город сам.
 */
export function matchCity(detected: string, cities: Iterable<string>): string {
	const wanted = EXONYMS_BY_KEY.get(placeKey(detected)) ?? detected;
	const key = placeKey(wanted);
	if (!key) return "";

	for (const city of cities) {
		if (placeKey(city) === key) return city;
	}

	return "";
}

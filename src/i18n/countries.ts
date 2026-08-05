import type { AppLocale } from "@/i18n";

/**
 * Страны каталога по-английски.
 *
 * Локация есть только у русских записей (`src/data/centers_formatted`) —
 * английские переводы в `centers_i18n/en` идут без блока `location`. Значит
 * любое место, где название страны попадает на страницу, на `/en/` показало бы
 * кириллицу. Карта закрывает ровно этот разрыв и живёт рядом с остальным i18n,
 * а не в словаре UI: это данные каталога, а не строки интерфейса.
 */
const COUNTRY_EN: Record<string, string> = {
	Абхазия: "Abkhazia",
	Австралия: "Australia",
	Австрия: "Austria",
	Азербайджан: "Azerbaijan",
	Афганистан: "Afghanistan",
	Беларусь: "Belarus",
	Бельгия: "Belgium",
	Болгария: "Bulgaria",
	Великобритания: "United Kingdom",
	Венгрия: "Hungary",
	Германия: "Germany",
	Грузия: "Georgia",
	Израиль: "Israel",
	Испания: "Spain",
	Италия: "Italy",
	Казахстан: "Kazakhstan",
	Канада: "Canada",
	Китай: "China",
	Кыргызстан: "Kyrgyzstan",
	Латвия: "Latvia",
	Литва: "Lithuania",
	Молдова: "Moldova",
	Нидерланды: "Netherlands",
	Перу: "Peru",
	Польша: "Poland",
	Россия: "Russia",
	Румыния: "Romania",
	США: "United States",
	Словакия: "Slovakia",
	Таджикистан: "Tajikistan",
	Турция: "Türkiye",
	Узбекистан: "Uzbekistan",
	Украина: "Ukraine",
	Финляндия: "Finland",
	Франция: "France",
	Чехия: "Czechia",
	Швейцария: "Switzerland",
	Швеция: "Sweden",
	ЮАР: "South Africa",
	"Южная Корея": "South Korea",
	Эстония: "Estonia",
	Япония: "Japan",
};

/**
 * Возвращает русское название как есть, если перевода нет: новая страна в
 * данных не должна ронять страницу — она просто останется кириллицей, пока
 * карту не дополнили.
 */
export function localizeCountry(country: string, locale: AppLocale): string {
	return locale === "en" ? (COUNTRY_EN[country] ?? country) : country;
}

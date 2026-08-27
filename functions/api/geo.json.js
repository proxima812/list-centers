/**
 * Местоположение посетителя для страницы «Центры рядом».
 *
 * Сайт статический, координат в карточках нет — определить город из браузера
 * нечем: Geolocation API вернул бы широту и долготу, сопоставлять их не с чем.
 * Зато Cloudflare уже знает страну и город по IP и кладёт их в `request.cf`.
 * Это первая сторона: ключа не нужно, стороннего сервиса нет, разрешения у
 * посетителя не спрашиваем.
 *
 * Путь заканчивается на `.json` намеренно: `_middleware.js` считает документом
 * всё без расширения и пытается согласовать для него markdown-двойника.
 *
 * Локально (`astro dev`) функции нет — страница переходит к ручному выбору
 * страны, поэтому 404 здесь не ошибка, а один из штатных исходов.
 */

const clean = (value) => (typeof value === "string" ? value.trim() : "");

export function onRequestGet({ request }) {
	const cf = request.cf ?? {};
	const country = clean(cf.country).toUpperCase();

	const body = {
		// T1 — выход из Tor, XX — Cloudflare страну не определил. И то и другое
		// честнее отдать пустым, чем показать карточки случайной страны.
		country: country === "T1" || country === "XX" ? "" : country,
		city: clean(cf.city),
		region: clean(cf.region),
	};

	return new Response(JSON.stringify(body), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			// Ответ зависит от IP: общий кеш отдал бы одному посетителю
			// местоположение другого.
			"Cache-Control": "no-store",
			"X-Robots-Tag": "noindex",
		},
	});
}

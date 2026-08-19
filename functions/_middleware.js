import {
	AEO_SPEC_VERSION,
	detectAIBot,
	estimateTokens,
	negotiateFormat,
	toMarkdownPath,
} from "@dualmark/core";

/**
 * Согласование форматов по AEO Spec v1.0 на стороне Cloudflare Pages.
 *
 * Сайт собирается статически (`output: "static"`), поэтому Response из
 * эндпоинтов @dualmark/astro до прода не доезжает — на диск попадает только
 * тело .md-файла. Заголовки, которые считаются на каждый запрос
 * (X-Markdown-Tokens), и тем более согласование по Accept/User-Agent в
 * `_headers` невыразимы: он статический. Отсюда эта функция — единственное
 * место, где такое вообще можно сделать без перевода сайта на SSR.
 *
 * Логика намеренно консервативная: если markdown-двойника у страницы нет,
 * отдаём обычный HTML, а не 404.
 */

const MARKDOWN_TYPE = "text/markdown; charset=utf-8";

/**
 * Отдавать ли markdown публичным кешам. Cloudflare исторически honors только
 * `Vary: Accept-Encoding`, поэтому вариант, выбранный по Accept/User-Agent,
 * кешировать на общем CDN опасно: браузер может получить markdown из кеша,
 * оставленного ботом. Прямые .md-адреса однозначны и кешируются нормально.
 */
const DIRECT_CACHE_CONTROL = "public, max-age=3600";
const NEGOTIATED_CACHE_CONTROL = "no-store";

/** Страница, а не ассет: у последнего сегмента нет расширения. */
function isDocumentPath(pathname) {
	if (pathname.startsWith("/_astro/")) return false;
	const lastSegment = pathname.split("/").pop() ?? "";
	return !lastSegment.includes(".");
}

/** Явная просьба про HTML уважается даже от бота. */
function mentionsHtml(accept) {
	return /text\/html|application\/xhtml\+xml/i.test(accept ?? "");
}

function buildMarkdownResponse(request, body, { negotiated }) {
	const headers = new Headers({
		"Content-Type": MARKDOWN_TYPE,
		"Cache-Control": negotiated ? NEGOTIATED_CACHE_CONTROL : DIRECT_CACHE_CONTROL,
		"X-Content-Type-Options": "nosniff",
		// Спека требует положительное целое. Пустых двойников быть не должно,
		// но лучше отдать 1, чем 0 и провалить проверку.
		"X-Markdown-Tokens": String(Math.max(1, estimateTokens(body))),
		"X-AEO-Version": AEO_SPEC_VERSION,
		"X-Robots-Tag": "noindex",
		Vary: negotiated ? "Accept, User-Agent" : "Accept",
	});

	return new Response(request.method === "HEAD" ? null : body, {
		status: 200,
		headers,
	});
}

/**
 * Читает статический файл в обход текущего запроса: нужен GET даже когда
 * снаружи пришёл HEAD, иначе тело пустое и токены посчитать не из чего.
 */
async function fetchAsset(context, url) {
	const assetRequest = new Request(url.toString(), { method: "GET" });

	if (context.env?.ASSETS?.fetch) {
		return context.env.ASSETS.fetch(assetRequest);
	}

	return context.next(assetRequest);
}

function withAeoHeaders(response) {
	const headers = new Headers(response.headers);
	headers.set("X-AEO-Version", AEO_SPEC_VERSION);
	// Представление зависит и от Accept, и от User-Agent — говорим об этом
	// честно, даже если Cloudflare учитывает Vary лишь частично.
	headers.set("Vary", "Accept, User-Agent");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

export async function onRequest(context) {
	const { request, next } = context;

	if (request.method !== "GET" && request.method !== "HEAD") return next();

	const url = new URL(request.url);
	const { pathname } = url;

	// Прямой запрос двойника: тело уже на диске, добиваем рантайм-заголовки.
	if (pathname.endsWith(".md")) {
		const asset = await fetchAsset(context, url);
		if (!asset.ok) return next();

		return buildMarkdownResponse(request, await asset.text(), {
			negotiated: false,
		});
	}

	if (!isDocumentPath(pathname)) return next();

	const accept = request.headers.get("Accept");
	const format = negotiateFormat(accept);

	// Клиент не принимает ни HTML, ни markdown, ни wildcard.
	if (format === null) {
		return new Response("Not Acceptable\n", {
			status: 406,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				Vary: "Accept",
				"X-AEO-Version": AEO_SPEC_VERSION,
			},
		});
	}

	const bot = detectAIBot(request.headers.get("User-Agent"));
	const wantsMarkdown = format === "markdown" || (bot.isBot && !mentionsHtml(accept));

	if (wantsMarkdown) {
		const markdownUrl = new URL(toMarkdownPath(pathname), url);
		const asset = await fetchAsset(context, markdownUrl);

		if (asset.ok) {
			return buildMarkdownResponse(request, await asset.text(), {
				negotiated: true,
			});
		}
		// Двойника у страницы нет — молча отдаём HTML.
	}

	return withAeoHeaders(await next());
}

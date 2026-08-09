import type { APIRoute } from "astro";
import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

export interface RobotsTxtOptions {
	enabled?: boolean;
	sitemap?: string;
	aiPolicy?: string;
	rules?: string;
}

let _options: RobotsTxtOptions = {};

// Правила лежат здесь, а не в вызове robotsTxt() из astro.config: хук
// интеграции и внедрённый роут — это два разных экземпляра модуля (один
// исполняется в Node на конфиге, второй в графе Vite при рендере), поэтому
// `_options` до GET не доезжает и любая переданная настройка молча теряется.
//
// `/saved` закрыт от обхода: это личный список из localStorage конкретного
// браузера, роботу там всегда достаётся пустой каркас. Страница дополнительно
// отдаёт `noindex` и не попадает в карту сайта.
const DEFAULT_RULES = ["User-agent: *", "Allow: /", "Disallow: /saved", "Disallow: /en/saved"].join(
	"\n",
);

const getRobotsTxt = (site: URL) => {
	const sitemap = _options.sitemap ?? new URL("sitemap-index.xml", site).href;
	const aiPolicy = _options.aiPolicy ?? new URL("ai.txt", site).href;
	const rules = _options.rules ?? DEFAULT_RULES;

	return `${rules}\n\nSitemap: ${sitemap}\n# AI usage policy: ${aiPolicy}\n`;
};

export const GET: APIRoute = ({ site }) => {
	return new Response(getRobotsTxt(site!), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};

export default function robotsTxt(options: RobotsTxtOptions = {}): AstroIntegration {
	return {
		name: "robots-txt",
		hooks: {
			"astro:config:setup": ({ injectRoute }) => {
				if (options.enabled === false) return;
				_options = options;
				injectRoute({
					pattern: "/robots.txt",
					entrypoint: fileURLToPath(new URL("./robotsTxt.ts", import.meta.url)),
				});
			},
		},
	};
}

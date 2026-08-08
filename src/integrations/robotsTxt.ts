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

const getRobotsTxt = (site: URL) => {
	const sitemap = _options.sitemap ?? new URL("sitemap-index.xml", site).href;
	const aiPolicy = _options.aiPolicy ?? new URL("ai.txt", site).href;
	const rules = _options.rules ?? "User-agent: *\nAllow: /";

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

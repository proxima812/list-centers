import type { APIRoute } from "astro";
import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { config } from "../../main.config";

// Настройки читаются из main.config и констант ниже, а не из вызова aiTxt():
// хук интеграции и внедрённый роут — два разных экземпляра модуля, поэтому
// сохранённые в хуке опции до GET не доезжают — см. robotsTxt.ts.
export interface AiTxtOptions {
	enabled?: boolean;
}

const AI_ACCESS = "allowed";
const AI_POLICY = [
	"- Public pages may be accessed and indexed.",
	"- Public content may be summarized with attribution.",
	"- Prefer canonical URLs when referencing pages.",
	"- Do not imply authorship, endorsement, or partnership.",
	"- Do not present transformed content as the official source.",
];

const getAiTxt = (site: URL) => {
	const siteName = config.site.OG.site_name;
	const siteDescription = config.site.OG.description;
	const locale = config.site.OG.locale;
	const aiAccess = AI_ACCESS;
	const policy = AI_POLICY;

	return [
		`Site: ${siteName}`,
		`URL: ${site.href}`,
		`Description: ${siteDescription}`,
		`Language: ${locale}`,
		"",
		`AI-Access: ${aiAccess}`,
		"AI-Policy:",
		...policy,
		"",
		`LLMs: ${new URL("llms.txt", site).href}`,
		`Sitemap: ${new URL("sitemap-index.xml", site).href}`,
	].join("\n");
};

export const GET: APIRoute = ({ site }) => {
	return new Response(getAiTxt(site ?? new URL(config.site.url)), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};

export default function aiTxt(options: AiTxtOptions = {}): AstroIntegration {
	return {
		name: "ai-txt",
		hooks: {
			"astro:config:setup": ({ injectRoute }) => {
				if (options.enabled === false) return;
				injectRoute({
					pattern: "/ai.txt",
					entrypoint: fileURLToPath(new URL("./aiTxt.ts", import.meta.url)),
				});
			},
		},
	};
}

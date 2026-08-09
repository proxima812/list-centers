import type { APIRoute } from "astro";
import type { AstroIntegration } from "astro";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../../main.config";

type LlmsEntry = {
	title: string;
	url: string;
	description?: string;
	section: string;
};

const DEFAULT_PAGES_DIR = path.resolve("src/pages");

const IGNORE_FILES = new Set([
	"404.astro",
	"500.astro",
	"llms.txt.ts",
	"robots.txt.ts",
	"sitemap.xml.ts",
	// Личный список из localStorage конкретного браузера: в статическом HTML
	// он всегда пуст, читать модели там нечего. Страница отдаёт noindex и
	// закрыта в robots.txt — здесь то же решение.
	"saved.astro",
]);

function normalizeSite(site: URL) {
	return new URL(site.href.endsWith("/") ? site.href : `${site.href}/`);
}

function isPublicPage(filePath: string) {
	const fileName = path.basename(filePath);

	if (IGNORE_FILES.has(fileName)) return false;
	if (fileName.startsWith("_")) return false;
	if (filePath.includes("[") || filePath.includes("]")) return false;

	return /\.(astro|md|mdx)$/.test(fileName);
}

function getRouteFromFile(filePath: string, pagesDir: string) {
	const relative = path.relative(pagesDir, filePath);
	const withoutExt = relative.replace(/\.(astro|md|mdx)$/, "");
	const normalized = withoutExt.split(path.sep).join("/");

	if (normalized === "index") return "/";
	if (normalized.endsWith("/index")) {
		return `/${normalized.replace(/\/index$/, "")}/`;
	}

	return `/${normalized}/`;
}

function titleFromRoute(route: string) {
	if (route === "/") return "Home";

	return route
		.replace(/^\/|\/$/g, "")
		.split("/")
		.at(-1)!
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSectionFromRoute(route: string) {
	const first = route.replace(/^\/|\/$/g, "").split("/")[0];

	if (!first) return "Overview";

	return first
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseFrontmatter(source: string) {
	const match = source.match(/^---\s*([\s\S]*?)\s*---/);
	if (!match) return {};

	const raw = match[1];

	const get = (key: string) => {
		const line = raw.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?$`, "m"));
		return line?.[1]?.trim();
	};

	return {
		title: get("title"),
		description: get("description"),
	};
}

async function walk(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) return walk(fullPath);
			if (entry.isFile()) return [fullPath];

			return [];
		}),
	);

	return files.flat();
}

async function getPageEntries(site: URL): Promise<LlmsEntry[]> {
	const pagesDir = _options.pagesDir ?? DEFAULT_PAGES_DIR;
	const files = await walk(pagesDir);

	const entries = await Promise.all(
		files.filter(isPublicPage).map(async (filePath) => {
			const route = getRouteFromFile(filePath, pagesDir);
			const source = await fs.readFile(filePath, "utf-8");
			const meta = parseFrontmatter(source);

			return {
				title: meta.title ?? titleFromRoute(route),
				section: getSectionFromRoute(route),
				url: new URL(route, site).href,
				...(meta.description ? { description: meta.description } : {}),
			};
		}),
	);

	return entries.sort((a, b) => a.url.localeCompare(b.url));
}

function renderSection(title: string, entries: LlmsEntry[]) {
	return [
		`## ${title}`,
		...entries.map((entry) => {
			const description = entry.description ? `: ${entry.description}` : "";
			return `- [${entry.title}](${entry.url})${description}`;
		}),
		"",
	];
}

async function getLlmsTxt(site: URL) {
	const baseSite = normalizeSite(site);
	const entries = await getPageEntries(baseSite);

	const grouped = entries.reduce<Record<string, LlmsEntry[]>>((acc, entry) => {
		acc[entry.section] ??= [];
		acc[entry.section].push(entry);
		return acc;
	}, {});

	const siteName = _options.siteName ?? config.site.OG.site_name;
	const siteDescription = _options.description ?? config.site.OG.description;
	const locale = _options.locale ?? config.site.OG.locale;

	return [
		`# ${siteName}`,
		"",
		`> ${siteDescription}`,
		"",
		`Canonical: ${baseSite.href}`,
		`Language: ${locale}`,
		`Sitemap: ${new URL("sitemap-index.xml", baseSite).href}`,
		`Robots: ${new URL("robots.txt", baseSite).href}`,
		`AI Policy: ${new URL("ai.txt", baseSite).href}`,
		"",
		...Object.entries(grouped).flatMap(([section, sectionEntries]) =>
			renderSection(section, sectionEntries),
		),
	]
		.join("\n")
		.trimEnd();
}

export const GET: APIRoute = async ({ site }) => {
	const baseSite = site ?? new URL(config.site.url);

	return new Response(await getLlmsTxt(baseSite), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

export interface LlmsTxtOptions {
	enabled?: boolean;
	pagesDir?: string;
	siteName?: string;
	description?: string;
	locale?: string;
}

let _options: LlmsTxtOptions = {};

export default function llmsTxt(options: LlmsTxtOptions = {}): AstroIntegration {
	return {
		name: "llms-txt",
		hooks: {
			"astro:config:setup": ({ injectRoute }) => {
				if (options.enabled === false) return;
				_options = options;
				injectRoute({
					pattern: "/llms.txt",
					entrypoint: fileURLToPath(new URL("./llmsTxt.ts", import.meta.url)),
				});
			},
		},
	};
}

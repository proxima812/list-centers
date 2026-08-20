import type { AstroIntegration } from "astro";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface IndexNowOptions {
	key?: string;
	siteUrl?: string;
	enabled?: boolean;
	dryRun?: boolean;
	maxUrls?: number;
	collections?: string[];
	sitemapFile?: string;
	waitMs?: number;
}

type Cache = Record<string, string>;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function withoutTrailingSlash(value: string) {
	return value.replace(/\/$/, "");
}

function hashContent(content: Buffer | string) {
	return crypto.createHash("sha1").update(content).digest("hex");
}

function safeReadJson<T>(filePath: string, fallback: T): T {
	try {
		if (!fs.existsSync(filePath)) return fallback;
		return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
	} catch {
		return fallback;
	}
}

function extractLocs(xml: string) {
	return [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)]
		.map((match) => match[1]?.trim())
		.filter(Boolean);
}

function urlToHtmlFile(url: string, outDir: string) {
	const pathname = new URL(url).pathname;

	if (pathname === "/") {
		return path.join(outDir, "index.html");
	}

	return path.join(outDir, pathname, "index.html");
}

function hashUrlTarget(url: string, outDir: string) {
	const htmlFile = urlToHtmlFile(url, outDir);

	if (!fs.existsSync(htmlFile)) return null;

	return hashContent(fs.readFileSync(htmlFile));
}

function shouldSkipUrl(url: string) {
	const pathname = new URL(url).pathname;

	return (
		pathname.includes("/404") ||
		pathname.includes("/500") ||
		pathname.endsWith(".xml") ||
		pathname.endsWith(".txt")
	);
}

function filterByCollections(urls: string[], site: string, collections?: string[]) {
	if (!collections?.length) return urls;

	return urls.filter((url) =>
		collections.some((collection) => {
			const clean = collection.replace(/^\/|\/$/g, "");
			return url === `${site}/${clean}/` || url.startsWith(`${site}/${clean}/`);
		}),
	);
}

function resolveSitemapPath(outDir: string, sitemapFile?: string) {
	const candidates = sitemapFile ? [sitemapFile] : ["sitemap-index.xml", "sitemap.xml"];

	for (const file of candidates) {
		const fullPath = path.join(outDir, file);
		if (fs.existsSync(fullPath)) return fullPath;
	}

	return null;
}

function readSitemapUrls(sitemapPath: string) {
	const sitemapDir = path.dirname(sitemapPath);
	const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

	if (!sitemapContent.includes("<sitemapindex")) {
		return extractLocs(sitemapContent);
	}

	return extractLocs(sitemapContent)
		.map((loc) => path.basename(new URL(loc).pathname))
		.flatMap((fileName) => {
			const fullPath = path.join(sitemapDir, fileName);

			if (!fs.existsSync(fullPath)) return [];

			return extractLocs(fs.readFileSync(fullPath, "utf-8"));
		});
}

export default function indexNow(options: IndexNowOptions = {}): AstroIntegration {
	let site: string | null = null;

	return {
		name: "astro-indexnow-sitemap",

		hooks: {
			"astro:config:setup": ({ config }) => {
				site = withoutTrailingSlash(options.siteUrl ?? config.site ?? "");
			},

			"astro:build:done": async ({ dir, logger }) => {
				if (options.enabled === false) return;
				if (!options.key) throw new Error("[indexnow] Missing key");
				if (!site) throw new Error("[indexnow] Missing site URL");

				const outDir = fileURLToPath(dir);
				const waitLimit = options.waitMs ?? 2000;
				const startedAt = Date.now();

				let sitemapPath: string | null = null;

				while (!sitemapPath && Date.now() - startedAt < waitLimit) {
					sitemapPath = resolveSitemapPath(outDir, options.sitemapFile);

					if (!sitemapPath) {
						await sleep(100);
					}
				}

				if (!sitemapPath) {
					logger.warn(`[indexnow] sitemap not found after ${waitLimit}ms, skipping`);
					return;
				}

				logger.info(`[indexnow] sitemap found: ${sitemapPath}`);

				const urls = readSitemapUrls(sitemapPath);

				if (!urls.length) {
					logger.warn("[indexnow] sitemap empty");
					return;
				}

				const filtered = filterByCollections(urls, site, options.collections);

				if (!filtered.length) {
					logger.info("[indexnow] no URLs after filters");
					return;
				}

				// Кэш живёт вне outDir: dist очищается каждой сборкой, и кэш
				// внутри него всегда был пуст — дельта-логика не работала, а
				// каждый деплой пинговал весь каталог. Заодно файл не деплоится.
				const cacheFile = path.resolve("node_modules/.cache/indexnow/cache.json");
				fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
				const prev = safeReadJson<Cache>(cacheFile, {});
				const next: Cache = {};
				const changed: string[] = [];

				for (const url of filtered) {
					if (shouldSkipUrl(url)) continue;

					const hash = hashUrlTarget(url, outDir);
					if (!hash) continue;

					next[url] = hash;

					if (prev[url] !== hash) {
						changed.push(url);
					}
				}

				fs.writeFileSync(cacheFile, JSON.stringify(next, null, 2));

				if (!changed.length) {
					logger.info("[indexnow] no changes");
					return;
				}

				const urlList = changed.slice(0, options.maxUrls ?? 10000);

				if (options.dryRun) {
					logger.info(`[indexnow] dryRun: ${urlList.length} URLs changed`);
					return;
				}

				try {
					const res = await fetch("https://api.indexnow.org/indexnow", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							host: new URL(site).host,
							key: options.key,
							keyLocation: `${site}/${options.key}.txt`,
							urlList,
						}),
					});

					if (!res.ok) {
						logger.warn(`[indexnow] request failed ${res.status}`);
						return;
					}

					logger.info(`[indexnow] submitted ${urlList.length} URLs`);
				} catch {
					logger.warn("[indexnow] network error");
				}
			},
		},
	};
}

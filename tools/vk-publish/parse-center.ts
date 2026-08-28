import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { parse as parseYaml } from "yaml";

import { centerRouteId, centerRouteNumber, isCenterRouteId } from "../../src/lib/center/routeId";

export const CENTERS_BASE_DIR = join(import.meta.dirname, "../../src/data/centers_formatted");

export interface CenterLocation {
	country?: string;
	city?: string;
	region?: string;
	district?: string;
}

export interface ParsedCenter {
	/** Astro content collection id — the file path relative to the base dir, without extension. */
	id: string;
	filePath: string;
	title: string;
	type?: string;
	category?: string;
	source?: string;
	summary?: string;
	location?: CenterLocation;
	/** Raw markdown body, frontmatter stripped. */
	body: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function cleanString(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

function parseLocation(value: unknown): CenterLocation | undefined {
	if (typeof value !== "object" || value === null) return undefined;
	const raw = value as Record<string, unknown>;

	const location: CenterLocation = {
		country: cleanString(raw.country),
		city: cleanString(raw.city),
		region: cleanString(raw.region),
		district: cleanString(raw.district),
	};

	const hasAnyField = Object.values(location).some((field) => field !== undefined);
	return hasAnyField ? location : undefined;
}

function findCenterFiles(dir: string): string[] {
	const files: string[] = [];

	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const stats = statSync(fullPath);

		if (stats.isDirectory()) {
			files.push(...findCenterFiles(fullPath));
			continue;
		}

		if (stats.isFile() && [".md", ".mdx"].includes(extname(entry))) {
			files.push(fullPath);
		}
	}

	return files;
}

function fileIdFromPath(filePath: string): string {
	const relativePath = relative(CENTERS_BASE_DIR, filePath).split("\\").join("/");
	return relativePath.replace(/\.(md|mdx)$/, "");
}

export function parseCenterFile(filePath: string): ParsedCenter {
	const raw = readFileSync(filePath, "utf-8");
	const match = FRONTMATTER_PATTERN.exec(raw);

	if (!match) {
		throw new Error(`Не удалось найти frontmatter в ${filePath}`);
	}

	const [, frontmatterText, body] = match;
	const frontmatter = (parseYaml(frontmatterText) ?? {}) as Record<string, unknown>;

	const title = cleanString(frontmatter.title);
	if (!title) {
		throw new Error(`У карточки ${filePath} нет title`);
	}

	return {
		id: fileIdFromPath(filePath),
		filePath,
		title,
		type: cleanString(frontmatter.type),
		category: cleanString(frontmatter.category),
		source: cleanString(frontmatter.source),
		summary: cleanString(frontmatter.summary),
		location: parseLocation(frontmatter.location),
		body: body.trim(),
	};
}

/**
 * Тот же алгоритм, что и `createCenterRouteIdMap` в `src/lib/center/centers.ts`, но
 * над обычным списком id вместо `CollectionEntry`, чтобы не тащить сюда
 * рантайм `astro:content`. Формат `tbk-N` и вся арифметика — из
 * `src/lib/center/routeId.ts`, слаг здесь не придумывается заново.
 */
export function buildRouteIdMap(ids: string[]): Map<string, string> {
	const sorted = [...ids].sort((a, b) => {
		const aNumber = centerRouteNumber(a);
		const bNumber = centerRouteNumber(b);

		if (aNumber >= 0 && bNumber >= 0) return aNumber - bNumber;
		return a.localeCompare(b, "en");
	});

	const used = new Set(ids.filter(isCenterRouteId));
	let nextNumber = 1;

	const map = new Map<string, string>();
	for (const id of sorted) {
		if (isCenterRouteId(id)) {
			map.set(id, id);
			continue;
		}

		while (used.has(centerRouteId(nextNumber))) nextNumber += 1;
		const routeId = centerRouteId(nextNumber);
		used.add(routeId);
		map.set(id, routeId);
	}

	return map;
}

export function loadAllCenters(): ParsedCenter[] {
	const files = findCenterFiles(CENTERS_BASE_DIR);
	return files.map(parseCenterFile);
}

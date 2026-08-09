/**
 * Разовая нормализация географии в карточках центров.
 *
 * Скрипт приводит `location` во frontmatter к справочникам из `src/data/geo`:
 * канонические имена субъектов РФ, районный уровень уезжает из `region` в
 * `district`, зарубежные регионы — в именительный падеж, города — из падежей и
 * уточнений в чистое имя. Поле `type` пересчитывается из страны, потому что
 * это и есть его единственный смысл.
 *
 * Запуск: `bun scripts/normalize-centers-geo.ts [--write]`.
 * Без `--write` печатает диффы и ничего не трогает.
 *
 * Скрипт идемпотентен: повторный прогон на нормализованных данных даёт ноль
 * изменений. Он оставлен в репозитории именно поэтому — им можно прогнать
 * пачку новых карточек, а не только исходные 399.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeRuRegion, suggestRuRegion } from "../src/data/geo/ruRegions";
import { getMacroRegion } from "../src/data/geo/macroRegions";
import { normalizeCity, normalizeForeignRegion, REGION_BY_CITY } from "../src/data/geo/places";

const DIR = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src", "data", "centers_formatted");
const RUSSIA = "Россия";
const WRITE = process.argv.includes("--write");

/** Значения `city`, которые на самом деле обозначают регион. */
const CITY_IS_REGION: Record<string, string> = {
	"Ида-Вирумаа": "Ида-Вирумаа",
	"Западно-Казахстанская область": "Западно-Казахстанская область",
};

interface Location {
	country?: string;
	region?: string;
	district?: string;
	city?: string;
	flag?: string;
}

function splitDistrict(region: string): { region: string; district?: string } {
	// «Баймакский район, Республика Башкортостан» — два уровня в одном поле.
	// Из-за таких записей Башкортостан в фильтрах был расколот на шесть узлов.
	const match = /^(.+?\s+район),\s*(.+)$/.exec(region);
	if (!match) return { region };
	return { region: match[2].trim(), district: match[1].trim() };
}

function normalizeLocation(location: Location, file: string): Location {
	const next: Location = { ...location };

	if (next.flag && next.flag.startsWith("Нет данных")) delete next.flag;

	// Крымское землячество: регион есть, страны нет.
	if (!next.country && next.region && normalizeRuRegion(next.region)) {
		next.country = RUSSIA;
	}

	let region = next.region?.trim() || undefined;
	let district = next.district?.trim() || undefined;

	if (region) {
		const split = splitDistrict(region);
		region = split.region;
		district = district ?? split.district;
	}

	let city = normalizeCity(next.city);
	if (city && CITY_IS_REGION[city] && !region) {
		region = CITY_IS_REGION[city];
		city = undefined;
	}

	if (next.country === RUSSIA) {
		if (!region && city) region = REGION_BY_CITY[city];
		const canonical = normalizeRuRegion(region);
		if (region && !canonical) {
			const hint = suggestRuRegion(region);
			throw new Error(
				`${file}: регион «${region}» не найден в справочнике субъектов РФ` +
					(hint ? `. Похоже на «${hint}»` : ""),
			);
		}
		region = canonical;
	} else if (next.country) {
		region = normalizeForeignRegion(next.country, region);
		if (!getMacroRegion(next.country)) {
			throw new Error(
				`${file}: страна «${next.country}» не отнесена ни к одному макрорегиону ` +
					`(src/data/geo/macroRegions.ts)`,
			);
		}
	}

	next.region = region;
	next.district = district;
	next.city = city;
	return next;
}

function deriveType(country: string | undefined): string {
	if (!country) return "Онлайн";
	return country === RUSSIA ? "Регион РФ" : "Зарубежный";
}

function renderLocation(location: Location): string[] {
	// Порядок полей — сверху вниз по иерархии: страна, регион, район, город.
	// В исходных карточках он был country/city/region, то есть читался задом
	// наперёд.
	const order: (keyof Location)[] = ["country", "region", "district", "city", "flag"];
	const lines = order
		.filter((key) => Boolean(location[key]))
		.map((key) => `  ${key}: ${location[key]}`);
	return lines.length > 0 ? ["location:", ...lines] : [];
}

let changed = 0;
const problems: string[] = [];

for (const file of readdirSync(DIR).filter((name) => name.endsWith(".mdx")).sort()) {
	const path = join(DIR, file);
	const raw = readFileSync(path, "utf8");
	const match = /^(---\r?\n)([\s\S]*?)(\r?\n---)/.exec(raw);
	if (!match) {
		problems.push(`${file}: нет frontmatter`);
		continue;
	}

	const lines = match[2].split(/\r?\n/);
	const before: string[] = [];
	const after: string[] = [];
	const location: Location = {};
	let typeLineIndex = -1;
	let section: "head" | "location" | "tail" = "head";

	for (const line of lines) {
		if (/^location:/.test(line)) {
			section = "location";
			continue;
		}
		if (section === "location") {
			const sub = /^\s+([A-Za-z_]+):\s*(.*)$/.exec(line);
			if (sub) {
				location[sub[1] as keyof Location] = sub[2].trim();
				continue;
			}
			section = "tail";
		}
		if (/^type:/.test(line) && section === "head") {
			typeLineIndex = before.length;
		}
		(section === "head" ? before : after).push(line);
	}

	let normalized: Location;
	try {
		normalized = normalizeLocation(location, file);
	} catch (error) {
		problems.push((error as Error).message);
		continue;
	}

	if (typeLineIndex >= 0) {
		before[typeLineIndex] = `type: ${deriveType(normalized.country)}`;
	}

	const nextFrontmatter = [...before, ...renderLocation(normalized), ...after]
		.filter((line, index, all) => !(line === "" && index === all.length - 1))
		.join("\n");

	if (nextFrontmatter === match[2]) continue;

	changed += 1;
	if (WRITE) {
		writeFileSync(path, raw.replace(match[0], `${match[1]}${nextFrontmatter}${match[3]}`));
	} else {
		console.log(`\n=== ${file}`);
		console.log(
			match[2]
				.split("\n")
				.map((line) => `- ${line}`)
				.join("\n"),
		);
		console.log(
			nextFrontmatter
				.split("\n")
				.map((line) => `+ ${line}`)
				.join("\n"),
		);
	}
}

console.log(`\n${WRITE ? "Изменено" : "Будет изменено"} карточек: ${changed}`);
if (problems.length > 0) {
	console.log(`\nНе удалось нормализовать (${problems.length}):`);
	for (const problem of problems) console.log(`  ${problem}`);
	process.exitCode = 1;
}

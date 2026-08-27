#!/usr/bin/env node
// Карта состояния каталога: что чинить в режиме А и где дыры для режима Б.
// Считает по файлам, ничего не меняет. Запуск:
//   node .agents/skills/tatarverse-research/scripts/audit.mjs
//   node .agents/skills/tatarverse-research/scripts/audit.mjs --country Узбекистан
//   node .agents/skills/tatarverse-research/scripts/audit.mjs --json

import fs from "node:fs";
import path from "node:path";

const CARDS = "src/data/centers_formatted";
const EN = "src/data/centers_i18n/en";
const MACRO = "src/data/geo/macroRegions.ts";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlyCountry = args[args.indexOf("--country") + 1];

const field = (fm, key) => (fm.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m")) || [, ""])[1].trim();

function readCards() {
	return fs
		.readdirSync(CARDS)
		.filter((f) => f.endsWith(".mdx"))
		.map((file) => {
			const raw = fs.readFileSync(path.join(CARDS, file), "utf8");
			const fm = raw.split("---")[1] ?? "";
			const body = raw.split("---").slice(2).join("---");

			return {
				id: file.replace(/\.mdx$/, ""),
				country: field(fm, "country") || "(нет страны)",
				city: field(fm, "city"),
				category: field(fm, "category"),
				summary: field(fm, "summary"),
				source: field(fm, "source"),
				hasLinks: body.includes("## Ссылки"),
				hasContacts: body.includes("## Контакты"),
				hasMisc: body.includes("## Прочее"),
				// ОГРН и ИНН в «Прочем» - реестровые данные, их не удалять
				miscHasRegistry: /ОГРН|ИНН/.test(body),
				length: body.trim().length,
				hasEn: fs.existsSync(path.join(EN, file)),
			};
		});
}

const cards = readCards();
const scoped = onlyCountry ? cards.filter((c) => c.country === onlyCountry) : cards;

const byCountry = new Map();
for (const c of scoped) {
	const row = byCountry.get(c.country) ?? { total: 0, noLinks: 0, noCity: 0, noEn: 0, stub: 0 };
	row.total += 1;
	if (!c.hasLinks) row.noLinks += 1;
	if (!c.city) row.noCity += 1;
	if (!c.hasEn) row.noEn += 1;
	if (c.length < 600) row.stub += 1;
	byCountry.set(c.country, row);
}

// Страны, заведённые в реестре макрорегионов, но без единой карточки.
const registered = [
	...fs.readFileSync(MACRO, "utf8").matchAll(/^\s*"?([А-ЯЁA-Z][^":\n]*)"?\s*:\s*"/gm),
].map((m) => m[1].trim());
const emptyCountries = registered.filter((c) => !byCountry.has(c));

const totals = [
	["карточек всего", scoped.length],
	["без раздела «Ссылки»", scoped.filter((c) => !c.hasLinks).length],
	["без раздела «Контакты»", scoped.filter((c) => !c.hasContacts).length],
	["без города", scoped.filter((c) => !c.city).length],
	["без summary", scoped.filter((c) => !c.summary).length],
	["без английского перевода", scoped.filter((c) => !c.hasEn).length],
	["заглушек (тело < 600 симв.)", scoped.filter((c) => c.length < 600).length],
	["с секцией «Прочее»", scoped.filter((c) => c.hasMisc).length],
	["  из них с ОГРН/ИНН", scoped.filter((c) => c.hasMisc && c.miscHasRegistry).length],
	["source = голая главная ВКТ", scoped.filter((c) => /^https?:\/\/tatar-congress\.org\/?$/.test(c.source)).length],
];

if (asJson) {
	console.log(
		JSON.stringify(
			{ totals: Object.fromEntries(totals), byCountry: Object.fromEntries(byCountry), emptyCountries, cards: scoped },
			null,
			2,
		),
	);
	process.exit(0);
}

const pct = (n) => (scoped.length ? ` ${String(Math.round((n / scoped.length) * 100)).padStart(3)}%` : "");

console.log(onlyCountry ? `\nКаталог: ${onlyCountry}\n` : "\nКаталог целиком\n");
for (const [label, v] of totals) {
	console.log(`  ${label.padEnd(30)} ${String(v).padStart(4)}${label === "карточек всего" ? "" : pct(v)}`);
}

console.log("\nПо странам (сортировка по числу заглушек без ссылок)\n");
console.log(`  ${"страна".padEnd(24)} ${"всего".padStart(5)} ${"без ссылок".padStart(11)} ${"без города".padStart(11)} ${"без EN".padStart(7)}`);
const rows = [...byCountry.entries()].sort((a, b) => b[1].noLinks - a[1].noLinks || b[1].total - a[1].total);
for (const [country, r] of rows.slice(0, onlyCountry ? 1 : 25)) {
	console.log(
		`  ${country.padEnd(24)} ${String(r.total).padStart(5)} ${String(r.noLinks).padStart(11)} ${String(r.noCity).padStart(11)} ${String(r.noEn).padStart(7)}`,
	);
}
if (!onlyCountry && rows.length > 25) console.log(`  ... ещё стран: ${rows.length - 25}`);

if (!onlyCountry) {
	console.log(`\nСтраны в реестре макрорегионов без единой карточки: ${emptyCountries.length}`);
	if (emptyCountries.length) console.log(`  ${emptyCountries.join(", ")}`);
	console.log(
		"\nПодсказка: --country <Страна> сузит отчёт, --json отдаст машинный вид.\n" +
			"Секцию «Прочее» с ОГРН не удалять - это реестровые данные.\n",
	);
}

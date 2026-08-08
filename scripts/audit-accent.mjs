// Разовый аудит контраста для новых пресетов акцента.
// Считает те же пары, что перечислены в DESIGN.md как обязательные:
// accent на своём фоне, accent-foreground на accent, vivid как дисплейный
// кегль, и связку accent-soft / accent-soft-foreground, которая собирается
// через color-mix в oklab — её приходится воспроизводить руками.

const hsl = (h, s, l) => {
	s /= 100;
	l /= 100;
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return [f(0), f(8), f(4)];
};

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
const ratio = (x, y) => {
	const a = lum(x);
	const b = lum(y);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

// ── oklab, чтобы повторить color-mix(in oklab, …) из CSS ────────────────────
const srgbToOklab = ([r, g, b]) => {
	const [R, G, B] = [toLin(r), toLin(g), toLin(b)];
	const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
	const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
	const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
};
const oklabToSrgb = ([L, a, bb]) => {
	const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;
	const lin = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
	return lin.map((c) => {
		const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
		return Math.min(1, Math.max(0, v));
	});
};
const mix = (c1, c2, p) => {
	const A = srgbToOklab(c1);
	const B = srgbToOklab(c2);
	return oklabToSrgb(A.map((v, i) => v * p + B[i] * (1 - p)));
};
const okL = (c) => srgbToOklab(c)[0] * 100;

const f = (n) => n.toFixed(2);
const mark = (v, floor) => (v >= floor ? "ok " : "FAIL");

export function audit(name, p) {
	const bg = hsl(...p.bg);
	const fg = hsl(...p.fg);
	const accent = hsl(...p.accent);
	const accentFg = hsl(...p.accentFg);
	const vivid = hsl(...p.vivid);
	const soft = mix(accent, bg, p.softPct);
	const softFg = mix(accent, fg, 0.75);

	const rows = [
		["accent на фоне", ratio(accent, bg), 4.5],
		["accent-fg на accent", ratio(accentFg, accent), 4.5],
		["vivid на фоне (дисплей)", ratio(vivid, bg), 3.0],
		["soft-fg на accent-soft", ratio(softFg, soft), 4.5],
	];
	if (p.subtleFg && p.subtle) {
		rows.push(["subtle-fg на bg-subtle", ratio(hsl(...p.subtleFg), hsl(...p.subtle)), 4.5]);
		rows.push(["subtle-fg на фоне", ratio(hsl(...p.subtleFg), bg), 4.5]);
	}
	if (p.surface) rows.push(["ΔL фон→поверхн. (oklch)", okL(hsl(...p.surface)) - okL(bg), 8.0]);

	const bad = rows.filter(([, v, floor]) => v < floor);
	console.log(`\n── ${name} ${bad.length ? "❌" : "✅"}`);
	for (const [label, v, floor] of rows) {
		console.log(`   ${mark(v, floor)} ${label.padEnd(26)} ${f(v)} (нужно ≥${floor})`);
	}
	return bad.length === 0;
}

// Лестница поверхностей — несущее правило системы: `muted` лежит между
// `background` и `surface`. Полоса секции утоплена относительно страницы,
// карточка на полосе приподнята. Обратный порядок схлопывает каталог: именно
// так карточки центров однажды стали одного цвета с полосой списка.
export function ladder(name, p) {
	const isDark = name.endsWith("dark");
	const L = (token) => okL(hsl(...p[token]));
	const order = isDark
		? ["background", "muted", "surface", "surface-muted", "subtle"]
		: ["subtle", "muted", "surface-muted", "background", "surface"];

	const rows = [];
	for (let i = 0; i < order.length - 1; i += 1) {
		const [a, b] = [order[i], order[i + 1]];
		rows.push([`порядок ${a}→${b}`, L(b) - L(a), 0.01]);
	}
	// Карточка каталога на полосе списка — та самая пара, ради которой всё это.
	rows.push(["ΔL карточка на полосе", Math.abs(L("surface") - L("muted")), 4.0]);
	rows.push(["border-muted на surface", ratio(hsl(...p["border-muted"]), hsl(...p.surface)), 1.28]);
	rows.push(["border на surface", ratio(hsl(...p.border), hsl(...p.surface)), 1.5]);
	// depth-100 несёт кольцо карточки: обязан читаться и на surface, и на muted.
	rows.push(["depth-100 на surface", ratio(hsl(...p["depth-100"]), hsl(...p.surface)), 1.3]);
	rows.push(["depth-100 на полосе", ratio(hsl(...p["depth-100"]), hsl(...p.muted)), 1.22]);
	// Тусклый текст обязан проходить на всех заливках своей палитры, а не
	// только на странице: subtle-fg садится и в тулбар, и в футер.
	for (const fill of ["surface", "surface-muted", "muted", "subtle"]) {
		rows.push([`subtle-fg на ${fill}`, ratio(hsl(...p["subtle-foreground"]), hsl(...p[fill])), 4.5]);
		rows.push([`muted-fg на ${fill}`, ratio(hsl(...p["muted-foreground"]), hsl(...p[fill])), 4.5]);
	}

	const bad = rows.filter(([, v, floor]) => v < floor);
	if (bad.length) {
		for (const [label, v, floor] of bad) {
			console.log(`   FAIL ${label.padEnd(26)} ${f(v)} (нужно ≥${floor})`);
		}
	}
	return bad.length === 0;
}

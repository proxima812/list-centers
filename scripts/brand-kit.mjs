/**
 * Собирает бренд-кит: одна HTML-страница со всеми шестью пресетами акцента в
 * обеих темах, и печатает её в PDF через headless Chrome.
 *
 * Запуск: `bun run brand-kit` (положит brand-kit.pdf в корень проекта).
 *
 * Значения НЕ дублируются: скрипт читает `src/styles/tailwind.css` и
 * `src/styles/palettes/*.css` и переписывает их селекторы из `:root[...]` в
 * `[data-preset][data-scheme]`, чтобы двенадцать состояний уживались на одной
 * странице. Копия палитры в генераторе означала бы, что бренд-кит расходится с
 * сайтом ровно в тот день, когда кто-то поправит токен, — этот проект уже
 * ловил такое на скрипте контраст-аудита.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const styles = join(root, "src/styles");

const PRESETS = ["green", "blue", "violet", "red", "orange", "pink"];
const PRESET_LABELS = {
	green: "Җаным Яшел",
	blue: "Кадерле Зәнгәр",
	violet: "Яна Шәмәха",
	red: "Утлы Кызыл",
	orange: "Җылы Наранҗы",
	pink: "Иркә Алсу",
};

/** Комментарии выкидываем до разбора: и `@theme`, и `.dark` встречаются в
 *  пояснительных шапках этих файлов, и поиск по подстроке попадал туда. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Вытащить тело блока по его открывающему селектору, считая скобки. */
function block(rawCss, opener) {
	const css = stripComments(rawCss);
	const start = css.indexOf(opener);
	if (start === -1) return "";
	let depth = 0;
	let i = css.indexOf("{", start);
	const from = i + 1;
	for (; i < css.length; i += 1) {
		if (css[i] === "{") depth += 1;
		else if (css[i] === "}") {
			depth -= 1;
			if (depth === 0) return css.slice(from, i);
		}
	}
	return "";
}

/** Только объявления --color-* и --radius-*; всё остальное бренд-киту не нужно. */
function tokensOf(body) {
	return [...body.matchAll(/(--(?:color|radius)-[a-z0-9-]+)\s*:\s*([^;]+);/g)]
		.map(([, name, value]) => `${name}: ${value.trim().replace(/\s+/g, " ")};`)
		.join("\n      ");
}

const tailwind = readFileSync(join(styles, "tailwind.css"), "utf8");
const lightBase = tokensOf(block(tailwind, "@theme"));
const darkBase = tokensOf(block(tailwind, ".dark {"));

const presetCss = PRESETS.map((name) => {
	const css = readFileSync(join(styles, "palettes", `${name}.css`), "utf8");
	const light = tokensOf(block(css, `:root[data-accent="${name}"]`));
	const dark = tokensOf(block(css, `:root.dark[data-accent="${name}"]`));
	return `
    [data-preset="${name}"][data-scheme="light"] {
      ${light}
    }
    [data-preset="${name}"][data-scheme="dark"] {
      ${dark}
    }`;
}).join("\n");

const fontPath = join(root, "public/fonts/tatarverse-sans.woff2");
const fontFace = existsSync(fontPath)
	? `@font-face {
      font-family: "Tatarverse Sans";
      src: url("file://${fontPath}") format("woff2");
      font-display: block;
    }`
	: "";

const swatch = (token, label, note = "") => `
  <div class="swatch">
    <div class="chip" style="background: var(${token})"></div>
    <div class="meta">
      <b>${label}</b>
      <code data-token="${token}"></code>
      ${note ? `<span class="note">${note}</span>` : ""}
    </div>
  </div>`;

const panel = (preset, scheme) => `
<section class="kit" data-preset="${preset}" data-scheme="${scheme}">
  <header class="kit-head">
    <span class="dot" style="background: var(--color-accent)"></span>
    <h3>${scheme === "light" ? "Светлая" : "Тёмная"}</h3>
  </header>

  <h4>Акцент</h4>
  <div class="grid">
    ${swatch("--color-accent", "accent", "сигнал: фокус, активное")}
    ${swatch("--color-accent-vivid", "accent-vivid", "только дисплейный кегль")}
    ${swatch("--color-accent-glow", "accent-glow", "ореол героя")}
    ${swatch("--color-accent-soft", "accent-soft", "тихая плашка")}
  </div>

  <h4>Лестница поверхностей</h4>
  <div class="grid ladder">
    ${swatch("--color-background", "background")}
    ${swatch("--color-muted", "muted")}
    ${swatch("--color-surface", "surface")}
    ${swatch("--color-surface-muted", "surface-muted", "выводится")}
    ${swatch("--color-subtle", "subtle")}
  </div>

  <h4>Чернила и структура</h4>
  <div class="grid">
    ${swatch("--color-foreground", "foreground")}
    ${swatch("--color-muted-foreground", "muted-foreground")}
    ${swatch("--color-subtle-foreground", "subtle-foreground")}
    ${swatch("--color-border", "border", "выводится")}
  </div>

  <h4>Пример интерфейса</h4>
  <div class="demo">
    <div class="card">
      <div class="card-meta">
        <span class="flag">🇰🇿</span> Алматы ⧁ Казахстан
        <span class="heart">♥</span>
      </div>
      <div class="card-title">Татаро-башкирский культурный центр</div>
      <div class="card-sum">Пример карточки каталога: заголовок, тихая мета и чип типа.</div>
      <div class="row">
        <span class="chip-meta">Зарубежный</span>
        <span class="chip-accent">Активный фильтр</span>
      </div>
    </div>
    <div class="row">
      <span class="btn btn-default">Кнопка</span>
      <span class="btn btn-outline">Контур</span>
      <span class="btn btn-ghost">Призрак</span>
    </div>
    <div class="row radii">
      <span class="r r-micro">micro</span>
      <span class="r r-control">control</span>
      <span class="r r-card">card</span>
      <span class="r r-catalog">catalog</span>
    </div>
  </div>
</section>`;

const page = (preset) => `
<article class="sheet">
  <div class="sheet-head">
    <h2>${preset} <small>${PRESET_LABELS[preset]}</small></h2>
    <span class="pill">tatarverse · дизайн-система</span>
  </div>
  <div class="pair">
    ${panel(preset, "light")}
    ${panel(preset, "dark")}
  </div>
</article>`;

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>tatarverse — бренд-кит</title>
<style>
  ${fontFace}

  /* Каскад повторяет сайт: @theme лежит на :root и достаётся обеим темам,
     .dark переопределяет только часть токенов, остальные наследует. Если
     раздать эти блоки двум взаимоисключающим селекторам, тёмная панель
     останется без выводимых токенов (border, surface-muted, depth-100) —
     они объявлены один раз, в @theme, и в .dark не повторяются. */
  .kit {
      ${lightBase}
  }
  /* Нейтральный фолбэк .dark; каждый пресет ниже переопределяет его целиком. */
  .kit[data-scheme="dark"] {
      ${darkBase}
  }
  ${presetCss}

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Tatarverse Sans", ui-sans-serif, system-ui, sans-serif;
    background: #ffffff;
    color: #1d1d1d;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet { padding: 9mm 10mm; break-after: page; }
  .sheet:last-of-type { break-after: auto; }
  .sheet-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 4mm; }
  .sheet-head h2 { font-size: 24px; letter-spacing: -0.02em; text-transform: capitalize; }
  .sheet-head small { font-weight: 500; font-size: 15px; opacity: 0.55; margin-left: 8px; }
  .pill { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }

  .kit {
    background: var(--color-background);
    color: var(--color-foreground);
    border: 1px solid rgba(128,128,128,0.35);
    border-radius: 12px;
    padding: 4.5mm;
  }
  .kit-head { display: flex; align-items: center; gap: 7px; margin-bottom: 3mm; }
  .kit-head h3 { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.65; }
  .dot { width: 13px; height: 13px; border-radius: 50%; }
  .kit h4 {
    font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--color-subtle-foreground); margin: 3mm 0 1.5mm;
  }

  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5mm 2.5mm; }
  .ladder { grid-template-columns: repeat(3, 1fr); }
  .swatch { display: flex; gap: 6px; align-items: center; min-width: 0; }
  /* Обводка образца намеренно не из палитры: белая карточка на почти белой
     странице иначе теряет границу, и в светлой теме половина лестницы
     выглядела пустым местом. */
  .chip {
    width: 21px; height: 21px; flex: none;
    border-radius: 7px; box-shadow: inset 0 0 0 1px rgba(128,128,128,0.45);
  }
  .meta { min-width: 0; line-height: 1.25; }
  .meta b { display: block; font-size: 9.5px; }
  .meta code {
    display: block; font-family: ui-monospace, Menlo, monospace; font-size: 8px;
    color: var(--color-muted-foreground); white-space: nowrap;
  }
  .meta .note { font-size: 7.5px; color: var(--color-subtle-foreground); }

  .demo { display: flex; flex-direction: column; gap: 2mm; }
  .card {
    background: var(--color-surface); color: var(--color-surface-foreground);
    border-radius: var(--radius-catalog); padding: 3mm;
    box-shadow: inset 0 0 0 1px var(--color-depth-100);
    position: relative;
  }
  .card-meta { font-size: 8.5px; color: var(--color-muted-foreground); display: flex; gap: 5px; align-items: center; }
  .heart { margin-left: auto; color: var(--color-favorite); font-size: 12px; }
  .card-title { font-size: 12px; font-weight: 700; margin: 1.5mm 0 0.8mm; letter-spacing: -0.01em; }
  .card-sum { font-size: 9px; color: var(--color-muted-foreground); }
  .row { display: flex; gap: 2mm; align-items: center; flex-wrap: wrap; margin-top: 2mm; }
  .chip-meta {
    background: var(--color-surface-muted); color: var(--color-muted-foreground);
    border-radius: var(--radius-micro); padding: 3px 7px; font-size: 8.5px; font-weight: 500;
  }
  .chip-accent {
    background: var(--color-accent); color: var(--color-accent-foreground);
    border-radius: 999px; padding: 3px 9px; font-size: 8.5px; font-weight: 600;
  }
  .btn {
    border-radius: var(--radius-control); padding: 5px 12px;
    font-size: 10px; font-weight: 500;
  }
  .btn-default { background: var(--color-primary); color: var(--color-primary-foreground); }
  .btn-outline { border: 1px solid var(--color-border); color: var(--color-foreground); }
  .btn-ghost { color: var(--color-muted-foreground); }
  .radii .r {
    background: var(--color-muted); color: var(--color-muted-foreground);
    font-size: 7.5px; padding: 7px 6px; text-align: center; flex: 1;
  }
  .r-micro { border-radius: var(--radius-micro); }
  .r-control { border-radius: var(--radius-control); }
  .r-card { border-radius: var(--radius-card); }
  .r-catalog { border-radius: var(--radius-catalog); }

  .cover { padding: 34mm 14mm; break-after: page; }
  .cover h1 { font-size: 52px; letter-spacing: -0.03em; }
  .cover p { margin-top: 5mm; max-width: 150mm; font-size: 12px; line-height: 1.65; color: #444; }
  .cover ul { margin: 6mm 0 0 5mm; font-size: 11px; line-height: 1.9; color: #444; }
  @page { size: A4 landscape; margin: 0; }
</style>
</head>
<body>
<div class="cover">
  <h1>tatarverse</h1>
  <p>
    Бренд-кит: шесть пресетов акцента в светлой и тёмной теме. Презентацию
    выбирает посетитель — тема, акцент и тумблер анимаций живут в меню внешнего
    вида, — поэтому любая поверхность обязана пережить все двенадцать сочетаний.
  </p>
  <ul>
    <li>Акцент — сигнал: слово в заголовке, фокус, активный фильтр. Нейтрали несут каталог.</li>
    <li>Никаких литеральных hex в коде: только семантические токены.</li>
    <li>Радиус — часть пресета, а не константа: три регистра формы на шесть палитр.</li>
    <li>Границы, surface-muted и кольцо карточки выводятся из своей поверхности, а не пишутся руками.</li>
    <li>Значения ниже прочитаны из src/styles — этот документ не хранит собственной копии палитры.</li>
  </ul>
</div>
${PRESETS.map(page).join("\n")}
<script>
  // Подпись берём с самого образца, а не из custom property: border,
  // surface-muted, depth-100 и accent-soft собираются через color-mix, и в
  // переменной лежит формула, а не цвет.
  //
  // Значение при этом не разбираем строкой. Chrome отдаёт вычисленный
  // color-mix в форме oklab(0.9577 4.4e-05 1.9e-05), и парсер чисел на такой
  // записи выдавал «#NaNNaNNaN». Вместо этого закрашиваем пиксель на канве и
  // читаем его обратно — движок сам приводит любой валидный CSS-цвет к RGB.
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const toHex = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  };
  for (const code of document.querySelectorAll("code[data-token]")) {
    const chip = code.closest(".swatch").querySelector(".chip");
    code.textContent = toHex(getComputedStyle(chip).backgroundColor);
  }
</script>
</body>
</html>`;

const htmlPath = join(root, "brand-kit.html");
const pdfPath = join(root, "brand-kit.pdf");
writeFileSync(htmlPath, html, "utf8");
console.log(`HTML: ${htmlPath}`);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(chrome)) {
	console.log("Chrome не найден — PDF не собран, но HTML можно открыть и напечатать вручную.");
	process.exit(0);
}

execFileSync(
	chrome,
	[
		"--headless",
		"--disable-gpu",
		"--no-pdf-header-footer",
		"--allow-file-access-from-files",
		`--print-to-pdf=${pdfPath}`,
		`file://${htmlPath}`,
	],
	{ stdio: "inherit" },
);
console.log(`PDF:  ${pdfPath}`);

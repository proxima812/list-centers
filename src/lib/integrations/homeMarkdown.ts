import fs from "node:fs";
import path from "node:path";


const CENTERS_DIR = path.resolve("src/data/centers_formatted");

type CenterCounts = {
	centers: number;
	countries: number;
	regions: number;
};

function readCenterCounts(): CenterCounts {
	let files: string[] = [];

	try {
		files = fs.readdirSync(CENTERS_DIR).filter((name) => name.endsWith(".mdx"));
	} catch {
		return { centers: 0, countries: 0, regions: 0 };
	}

	const countries = new Set<string>();
	const regions = new Set<string>();

	for (const name of files) {
		const source = fs.readFileSync(path.join(CENTERS_DIR, name), "utf8");
		const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
		if (!frontmatter) continue;

		const location = frontmatter.match(/^location:\s*\n((?:[ \t]+.*\n?)*)/m)?.[1];
		if (!location) continue;

		const country = location.match(/^\s+country:\s*(.+?)\s*$/m)?.[1];
		const region = location.match(/^\s+region:\s*(.+?)\s*$/m)?.[1];

		if (country) countries.add(country.replace(/^["']|["']$/g, ""));
		if (region) regions.add(region.replace(/^["']|["']$/g, ""));
	}

	return { centers: files.length, countries: countries.size, regions: regions.size };
}

export function buildHomeMarkdown(siteUrl: string): string {
	const { centers, countries, regions } = readCenterCounts();
	const base = siteUrl.replace(/\/$/, "");

	return `# Татары, башкиры и крымские татары — каталог центров и сообществ

> tatarverse помогает найти татарские, башкирские и крымскотатарские центры по всему миру: для новых знакомств, друзей, отношений, изучения языка, восстановления связи с культурой и поддержки общих ценностей.

- **URL**: ${base}/
- **Язык**: ru (English: ${base}/en/)

---

## Каталог в цифрах

- Центров, сообществ и инициатив: ${centers}
- Стран: ${countries}
- Регионов: ${regions}

Найдите ближайший центр или тех, кто далеко: прийти на событие, познакомиться с
людьми, найти друзей, изучать или восстанавливать язык, развивать культуру и
поддерживать общие ценности.

## Разделы

- [Каталог центров](${base}/centers) — карточки центров по странам, регионам, городам и категориям
- [Статистика](${base}/stats) — покрытие каталога по странам и регионам
- [Посты](${base}/posts) — редакционные заметки о культуре, языке и сообществах
- [Переводы](${base}/translations) — статус перевода сайта и как помочь
- [Источники](${base}/sources) — откуда берутся данные каталога
- [Благодарности](${base}/thanks) — кто помогает проекту
- [Политика](${base}/policy) — политика конфиденциальности

## Машиночитаемые версии

- [/centers.md](${base}/centers.md) — весь каталог центров в markdown
- [/posts.md](${base}/posts.md) — все посты в markdown
- [/llms.txt](${base}/llms.txt) — карта сайта для языковых моделей
- [/sitemap-index.xml](${base}/sitemap-index.xml) — карта сайта
`;
}

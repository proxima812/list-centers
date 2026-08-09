import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { getMacroRegion } from "./data/geo/macroRegions";
import { normalizeRuRegion, suggestRuRegion } from "./data/geo/ruRegions";

const CENTER_CATEGORIES = [
	"Татарский",
	"Татаро-Башкирский",
	"Башкирский",
	"Крымотатарский",
] as const;

const CENTER_TYPES = ["Регион РФ", "Зарубежный", "Онлайн"] as const;
const PROJECT_CATEGORIES = [
	"Общепит",
	"Бизнес",
	"Медиа",
	"Образование",
] as const;

const CenterCategorySchema = z.enum(CENTER_CATEGORIES);
const CenterTypeSchema = z.enum(CENTER_TYPES);
const ProjectCategorySchema = z.enum(PROJECT_CATEGORIES);

const RUSSIA = "Россия";
// Строка-заглушка из старого импорта. Раньше её вырезал руками рендер
// карточки, теперь она не проходит валидацию и до рендера не доезжает.
const NO_DATA = /^нет данных\.?$/i;

const CenterLocationSchema = z
	.object({
		flag: z.string().optional(),
		city: z.string().optional(),
		country: z.string().optional(),
		region: z.string().optional(),
		/**
		 * Районный уровень. Заведён отдельным полем, потому что раньше районы
		 * жили внутри `region` («Баймакский район, Республика Башкортостан») и
		 * раскалывали субъект на несколько независимых фильтров.
		 */
		district: z.string().optional(),
	})
	.strict();

/**
 * Жёсткая проверка географии для русской коллекции — источника фасетов.
 *
 * Фильтр «Регион» строится по значению `region`, поэтому любая опечатка не
 * ломает страницу, а тихо добавляет в панель лишнюю строку с одной карточкой.
 * Отловить это глазами невозможно: до нормализации в каталоге одновременно
 * жили Югра через дефис и через тире, «Республика Удмуртия» и «Камчатская
 * область». Дешевле уронить сборку.
 */
function validateCenterLocation(
	location: z.infer<typeof CenterLocationSchema> | undefined,
	ctx: z.RefinementCtx,
) {
	if (!location) return;

	for (const [key, value] of Object.entries(location)) {
		if (typeof value === "string" && NO_DATA.test(value.trim())) {
			ctx.addIssue({
				code: "custom",
				path: ["location", key],
				message: `«${value}» — это заглушка, а не значение. Уберите поле целиком.`,
			});
		}
	}

	const { country, region } = location;
	if (!country) return;

	if (country === RUSSIA) {
		if (region && !normalizeRuRegion(region)) {
			const hint = suggestRuRegion(region);
			ctx.addIssue({
				code: "custom",
				path: ["location", "region"],
				message:
					`«${region}» не найден в справочнике субъектов РФ ` +
					`(src/data/geo/ruRegions.ts)` +
					(hint ? `. Похоже на «${hint}»` : "") +
					`. Добавьте написание в aliases нужного субъекта или исправьте карточку.`,
			});
		}
		return;
	}

	if (!getMacroRegion(country)) {
		ctx.addIssue({
			code: "custom",
			path: ["location", "country"],
			message:
				`страна «${country}» не отнесена ни к одному макрорегиону ` +
				`(src/data/geo/macroRegions.ts) — без этого она не попадёт в фильтры.`,
		});
	}
}

const CenterGeoSchema = z
	.object({
		lat: z.number(),
		lng: z.number(),
		address: z.string().min(1).optional(),
		mapUrl: z.url().optional(),
		precision: z.enum(["exact", "city", "region"]).default("exact"),
	})
	.strict();

const CenterSchema = z
	.object({
		title: z.string().min(1),
		pubDate: z.string().optional(),
		type: CenterTypeSchema.optional(),
		category: CenterCategorySchema.optional(),
		source: z.url().optional(),
		summary: z.string().optional(),
		location: CenterLocationSchema.optional(),
		geo: CenterGeoSchema.optional(),
	})
	.strict();

/**
 * Русская коллекция — единственный источник географии каталога, поэтому
 * валидация висит только на ней. Переводы (`centersEn`) хранят локализованные
 * подписи вроде `country: Russia`, `region: Saint Petersburg`; гонять их через
 * справочник субъектов бессмысленно, а фасеты они всё равно не формируют —
 * география берётся из русской карточки по общему id.
 */
const SourceCenterSchema = CenterSchema.superRefine((data, ctx) => {
	validateCenterLocation(data.location, ctx);
});

const PostSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
		pubDate: z.coerce.date(),
		author: z.string().min(1),
		tags: z.array(z.string()).default([]),
		category: z.string().min(1),
		ogImage: z.string().optional(),
	})
	.strict()
	.transform((data) => ({
		...data,
		publishedDate: data.pubDate,
	}));

const ProjectSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
		category: ProjectCategorySchema,
		location: z.string().min(1).optional(),
		logo: z.string().min(1).optional(),
		image: z.string().min(1).optional(),
		instagram: z.url().optional(),
		website: z.url().optional(),
		orderLabel: z.string().min(1).optional(),
		orderUrl: z.url().optional(),
		tags: z.array(z.string()).default([]),
		sortOrder: z.number().default(0),
	})
	.strict();

const ThanksSchema = z
  .object({
    name: z.string().min(1).optional(),
    instagram: z.url().optional(),
    telegram: z.url().optional(),
    social: z.url().optional(),
    sortOrder: z.number().default(0),
  })
  .strict();

const centers = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/centers_formatted",
	}),
	schema: SourceCenterSchema,
});

const centersEn = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/centers_i18n/en",
	}),
	schema: CenterSchema,
});

const posts = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/posts",
	}),
	schema: PostSchema,
});

const projects = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/projects",
	}),
	schema: ProjectSchema,
});

const thanks = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/thanks",
	}),
	schema: ThanksSchema,
});

export const collections = {
	centers,
	centersEn,
	posts,
	projects,
	thanks,
};

export type CenterCategory = z.infer<typeof CenterCategorySchema>;
export type CenterType = z.infer<typeof CenterTypeSchema>;
export type CenterLocation = z.infer<typeof CenterLocationSchema>;
export type CenterData = z.infer<typeof CenterSchema>;
export type PostData = z.infer<typeof PostSchema>;
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;
export type ProjectData = z.infer<typeof ProjectSchema>;
export type ThanksData = z.infer<typeof ThanksSchema>;

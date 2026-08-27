import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { getMacroRegion } from "./data/geo/macroRegions";
import { normalizeRuRegion, RUSSIA, suggestRuRegion } from "./data/geo/ruRegions";

const CENTER_CATEGORIES = [
	"Татарский",
	"Татаро-Башкирский",
	"Башкирский",
	"Крымотатарский",
] as const;

const CENTER_TYPES = ["Регион РФ", "Зарубежный", "Онлайн"] as const;

const CenterCategorySchema = z.enum(CENTER_CATEGORIES);
const CenterTypeSchema = z.enum(CENTER_TYPES);

const NO_DATA = /^нет данных\.?$/i;

const CenterLocationSchema = z
	.object({
		flag: z.string().optional(),
		city: z.string().optional(),
		country: z.string().optional(),
		region: z.string().optional(),
		district: z.string().optional(),
	})
	.strict();

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

const CenterSchema = z
	.object({
		title: z.string().min(1),
		pubDate: z
			.string()
			.refine((value) => !Number.isNaN(new Date(value).getTime()), {
				message: "pubDate должен быть датой в формате, понятном new Date() (напр. 2026-08-11)",
			})
			.optional(),
		type: CenterTypeSchema.optional(),
		category: CenterCategorySchema.optional(),
		source: z.url().optional(),
		summary: z.string().optional(),
		location: CenterLocationSchema.optional(),
	})
	.strict();

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

const postsEn = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/posts_i18n/en",
	}),
	schema: PostSchema,
});

const thanks = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/thanks",
	}),
	schema: ThanksSchema,
});

const thanksEn = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/data/thanks_i18n/en",
	}),
	schema: ThanksSchema,
});

export const collections = {
	centers,
	centersEn,
	posts,
	postsEn,
	thanks,
	thanksEn,
};

export type CenterCategory = z.infer<typeof CenterCategorySchema>;
export type CenterType = z.infer<typeof CenterTypeSchema>;
export type CenterLocation = z.infer<typeof CenterLocationSchema>;
export type CenterData = z.infer<typeof CenterSchema>;
export type PostData = z.infer<typeof PostSchema>;
export type ThanksData = z.infer<typeof ThanksSchema>;

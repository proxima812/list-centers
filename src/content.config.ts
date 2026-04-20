import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { organizationsByCategory } from "./data/_list-data";

const centers = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/centers" }),
	schema: z.object({
		title: z.string(),
		pubDate: z.string().optional(),
		type: z.string().optional(),
		category: z.string().optional(),
		source: z.string().optional(),
		summary: z.string().optional(),
		location: z
			.object({
				flag: z.string().optional(),
				city: z.string().optional(),
				country: z.string().optional(),
				region: z.string().optional(),
			})
			.optional(),
	}),
});

const organizations = defineCollection({
	loader: () => {
		const allEntries = Object.values(organizationsByCategory).flat();
		return allEntries.map((entry) => ({
			id: entry.id,
			name: entry.name,
			type: entry.type,
			category: entry.category,
			source: entry.source,
			summary: entry.summary,
			description: entry.description,
			location: entry.location,
			contacts: entry.contacts,
			links: entry.links,
			registry: entry.registry ?? null,
			meta: entry.meta ?? null,
		}));
	},
	schema: z.object({
		name: z.string(),
		type: z.string(),
		category: z.string(),
		source: z.string(),
		summary: z.string(),
		description: z.string(),
		location: z.object({
			flag: z.string(),
			city: z.string(),
			country: z.string(),
			region: z.string().optional(),
			address: z.string().optional(),
		}),
		contacts: z.object({
			leader: z.string(),
			emails: z.array(z.string()),
			phones: z.array(z.string()),
		}),
		links: z.array(
			z.object({
				type: z.string(),
				url: z.string(),
				label: z.string(),
			}),
		),
		registry: z
			.object({
				ogrn: z.string().optional(),
				fullName: z.string().optional(),
				shortName: z.string().optional(),
			})
			.nullable(),
		meta: z
			.object({
				pubDate: z.string().optional(),
			})
			.nullable(),
	}),
});

export const collections = { organizations, centers };

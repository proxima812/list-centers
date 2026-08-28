import { defaultLocale } from "@/i18n";
import { getCenterSearchIndex } from "@/lib/center/searchIndex";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify(await getCenterSearchIndex(defaultLocale)), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

import { defaultLocale } from "@/i18n";
import { getNearbyIndex } from "@/lib/nearby/index";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify(await getNearbyIndex(defaultLocale)), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

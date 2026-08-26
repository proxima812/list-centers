import { defaultLocale, isAppLocale } from "@/i18n";
import { secondaryLocalePaths } from "@/i18n/routes";
import { getCenterSearchIndex } from "@/utils/centersSearchIndex";
import type { APIRoute } from "astro";

export const prerender = true;

export const getStaticPaths = secondaryLocalePaths;

export const GET: APIRoute = async ({ params }) => {
	const locale = isAppLocale(params.locale) ? params.locale : defaultLocale;

	return new Response(JSON.stringify(await getCenterSearchIndex(locale)), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

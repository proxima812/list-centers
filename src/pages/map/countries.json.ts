import { getMapCountries } from "@/utils/mapData";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify(await getMapCountries()), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
};

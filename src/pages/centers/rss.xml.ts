import { createCenterRouteIdMap, getCenterPath } from "@/utils/centers";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { config } from "@/config";

export const GET: APIRoute = async ({ site: astroSite }) => {
	const centers = await getCollection("centers");
	const routeIds = createCenterRouteIdMap(centers);
	const site = astroSite ?? new URL(config.site.url);

	return rss({
		title: "tatarverse | Центры",
		description:
			"Новые татарские, башкирские, татаро-башкирские и крымскотатарские центры в каталоге tatarverse.",
		site,
		trailingSlash: false,
		items: centers
			.sort((a, b) => {
				const dateDiff =
					(b.data.pubDate ? new Date(b.data.pubDate).getTime() : 0) -
					(a.data.pubDate ? new Date(a.data.pubDate).getTime() : 0);

				return dateDiff || b.id.localeCompare(a.id, "en", { numeric: true });
			})
			.map((center) => ({
				title: center.data.title,
				description:
					center.data.summary ??
					[center.data.category, center.data.location?.city, center.data.location?.country]
						.filter(Boolean)
						.join(" · "),
				pubDate: center.data.pubDate ? new Date(center.data.pubDate) : undefined,
				link: getCenterPath(routeIds.get(center.id) ?? center.id),
				categories: [center.data.category, center.data.type].filter(
					(value): value is NonNullable<typeof value> => Boolean(value),
				),
			})),
	});
};

import { getPostPath } from "@/lib/post/posts";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { config } from "@/config";

export const GET: APIRoute = async ({ site: astroSite }) => {
	const posts = await getCollection("posts");
	const site = astroSite ?? new URL(config.site.url);

	return rss({
		title: "tatarverse | Посты",
		description:
			"Лента tatarverse: короткие заметки о центрах, культуре, языке и живом сообществе.",
		site,
		trailingSlash: false,
		items: posts
			.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: getPostPath(post.id),
				categories: post.data.tags,
				author: post.data.author,
			})),
	});
};

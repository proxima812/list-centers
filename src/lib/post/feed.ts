import type { AppLocale, Translate } from "@/i18n";
import { formatContentDateTime, getContentDates } from "@/lib/contentDates";
import type { PostEntry } from "@/lib/post/collection";
import { getPostId, getPostPath } from "@/lib/post/posts";
import { render } from "astro:content";

type Rendered = Awaited<ReturnType<typeof render>>;

export interface PostFeedItem {
	Content: Rendered["Content"];
	id: string;
	href: string;
	title: string;
	description: string;
	author: string;
	/** Длинный пост лента показывает свёрнутым. */
	isLong: boolean;
	pubDate: Date;
	publishedDate?: Date;
	modifiedDate?: Date;
	relativeTime: string;
	fullDate: string;
	publishedLabel: string;
	modifiedLabel: string;
}

/** Порог, после которого карточка ленты сворачивает текст. */
const LONG_POST_LENGTH = 200;

const MINUTE = 60000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Голый текст поста: по нему считается длина, а не по разметке - иначе
 * короткая заметка со ссылками выглядела бы длинной.
 */
export const stripMarkdown = (value: string) =>
	value
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[#>*_~|-]/g, "")
		.replace(/\s+/g, " ")
		.trim();

/** «Час назад» вместо даты: в ленте так честнее видно, что живое. */
export function postRelativeTime(date: Date, t: Translate): string {
	const diffMs = Date.now() - date.getTime();

	if (diffMs < HOUR) {
		return t("posts.ago.minutes", { value: Math.max(1, Math.floor(diffMs / MINUTE)) });
	}

	if (diffMs < DAY) {
		return t("posts.ago.hours", { value: Math.floor(diffMs / HOUR) });
	}

	return t("posts.ago.days", { value: Math.floor(diffMs / DAY) });
}

/** Лента постов целиком: отрендеренный контент и все подписи под карточку. */
export async function buildPostFeed(
	posts: readonly PostEntry[],
	locale: AppLocale,
	t: Translate,
): Promise<PostFeedItem[]> {
	const fullDateFormatter = new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			const plainText = stripMarkdown(post.body ?? post.data.description);
			const { publishedDate, modifiedDate } = getContentDates({
				pubDate: post.data.pubDate,
				filePath: post.filePath,
			});

			return {
				Content,
				id: getPostId(post.id),
				href: getPostPath(post.id),
				title: post.data.title,
				description: post.data.description,
				author: post.data.author,
				isLong: plainText.length > LONG_POST_LENGTH,
				pubDate: post.data.pubDate,
				publishedDate,
				modifiedDate,
				relativeTime: postRelativeTime(post.data.pubDate, t),
				fullDate: fullDateFormatter.format(post.data.pubDate).replace(/\s?г\.$/, ""),
				publishedLabel: formatContentDateTime(publishedDate, locale),
				modifiedLabel: formatContentDateTime(modifiedDate, locale),
			};
		}),
	);
}

/** Самая свежая правка в ленте — `dateModified` самой страницы `/posts`. */
export const latestModifiedDate = (feed: readonly PostFeedItem[]): Date | undefined =>
	feed
		.map((post) => post.modifiedDate)
		.filter((date): date is Date => Boolean(date))
		.sort((a, b) => b.getTime() - a.getTime())[0];

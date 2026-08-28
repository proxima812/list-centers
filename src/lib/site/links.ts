/**
 * Внешние адреса проекта в одном месте.
 *
 * Раньше `github.com/proxima812/...` был захардкожен в подвале, мобильном
 * меню и бейдже главной — четыре независимые копии одного ника. Сменится
 * владелец репозитория или имя проекта — правится только здесь.
 */

const GITHUB_USER = "proxima812";
const GITHUB_REPO = "tatarverse";

const repository = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}`;

export const siteLinks = {
	developer: `https://github.com/${GITHUB_USER}`,
	repository,
	releases: `${repository}/releases`,
	suggestChange: `${repository}/issues/new`,
	codeLicense: `${repository}/blob/main/LICENSE`,
	contentLicense: `${repository}/blob/main/CONTENT-LICENSE.md`,
} as const;

/** Атрибуты для ссылки, уводящей с сайта. */
export const externalLinkProps = {
	target: "_blank",
	rel: "noreferrer noopener",
} as const;

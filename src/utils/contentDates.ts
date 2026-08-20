import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { AppLocale } from "@/i18n";

type DateInput = Date | string | null | undefined;

const projectRoot = process.cwd();
let gitDatesCache: Map<string, { createdDate?: Date; modifiedDate?: Date }> | null = null;
let dirtyFilesCache: Set<string> | null = null;

function toDate(value: DateInput) {
	if (!value) return undefined;
	if (
		value instanceof Date &&
		value.getUTCHours() === 0 &&
		value.getUTCMinutes() === 0 &&
		value.getUTCSeconds() === 0 &&
		value.getUTCMilliseconds() === 0
	) {
		return new Date(`${value.toISOString().slice(0, 10)}T00:00:00+05:00`);
	}

	const normalizedValue =
		typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
			? `${value}T00:00:00+05:00`
			: value;
	const date = normalizedValue instanceof Date ? normalizedValue : new Date(normalizedValue);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function toRelativePath(filePath: string) {
	const relative = path.isAbsolute(filePath) ? path.relative(projectRoot, filePath) : filePath;
	return relative.replaceAll(path.sep, "/").replace(/^\.\//, "");
}

function toAbsolutePath(filePath: string) {
	return path.isAbsolute(filePath) ? filePath : path.join(projectRoot, filePath);
}

function getDirtyFiles() {
	if (dirtyFilesCache) return dirtyFilesCache;

	dirtyFilesCache = new Set();

	try {
		const output = execFileSync("git", ["status", "--porcelain", "-z", "--", "src/data", "src/pages"], {
			cwd: projectRoot,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		});

		const records = output.split("\0").filter(Boolean);
		for (let i = 0; i < records.length; i += 1) {
			const record = records[i];
			const status = record.slice(0, 2);
			const filePath = record.length > 3 ? record.slice(3) : record;
			if (filePath) dirtyFilesCache.add(filePath);

			// При rename/copy формат -z иной: `XY new\0orig\0` — следующий
			// NUL-блок это исходный путь без префикса статуса. Помечаем оба и
			// не даём slice(3) откусить начало настоящего пути.
			if (/[RC]/.test(status)) {
				const original = records[i + 1];
				if (original) dirtyFilesCache.add(original);
				i += 1;
			}
		}
	} catch {}

	return dirtyFilesCache;
}

function getGitDates() {
	if (gitDatesCache) return gitDatesCache;

	gitDatesCache = new Map();

	// На shallow clone (CI) история усечена: createdDate у всех файлов
	// схлопывается в дату граничного коммита, а fallback на birthtime — это
	// время чекаута. Даты будут неверными — предупреждаем явно.
	try {
		const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
			cwd: projectRoot,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		if (shallow === "true") {
			console.warn(
				"[contentDates] git-репозиторий shallow: даты «опубликовано/обновлено» " +
					"будут неточными. Сборке нужна полная история (fetch-depth: 0).",
			);
		}
	} catch {}

	try {
		const output = execFileSync("git", ["log", "--format=%cI", "--name-only", "--", "src/data", "src/pages"], {
			cwd: projectRoot,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		});
		let commitDate: Date | undefined;

		for (const line of output.split("\n")) {
			const value = line.trim();
			if (!value) continue;

			if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
				commitDate = toDate(value);
				continue;
			}

			if (!commitDate) continue;
			const fileDates = gitDatesCache.get(value) ?? {};
			fileDates.modifiedDate ??= commitDate;
			fileDates.createdDate = commitDate;
			gitDatesCache.set(value, fileDates);
		}
	} catch {
	}

	return gitDatesCache;
}

function getGitModifiedDate(relativePath: string) {
	return getGitDates().get(relativePath)?.modifiedDate;
}

function getGitCreatedDate(relativePath: string) {
	return getGitDates().get(relativePath)?.createdDate;
}

function getFileCreatedDate(filePath: string | undefined, fallback?: DateInput) {
	const fallbackDate = toDate(fallback);
	if (!filePath) return fallbackDate;

	const relativePath = toRelativePath(filePath);
	const absolutePath = toAbsolutePath(filePath);
	const statDate = fs.existsSync(absolutePath) ? fs.statSync(absolutePath).birthtime : undefined;

	// В отличие от modified, dirty-статус здесь не важен: правка файла не
	// меняет дату его создания, а у нового некоммиченного файла git-даты нет
	// и так — сработает fallback на birthtime.
	return getGitCreatedDate(relativePath) ?? statDate ?? fallbackDate;
}

function getFileModifiedDate(filePath: string | undefined, fallback?: DateInput) {
	const fallbackDate = toDate(fallback);
	if (!filePath) return fallbackDate;

	const relativePath = toRelativePath(filePath);
	const absolutePath = toAbsolutePath(filePath);
	const statDate = fs.existsSync(absolutePath) ? fs.statSync(absolutePath).mtime : undefined;

	if (getDirtyFiles().has(relativePath)) {
		return statDate ?? fallbackDate;
	}

	return getGitModifiedDate(relativePath) ?? statDate ?? fallbackDate;
}

export function getContentDates({
	pubDate,
	filePath,
}: {
	pubDate?: DateInput;
	filePath?: string;
}) {
	const publishedDate = toDate(pubDate) ?? getFileCreatedDate(filePath);
	const modifiedDate = getFileModifiedDate(filePath, publishedDate);

	return {
		publishedDate,
		modifiedDate,
	};
}

export function formatContentDateTime(date: DateInput, locale: AppLocale) {
	const parsedDate = toDate(date);
	if (!parsedDate) return "";

	const dateParts = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "Asia/Almaty",
	}).formatToParts(parsedDate);
	const timeParts = new Intl.DateTimeFormat("ru-RU", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Asia/Almaty",
	}).formatToParts(parsedDate);

	const getDatePart = (type: Intl.DateTimeFormatPartTypes) =>
		dateParts.find((part) => part.type === type)?.value ?? "";
	const getTimePart = (type: Intl.DateTimeFormatPartTypes) =>
		timeParts.find((part) => part.type === type)?.value ?? "";

	const day = getDatePart("day");
	const month = getDatePart("month");
	const year = getDatePart("year");
	const hour = getTimePart("hour");
	const minute = getTimePart("minute");
	const dateLabel = locale === "en" ? `${month} ${day}, ${year}` : `${day} ${month} ${year}`;

	return `${dateLabel}, ${hour}:${minute}`;
}

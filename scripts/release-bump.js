#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const packagePath = path.join(rootDir, "package.json");
const releasePath = path.join(rootDir, "src/data/release.json");
const releaseFiles = new Set(["package.json", "src/data/release.json"]);
const RU_MONTHS = [
	"января",
	"февраля",
	"марта",
	"апреля",
	"мая",
	"июня",
	"июля",
	"августа",
	"сентября",
	"октября",
	"ноября",
	"декабря",
];

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, "\t")}\n`);
}

function parseVersion(version) {
	const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)$/);

	if (!match) {
		throw new Error(`Invalid version: ${version}`);
	}

	return match.slice(1).map(Number);
}

function bumpVersion(current, bump) {
	const [major, minor, patch] = parseVersion(current);

	if (!bump || bump === "patch") return `${major}.${minor}.${patch + 1}`;
	if (bump === "minor") return `${major}.${minor + 1}.0`;
	if (bump === "major") return `${major + 1}.0.0`;
	if (/^v?\d+\.\d+\.\d+$/.test(bump)) return bump.replace(/^v/, "");

	throw new Error("Expected bump type: patch, minor, major, or x.y.z");
}

function runGit(args) {
	return execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
}

function getChangedFiles() {
	const baseRef = process.env.RELEASE_BUMP_BASE;
	const headRef = process.env.RELEASE_BUMP_HEAD ?? "HEAD";
	let diffRange = "";

	if (baseRef && !/^0+$/.test(baseRef)) {
		diffRange = `${baseRef}..${headRef}`;
	} else {
		try {
			diffRange = `${runGit(["rev-parse", "HEAD~1"])}..${headRef}`;
		} catch {
			diffRange = headRef;
		}
	}

	const output = runGit(["diff", "--name-only", diffRange]);
	return output
		.split("\n")
		.map((file) => file.trim())
		.filter(Boolean)
		.filter((file) => !releaseFiles.has(file));
}

function detectBumpType() {
	const changedFiles = getChangedFiles();

	if (changedFiles.length === 0) return null;

	return "patch";
}

function formatRuDate(date) {
	// Asia/Almaty, как и все даты на сайте (contentDates.ts): локальная зона
	// машины давала метку, расходящуюся с остальным сайтом на часы.
	const parts = Object.fromEntries(
		new Intl.DateTimeFormat("ru-RU", {
			timeZone: "Asia/Almaty",
			day: "numeric",
			month: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})
			.formatToParts(date)
			.filter((part) => part.type !== "literal")
			.map((part) => [part.type, part.value]),
	);

	return `${Number(parts.day)} ${RU_MONTHS[Number(parts.month) - 1]} ${parts.year}, ${parts.hour}:${parts.minute}`;
}

try {
	const args = process.argv.slice(2);
	const shouldCommit = args.includes("--commit");
	const positional = args.filter((arg) => !arg.startsWith("--"));
	const requestedBump = positional[0] ?? "patch";
	const bump = requestedBump === "auto" ? detectBumpType() : requestedBump;

	if (!bump) {
		console.log("No release bump needed");
		process.exit(0);
	}

	const pkg = readJson(packagePath);
	const nextVersion = bumpVersion(pkg.version, bump);
	const now = new Date();

	pkg.version = nextVersion;
	writeJson(packagePath, pkg);

	writeJson(releasePath, {
		version: nextVersion,
		updatedAt: now.toISOString(),
		updatedAtLabel: formatRuDate(now),
	});

	console.log(`Prepared release v${nextVersion}`);
	console.log("Updated package.json and src/data/release.json");

	if (shouldCommit) {
		runGit(["add", "package.json", "src/data/release.json"]);
		runGit(["commit", "-m", `chore: release v${nextVersion}`]);
		console.log(`Committed release v${nextVersion}`);
	} else {
		console.log(`Suggested commit: git commit -m "chore: release v${nextVersion}"`);
	}
} catch (error) {
	console.error(error.message);
	process.exit(1);
}

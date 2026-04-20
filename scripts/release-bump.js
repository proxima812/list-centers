#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const packagePath = path.join(rootDir, "package.json");
const releasePath = path.join(rootDir, "src/data/release.json");

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

function formatRuDate(date) {
	const day = date.getDate();
	const month = RU_MONTHS[date.getMonth()];
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

try {
	const bump = process.argv[2] ?? "patch";
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
	console.log(`Suggested commit: git commit -m "chore: release v${nextVersion}"`);
} catch (error) {
	console.error(error.message);
	process.exit(1);
}

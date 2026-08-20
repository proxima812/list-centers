import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const localeDir = path.join(cwd, "src/i18n/locales");
const srcDir = path.join(cwd, "src");
const sourceExtensions = new Set([".astro", ".ts", ".tsx", ".js", ".jsx", ".svelte", ".vue"]);

function walk(dir, files = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (["node_modules", "dist", ".astro"].includes(entry.name)) continue;
			walk(fullPath, files);
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

function extractLocaleKeys(filePath) {
	const source = fs.readFileSync(filePath, "utf8");
	const keys = new Set();
	const keyPattern = /"((?:\\.|[^"\\])+)"\s*:/g;
	let match;

	while ((match = keyPattern.exec(source))) {
		keys.add(match[1]);
	}

	return keys;
}

function extractUsedKeys(filePath) {
	const source = fs.readFileSync(filePath, "utf8");
	const keys = new Set();
	const patterns = [
		/\bt\(\s*["'`]([^"'`]+)["'`]/g,
		/\blabelKey=["']([^"']+)["']/g,
		/\btitleKey=["']([^"']+)["']/g,
		/\bdescriptionKey=["']([^"']+)["']/g,
		/\bariaLabelKey=["']([^"']+)["']/g,
	];

	for (const pattern of patterns) {
		let match;
		while ((match = pattern.exec(source))) {
			keys.add(match[1]);
		}
	}

	return keys;
}

const localeFiles = fs
	.readdirSync(localeDir)
	.filter((file) => file.endsWith(".ts"))
	.sort((a, b) => a.localeCompare(b, "en"));

const localeKeys = new Map(
	localeFiles.map((file) => [path.basename(file, ".ts"), extractLocaleKeys(path.join(localeDir, file))]),
);

const allLocaleKeys = new Set();
for (const keys of localeKeys.values()) {
	for (const key of keys) allLocaleKeys.add(key);
}

const usedKeys = new Set();
for (const filePath of walk(srcDir)) {
	if (!sourceExtensions.has(path.extname(filePath))) continue;
	if (filePath.includes(`${path.sep}i18n${path.sep}locales${path.sep}`)) continue;

	for (const key of extractUsedKeys(filePath)) {
		usedKeys.add(key);
	}
}

const missingInLocales = {};
for (const [locale, keys] of localeKeys) {
	const missing = [...allLocaleKeys].filter((key) => !keys.has(key)).sort();
	if (missing.length > 0) missingInLocales[locale] = missing;
}

const missingUsedKeys = [...usedKeys].filter((key) => !allLocaleKeys.has(key)).sort();
const unusedLocaleKeys = [...allLocaleKeys].filter((key) => !usedKeys.has(key)).sort();

const report = {
	locales: Object.fromEntries([...localeKeys].map(([locale, keys]) => [locale, keys.size])),
	usedKeys: usedKeys.size,
	totalLocaleKeys: allLocaleKeys.size,
	missingInLocales,
	missingUsedKeys,
	unusedLocaleKeys,
};

console.log(JSON.stringify(report, null, 2));

if (Object.keys(missingInLocales).length > 0 || missingUsedKeys.length > 0) {
	process.exitCode = 1;
}

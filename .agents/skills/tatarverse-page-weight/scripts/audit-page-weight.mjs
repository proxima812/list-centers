import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const cwd = process.cwd();
const distDir = path.join(cwd, "dist");

const limits = {
	pageGzip: Number(process.env.PAGE_GZIP_LIMIT_KB ?? 80) * 1024,
	jsGzip: Number(process.env.JS_GZIP_LIMIT_KB ?? 170) * 1024,
	cssGzip: Number(process.env.CSS_GZIP_LIMIT_KB ?? 80) * 1024,
	totalJs: Number(process.env.TOTAL_JS_LIMIT_KB ?? 600) * 1024,
};

function walk(dir, files = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(fullPath, files);
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

function sizeInfo(filePath) {
	const buffer = fs.readFileSync(filePath);
	return {
		path: path.relative(cwd, filePath),
		bytes: buffer.length,
		gzipBytes: zlib.gzipSync(buffer).length,
	};
}

function sum(items, key) {
	return items.reduce((total, item) => total + item[key], 0);
}

function top(items, count = 15) {
	return [...items].sort((a, b) => b.gzipBytes - a.gzipBytes).slice(0, count);
}

function formatKb(bytes) {
	return `${(bytes / 1024).toFixed(1)} KB`;
}

if (!fs.existsSync(distDir)) {
	console.error("dist not found. Run `bun run build` first.");
	process.exit(1);
}

const files = walk(distDir).map(sizeInfo);
const pages = files.filter((file) => file.path.endsWith(".html"));
const scripts = files.filter((file) => file.path.endsWith(".js"));
const styles = files.filter((file) => file.path.endsWith(".css"));

const warnings = [];
for (const page of pages) {
	if (page.gzipBytes > limits.pageGzip) {
		warnings.push(`Large page gzip: ${page.path} (${formatKb(page.gzipBytes)})`);
	}
}
for (const script of scripts) {
	if (script.gzipBytes > limits.jsGzip) {
		warnings.push(`Large JS gzip: ${script.path} (${formatKb(script.gzipBytes)})`);
	}
}
for (const style of styles) {
	if (style.gzipBytes > limits.cssGzip) {
		warnings.push(`Large CSS gzip: ${style.path} (${formatKb(style.gzipBytes)})`);
	}
}
if (sum(scripts, "bytes") > limits.totalJs) {
	warnings.push(`Large total JS raw: ${formatKb(sum(scripts, "bytes"))}`);
}

const report = {
	totals: {
		files: files.length,
		pages: pages.length,
		scripts: scripts.length,
		styles: styles.length,
		htmlRaw: formatKb(sum(pages, "bytes")),
		htmlGzip: formatKb(sum(pages, "gzipBytes")),
		jsRaw: formatKb(sum(scripts, "bytes")),
		jsGzip: formatKb(sum(scripts, "gzipBytes")),
		cssRaw: formatKb(sum(styles, "bytes")),
		cssGzip: formatKb(sum(styles, "gzipBytes")),
	},
	warnings,
	largestPages: top(pages).map((item) => ({
		path: item.path,
		raw: formatKb(item.bytes),
		gzip: formatKb(item.gzipBytes),
	})),
	largestScripts: top(scripts).map((item) => ({
		path: item.path,
		raw: formatKb(item.bytes),
		gzip: formatKb(item.gzipBytes),
	})),
	largestStyles: top(styles).map((item) => ({
		path: item.path,
		raw: formatKb(item.bytes),
		gzip: formatKb(item.gzipBytes),
	})),
};

console.log(JSON.stringify(report, null, 2));

if (warnings.length > 0) {
	process.exitCode = 1;
}

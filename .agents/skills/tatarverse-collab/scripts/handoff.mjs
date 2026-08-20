#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "handoff";
}

const title = readArg("title", "Claude Codex Handoff");
const request = readArg("request", "Not specified.");
const scope = readArg("scope", "Not specified.");
const claude = readArg("claude", "Claude Code owns UI/UX direction for the scoped surface.");
const codex = readArg("codex", "Codex owns repo-grounded implementation and validation.");
const validation = readArg("validation", "Use the lightest targeted validation that matches the change.");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const dir = path.join(process.cwd(), ".agents", "collab");
const file = path.join(dir, `${timestamp}-${slugify(title)}.md`);

const body = `# ${title}

## User Request

${request}

## Scope

${scope}

## Claude UI/UX Ownership

${claude}

## Codex Implementation Ownership

${codex}

## Validation

${validation}
`;

await mkdir(dir, { recursive: true });
await writeFile(file, body, "utf8");

console.log(file);

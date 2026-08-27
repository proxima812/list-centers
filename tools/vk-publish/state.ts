import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const STATE_FILE_PATH = join(import.meta.dirname, "state.json");

export interface PublishedRecord {
	postId: number;
	publishedAt: string;
}

export type PublishState = Record<string, PublishedRecord>;

export function loadState(): PublishState {
	if (!existsSync(STATE_FILE_PATH)) return {};
	return JSON.parse(readFileSync(STATE_FILE_PATH, "utf-8")) as PublishState;
}

export function saveState(state: PublishState): void {
	writeFileSync(STATE_FILE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

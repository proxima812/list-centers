const WALL_POST_ENDPOINT = "https://api.vk.com/method/wall.post";

/** Коды ошибок VK API, при которых имеет смысл повторить запрос. */
const RETRYABLE_ERROR_CODES = new Set([
	1, // Unknown error — часто временная проблема на стороне VK
	6, // Too many requests per second
	9, // Flood control
	10, // Internal server error
]);

const MAX_ATTEMPTS = 4;
const BASE_RETRY_DELAY_MS = 2000;

export interface VkConfig {
	accessToken: string;
	groupId: string;
	apiVersion: string;
}

export function readVkConfig(): VkConfig {
	const accessToken = process.env.VK_ACCESS_TOKEN;
	const groupId = process.env.VK_GROUP_ID;
	const apiVersion = process.env.VK_API_VERSION || "5.199";

	if (!accessToken) throw new Error("VK_ACCESS_TOKEN не задан в окружении (см. .env.example)");
	if (!groupId) throw new Error("VK_GROUP_ID не задан в окружении (см. .env.example)");
	if (groupId.startsWith("-")) {
		throw new Error("VK_GROUP_ID должен быть без минуса — знак добавляется при вызове API");
	}
	// wall.post принимает только числовой owner_id: экранная форма вроде
	// `club241041984` или `public12345` уедет в API как есть и вернёт error 100.
	if (!/^\d+$/.test(groupId)) {
		const digits = /^(?:club|public|event)(\d+)$/.exec(groupId)?.[1];
		throw new Error(
			`VK_GROUP_ID должен быть числом без префикса, получено "${groupId}"` +
				(digits ? ` — укажите ${digits}` : ""),
		);
	}

	return { accessToken, groupId, apiVersion };
}

interface VkErrorResponse {
	error_code: number;
	error_msg: string;
}

function isVkErrorResponse(value: unknown): value is VkErrorResponse {
	return (
		typeof value === "object" &&
		value !== null &&
		"error_code" in value &&
		typeof (value as { error_code: unknown }).error_code === "number"
	);
}

export class VkApiError extends Error {
	code: number;

	constructor(code: number, message: string) {
		super(`VK API [${code}]: ${message}`);
		this.code = code;
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callWallPost(config: VkConfig, message: string): Promise<number> {
	const body = new URLSearchParams({
		owner_id: `-${config.groupId}`,
		from_group: "1",
		message,
		access_token: config.accessToken,
		v: config.apiVersion,
	});

	const response = await fetch(WALL_POST_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	});

	const json = (await response.json()) as { response?: { post_id: number } } | { error?: VkErrorResponse };

	if ("error" in json && isVkErrorResponse(json.error)) {
		throw new VkApiError(json.error.error_code, json.error.error_msg);
	}

	if (!("response" in json) || typeof json.response?.post_id !== "number") {
		throw new Error(`Неожиданный ответ VK API: ${JSON.stringify(json)}`);
	}

	return json.response.post_id;
}

/** Публикует пост от имени сообщества, повторяя запрос при временных ошибках VK. */
export async function wallPost(config: VkConfig, message: string): Promise<number> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		try {
			return await callWallPost(config, message);
		} catch (error) {
			lastError = error;
			const retryable = error instanceof VkApiError ? RETRYABLE_ERROR_CODES.has(error.code) : true;

			if (!retryable || attempt === MAX_ATTEMPTS) break;

			const delay = BASE_RETRY_DELAY_MS * attempt;
			await sleep(delay);
		}
	}

	throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

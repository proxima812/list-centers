import type { ImageMetadata } from "astro";

const projectAssets = import.meta.glob<{ default: ImageMetadata }>(
	"../assets/projects/**/*.{jpg,jpeg,png,webp}",
	{ eager: true },
);

/**
 * Resolve a project asset (logo/photo) by its relative path inside
 * `src/assets/projects`. Returns `null` when the asset is missing so callers
 * can render a graceful fallback instead of failing the build.
 */
export function getProjectAsset(path?: string): ImageMetadata | null {
	if (!path) return null;

	return projectAssets[`../assets/projects/${path}`]?.default ?? null;
}

/**
 * Deterministic, tasteful gradient derived from the project title. The same
 * title always yields the same gradient, so placeholders stay stable across
 * builds while different projects look distinct.
 */
export function getProjectGradient(seed: string): string {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}

	const gradients = [
		[
			"radial-gradient(78% 70% at 68% 76%, rgb(88 88 245 / 0.78), transparent 66%)",
			"radial-gradient(70% 60% at 40% 28%, rgb(239 248 255 / 0.7), transparent 62%)",
			"linear-gradient(150deg, #c8effa 0%, #aee6df 100%)",
		],
		[
			"radial-gradient(78% 70% at 68% 76%, rgb(37 126 224 / 0.72), transparent 66%)",
			"radial-gradient(70% 60% at 42% 28%, rgb(234 255 225 / 0.68), transparent 62%)",
			"linear-gradient(150deg, #b9f4c8 0%, #a9e9b7 100%)",
		],
		[
			"radial-gradient(78% 70% at 68% 76%, rgb(255 82 42 / 0.74), transparent 66%)",
			"radial-gradient(68% 58% at 44% 36%, rgb(255 221 73 / 0.62), transparent 62%)",
			"linear-gradient(150deg, #f4d1ac 0%, #f6c59f 100%)",
		],
		[
			"radial-gradient(78% 70% at 68% 76%, rgb(219 20 100 / 0.74), transparent 66%)",
			"radial-gradient(72% 62% at 40% 64%, rgb(100 76 238 / 0.6), transparent 64%)",
			"linear-gradient(150deg, #d99bed 0%, #d992dc 100%)",
		],
		[
			"radial-gradient(78% 70% at 62% 78%, rgb(255 49 32 / 0.76), transparent 66%)",
			"radial-gradient(68% 58% at 40% 36%, rgb(255 220 217 / 0.68), transparent 62%)",
			"linear-gradient(150deg, #f5b2b8 0%, #f0a5a9 100%)",
		],
	] as const;

	return gradients[Math.abs(hash) % gradients.length].join(", ");
}

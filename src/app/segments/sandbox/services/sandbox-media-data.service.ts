import { Service } from "@angular/core";

/** A deterministic mock image: `name` is the stable key, `url` an inline SVG data URI. */
export interface _SandboxMediaImage {
	name: string;
	url: string;
	title: string;
	description: string;
}

interface _SandboxMediaSlide {
	name: string;
	title: string;
	background: string;
	accent: string;
}

/** Fixed palette so every render produces the same images (no external URLs, no randomness). */
const SLIDES: _SandboxMediaSlide[] = [
	{ name: `harbour`, title: `Harbour`, background: `#1b2935`, accent: `#f47920` },
	{ name: `meadow`, title: `Meadow`, background: `#2e7d32`, accent: `#bcd139` },
	{ name: `desert`, title: `Desert`, background: `#c5580a`, accent: `#f79147` },
	{ name: `glacier`, title: `Glacier`, background: `#0288d1`, accent: `#f2f2f2` },
	{ name: `forest`, title: `Forest`, background: `#3f607c`, accent: `#75bf44` },
	{ name: `canyon`, title: `Canyon`, background: `#db203f`, accent: `#ff5722` },
	{ name: `slate`, title: `Slate`, background: `#444c53`, accent: `#979797` },
];

/** Mock media for the sandbox media page: inline SVG images generated deterministically. */
@Service()
export class SandboxMediaDataService {
	public readonly images: _SandboxMediaImage[] = SLIDES.map(
		(slide: _SandboxMediaSlide, index: number): _SandboxMediaImage => ({
			name: slide.name,
			url: this.buildSvgDataUri(slide, index),
			title: slide.title,
			description: `Mock image ${String(index + 1)} of ${String(SLIDES.length)}: ${slide.title}`,
		}),
	);

	/**
	 * Builds an 800x500 SVG with a gradient-free scene so the zoom controls have detail to magnify.
	 * Only double quotes and no parentheses are used so the URI is safe inside an unquoted CSS `url()`.
	 */
	private buildSvgDataUri(slide: _SandboxMediaSlide, index: number): string {
		const svg: string = [
			`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">`,
			`<rect width="800" height="500" fill="${slide.background}"/>`,
			`<circle cx="${String(160 + index * 70)}" cy="140" r="70" fill="${slide.accent}"/>`,
			`<polygon points="0,500 220,260 420,500" fill="${slide.accent}" opacity="0.6"/>`,
			`<polygon points="300,500 560,220 800,500" fill="${slide.accent}" opacity="0.35"/>`,
			`<rect x="40" y="40" width="720" height="420" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="12 8"/>`,
			`<text x="400" y="270" font-family="sans-serif" font-size="64" font-weight="bold" fill="#ffffff" text-anchor="middle">${slide.title}</text>`,
			`<text x="400" y="330" font-family="sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">${String(index + 1)} / ${String(SLIDES.length)}</text>`,
			`</svg>`,
		].join(``);
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}
}

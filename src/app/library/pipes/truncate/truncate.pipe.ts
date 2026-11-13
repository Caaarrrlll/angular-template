import { Pipe, PipeTransform } from "@angular/core";

/**
 * Truncates text to at most `size` characters and appends `trail`.
 *
 * @example
 *      {{ longDescription | truncate: 85 }}
 *      {{ longDescription | truncate: 85: "…" }}
 */
@Pipe({
	name: "truncate",
	standalone: true,
})
export class TruncatePipe implements PipeTransform {
	public transform(text: string | undefined, size: number, trail = "..."): string {
		if (!text) {
			return "";
		}

		return text.length > size ? `${text.substring(0, size)}${trail}` : text;
	}
}

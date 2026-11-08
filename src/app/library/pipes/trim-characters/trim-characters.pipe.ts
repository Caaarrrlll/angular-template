import { Pipe, PipeTransform } from "@angular/core";

/**
 * Truncates text to a maximum length and appends `...`.
 *
 * @example
 *      {{ longDescription | trimCharacters: 85 }}
 */
@Pipe({
	name: "trimCharacters",
	standalone: true,
})
export class TrimCharactersPipe implements PipeTransform {
	public transform(text: string | undefined, length: number): string {
		if (!text) {
			return "";
		}

		if (!length) {
			return text;
		}

		if (text.length > length) {
			return `${text.substring(0, length - 1)}...`;
		}
		return text;
	}
}

import { Pipe, PipeTransform } from "@angular/core";

/**
 * Removes every occurrence of a character (or substring) from text.
 * Defaults to removing underscores.
 *
 * @example
 *      {{ "some_value" | removeChars }}
 *      {{ "some value" | removeChars: " " }}
 */
@Pipe({
	name: "removeChars",
	standalone: true,
})
export class RemoveCharsPipe implements PipeTransform {
	public transform(text: string | null | undefined, chars = "_"): string {
		if (!text) {
			return "";
		}

		if (!chars) {
			return text;
		}

		return text.split(chars).join("");
	}
}

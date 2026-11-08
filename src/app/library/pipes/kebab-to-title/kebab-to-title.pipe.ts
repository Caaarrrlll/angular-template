import { Pipe, PipeTransform } from "@angular/core";

/**
 * Replaces the first hyphen in kebab-case text with a space.
 *
 * @example
 *      {{ "kebab-case-text" | kebabToTitle }}
 */
@Pipe({
	name: "kebabToTitle",
	standalone: true,
})
export class KebabToTitlePipe implements PipeTransform {
	public transform(value: string | undefined): string {
		if (!value) {
			return "";
		}
		return value.replace("-", " ");
	}
}

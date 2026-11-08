import { Pipe, PipeTransform } from "@angular/core";

/**
 * Takes the first character of every word of a name, keeping at most two, and
 * uppercases the result.
 *
 * @example
 *      {{ "Piet K Stellen" | nameToInitials }}
 * Outputs `PK`.
 */
@Pipe({
	name: "nameToInitials",
	standalone: true,
})
export class NameToInitialsPipe implements PipeTransform {
	public transform(value: string | undefined): string {
		if (!value) {
			return "";
		}

		return value
			.split(" ")
			.map((name) => name[0] ?? "")
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}
}

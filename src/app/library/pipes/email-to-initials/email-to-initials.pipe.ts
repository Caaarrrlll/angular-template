import { Pipe, PipeTransform } from "@angular/core";

/**
 * Takes the first and last character of the local part of an email address
 * (before the @) and uppercases them.
 *
 * @example
 *      {{ "pietk@webuycars.co.za" | emailToInitials }}
 * Outputs `PK`.
 */
@Pipe({
	name: "emailToInitials",
	standalone: true,
})
export class EmailToInitialsPipe implements PipeTransform {
	public transform(value: string | undefined): string {
		if (!value) {
			return "";
		}

		const name = value.slice(0, value.indexOf("@"));
		return `${name.charAt(0)}${name.charAt(name.length - 1)}`.toUpperCase();
	}
}

import { Pipe, PipeTransform } from "@angular/core";

/**
 * Takes in a string email address and removes the @ along with the domain from
 * the string.
 *
 * @example
 *      {{ "pietk@webuycars.co.za" | removeDomain }}
 * Outputs `pietk`.
 */
@Pipe({
	name: "removeDomain",
	standalone: true,
})
export class RemoveEmailDomainPipe implements PipeTransform {
	public transform(value: string | undefined): string {
		if (!value) {
			return "";
		}
		return value.split("@")[0];
	}
}

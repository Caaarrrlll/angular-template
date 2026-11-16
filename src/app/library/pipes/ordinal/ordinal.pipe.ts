import { Pipe, PipeTransform } from "@angular/core";

const ordinals: (string | undefined)[] = ["th", "st", "nd", "rd"];

/**
 * Appends the ordinal suffix (st, nd, rd, th) to a number, optionally dropping
 * the number and returning only the suffix.
 *
 * @example
 *      {{ 22 | ordinal }}
 * Outputs `22nd`.
 */
@Pipe({
	name: "ordinal",
	standalone: true,
})
export class OrdinalPipe implements PipeTransform {
	public transform(n: number, keepNumber = true): string {
		const v = n % 100;
		return `${keepNumber ? String(n) : ""}${ordinals[(v - 20) % 10] ?? ordinals[v] ?? ordinals[0] ?? "th"}`;
	}
}

import { Pipe, PipeTransform } from "@angular/core";

/**
 * Converts a dotted decimal duration-ish string (`"2.30"`) into a
 * days/hours string.
 *
 * @example
 *      {{ "2.30" | timeMask }}
 * Outputs `2d 30`.
 */
@Pipe({
	name: "timeMask",
	standalone: true,
})
export class TimeMaskPipe implements PipeTransform {
	public transform(value: string): string {
		const values = value.split(".");
		return `${values[0]}d ${values[1]}`;
	}
}

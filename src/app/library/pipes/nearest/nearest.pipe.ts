import { Pipe, PipeTransform } from "@angular/core";

/**
 * Rounds a value to the nearest multiple of a unit.
 *
 * @example
 *      {{ 27 | nearest: 10 }}
 * Outputs `30`.
 */
@Pipe({
	name: "nearest",
	standalone: true,
})
export class NearestPipe implements PipeTransform {
	public transform(value: number, unit: number): number {
		return Math.round(value / unit) * unit;
	}
}

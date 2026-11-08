import { Pipe, PipeTransform } from "@angular/core";

/**
 * Calculates a percentage from a numerator and denominator.
 *
 * @example
 *      {{ 10 | percentage: 25 }}
 * Outputs `40.00%`.
 */
@Pipe({
	name: "percentage",
	standalone: true,
})
export class PercentagePipe implements PipeTransform {
	public transform(numerator: number, denominator: number): string {
		if (!denominator) {
			return "0%";
		}

		return `${((numerator / denominator) * 100).toFixed(2)}%`;
	}
}

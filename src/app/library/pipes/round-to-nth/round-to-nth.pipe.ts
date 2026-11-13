import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "roundToNth",
	standalone: true,
})
export class RoundToNthPipe implements PipeTransform {
	/**
	 * @param value the value to be rounded
	 * @param n the number of decimals to round to, defaulted to 2
	 * @returns a rounded number
	 */
	public transform(value: number, n = 2): number {
		const exponent = Math.pow(10, n);
		return Math.round(value * exponent) / exponent;
	}
}

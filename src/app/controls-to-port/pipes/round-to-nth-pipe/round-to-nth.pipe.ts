import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "roundToNth",
})
export class RoundToNthPipe implements PipeTransform {
	/**
	 * @param  {number} value the value to be rounded
	 * @param  {number=2} n the number of decimals to round to, defaulted to 2
	 * @returns a rounded number
	 */
	transform(value: number, n: number = 2): number {
		const exponent: number = Math.pow(10, n);
		return Math.round(value * exponent) / exponent;
	}
}

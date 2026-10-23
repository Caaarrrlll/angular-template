import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "percentage" })
export class PercentagePipe implements PipeTransform {
	constructor() {}

	transform(numerator: number, denominator: number) {
		if (!denominator) {
			return "0%";
		}

		return ((numerator / denominator) * 100).toFixed(2).toString() + "%";
	}
}

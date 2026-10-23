import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "nearest" })
export class NearestPipe implements PipeTransform {
	constructor() {}
	transform(value: number, unit: number) {
		return Math.round(value / unit) * unit;
	}
}

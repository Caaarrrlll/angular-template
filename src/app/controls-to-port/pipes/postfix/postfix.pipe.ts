import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "postfix" })
export class PostfixPipe implements PipeTransform {
	constructor() {}
	transform(value: any, sign: string, addSpace: boolean = true, noValue: string = "-"): any {
		if (typeof value === "undefined" || value === null) {
			return noValue;
		}

		return addSpace ? `${value} ${sign}` : `${value}${sign}`;
	}
}

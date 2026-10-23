import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatNull" })
export class FormatNullTextPipe implements PipeTransform {
	constructor() {}
	transform(value: any, replaceText: string = "-"): any {
		if (typeof value === "undefined" || value === null) {
			return replaceText;
		}

		return value;
	}
}

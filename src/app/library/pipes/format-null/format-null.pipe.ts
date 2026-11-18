import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "formatNull",
})
export class FormatNullTextPipe implements PipeTransform {
	public transform(value: unknown, replaceText = "-"): unknown {
		if (typeof value === "undefined" || value === null) {
			return replaceText;
		}

		return value;
	}
}

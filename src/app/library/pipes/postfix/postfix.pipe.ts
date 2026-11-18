import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "postfix",
})
export class PostfixPipe implements PipeTransform {
	public transform(value: unknown, sign: string, addSpace = true, noValue = "-"): string {
		const text = String(value);
		if (typeof value === "undefined" || value === null) {
			return noValue;
		}

		return addSpace ? `${text} ${sign}` : `${text}${sign}`;
	}
}

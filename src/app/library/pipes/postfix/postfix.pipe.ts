import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "postfix",
	standalone: true,
})
export class PostfixPipe implements PipeTransform {
	public transform(value: unknown, sign: string, addSpace = true, noValue = "-"): string {
		if (typeof value === "undefined" || value === null) {
			return noValue;
		}

		return addSpace ? `${value} ${sign}` : `${value}${sign}`;
	}
}

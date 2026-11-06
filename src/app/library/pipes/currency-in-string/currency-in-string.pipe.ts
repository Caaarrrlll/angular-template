import { formatCurrency } from "@angular/common";
import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "currencyInString",
	standalone: true,
})
export class CurrencyInStringPipe implements PipeTransform {
	private readonly locale = inject(LOCALE_ID);

	public transform(value: string): string {
		return value.replace(/[0-9]+(?:[,. ][0-9]+)*/g, (match) => {
			if (!match) {
				return match;
			}

			const numericValue = Number(match.replace(",", ".").replace(/\s/g, ""));
			return formatCurrency(numericValue, this.locale, "ZAR", "symbol", "1.2-2").replace(",", ".");
		});
	}
}

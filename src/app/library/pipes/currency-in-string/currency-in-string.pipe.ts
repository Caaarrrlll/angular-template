import { CurrencyPipe } from "@angular/common";
import { DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

/**
 * Formats every number embedded in a string as currency through Angular's CurrencyPipe.
 * Numbers may use `,` or `.` as the decimal separator and spaces as thousands separators.
 *
 * @example
 *      {{ "Invoice 1234,50" | currencyInString }}            → "Invoice R1,234.50" (default currency ZAR, locale en-US)
 *      {{ "Invoice 1234,50" | currencyInString: "USD" }}     → "Invoice $1,234.50"
 */
@Pipe({
	name: "currencyInString",
})
export class CurrencyInStringPipe implements PipeTransform {
	private readonly currencyPipe = new CurrencyPipe(inject(LOCALE_ID), inject(DEFAULT_CURRENCY_CODE));

	/** @param currencyCode ISO 4217 code; defaults to the app's `DEFAULT_CURRENCY_CODE`. */
	public transform(value: string, currencyCode?: string): string {
		return value.replace(/[0-9]+(?:[,. ][0-9]+)*/g, (match) => {
			const numericValue = Number(match.replace(",", ".").replace(/\s/g, ""));
			if (Number.isNaN(numericValue)) {
				// e.g. "1,234.50" (two separators): leave text that is not a single plain number unchanged
				return match;
			}
			return this.currencyPipe.transform(numericValue, currencyCode, "symbol-narrow", "1.2-2") ?? match;
		});
	}
}

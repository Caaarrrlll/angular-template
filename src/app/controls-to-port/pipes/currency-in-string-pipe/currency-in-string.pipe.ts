import { CurrencyPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "currencyInString" })
export class CurrencyInStringPipe implements PipeTransform {
	constructor(private _currencyPipe: CurrencyPipe) {}
	transform(value: string): string {
		return value.replace(/[0-9]+(?:[,. ][0-9]+)*/g, (match) => {
			if (match) {
				return `${this._currencyPipe.transform(match.replace(",", ".").replace(/\s/g, ""), "ZAR", "symbol", "1.2-2").replace(",", ".")}`;
			}
			return match;
		});
	}
}

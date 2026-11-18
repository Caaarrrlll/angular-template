import { Directive } from "@angular/core";

/**
 * Allow only the digits 0-9 to be typed (keypress filter).
 *
 * @example
 *      <input matInput type="text" appNumericInput />
 *
 */

@Directive({
	selector: "[appNumericInput]",
	host: {
		"(keypress)": "restrictToNumeric($event)",
	},
})
export class NumericInputDirective {
	public restrictToNumeric(event: KeyboardEvent): boolean {
		return /^([0-9])$/.test(event.key);
	}
}

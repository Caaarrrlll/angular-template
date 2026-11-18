import { Directive, HostListener } from "@angular/core";

/**
 * Allow only the digits 0-9 to be typed (keypress filter).
 *
 * @example
 *      <input matInput type="text" appNumericInput />
 *
 */

@Directive({
	selector: "[appNumericInput]",
})
export class NumericInputDirective {
	@HostListener("keypress", ["$event"])
	public restrictToNumeric(event: KeyboardEvent): boolean {
		return /^([0-9])$/.test(event.key);
	}
}

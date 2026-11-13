import { Directive, HostListener } from "@angular/core";

/**
 * Set min max values on mat inputs.
 *
 * @example
 *      <input matInput type="number" NumericInput/>
 *
 */

@Directive({
	selector: "[NumericInput]",
	standalone: true,
})
export class NumericInputDirective {
	@HostListener("keypress", ["$event"])
	public restrictToNumeric(event: KeyboardEvent): boolean {
		return /^([0-9])$/.test(event.key);
	}
}

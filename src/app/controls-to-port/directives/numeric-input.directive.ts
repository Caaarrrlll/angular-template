import { Directive, HostListener, NgModule } from "@angular/core";

/**
 * Set min max values on mat inputs.
 *
 * @example
 *      <input matInput type="number" NumericInput/>
 *
 */

@Directive({
	selector: "[NumericInput]",
})
export class NumericInputDirective {
	constructor() {}

	@HostListener("keypress", ["$event"])
	public restrictToNumeric(event): boolean {
		return /^([0-9])$/.test(event.key);
	}
}

@NgModule({
	imports: [],
	declarations: [NumericInputDirective],
	exports: [NumericInputDirective],
})
export class NumericInputDirectiveModule {}

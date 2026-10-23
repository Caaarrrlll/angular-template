import { Directive, ElementRef, HostListener, Input, NgModule } from "@angular/core";

/**
 * Set min max values on mat inputs.
 *
 * @example
 *      <input matInput type="number" MinMaxDecimal [min]="min" [max]="max" />
 *
 * @param min
 * @param max
 */

@Directive({
	selector: "[MinMaxDecimal]",
})
export class MinMaxDecimalDirective {
	@Input()
	public min: number;

	@Input()
	public max: number;

	constructor(private ref: ElementRef) {}

	@HostListener("input", ["$event"])
	public onInput(): void {
		let val = parseInt(this.ref.nativeElement.value);
		if (this.max !== null && this.max !== undefined && val >= this.max) {
			this.ref.nativeElement.value = this.max.toString();
		} else if (this.min !== null && this.min !== undefined && val <= this.min) {
			this.ref.nativeElement.value = this.min.toString();
		}
	}

	@HostListener("keypress", ["$event"])
	public restrictToNumeric(event): boolean {
		return /^([0-9.,])$/.test(event.key);
	}
}

@NgModule({
	imports: [],
	declarations: [MinMaxDecimalDirective],
	exports: [MinMaxDecimalDirective],
})
export class MinMaxDecimalDirectiveModule {}

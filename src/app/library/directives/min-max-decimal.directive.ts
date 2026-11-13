import { Directive, ElementRef, HostListener, Input, inject } from "@angular/core";

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
	standalone: true,
})
export class MinMaxDecimalDirective {
	@Input()
	public min?: number;

	@Input()
	public max?: number;

	private readonly ref = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

	@HostListener("input")
	public onInput(): void {
		const val = parseInt(this.ref.value, 10);
		if (this.max != null && !Number.isNaN(val) && val >= this.max) {
			this.ref.value = this.max.toString();
		} else if (this.min != null && !Number.isNaN(val) && val <= this.min) {
			this.ref.value = this.min.toString();
		}
	}

	@HostListener("keypress", ["$event"])
	public restrictToNumeric(event: KeyboardEvent): boolean {
		return /^([0-9.,])$/.test(event.key);
	}
}

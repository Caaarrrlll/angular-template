import { Directive, ElementRef, Input, inject } from "@angular/core";

/**
 * Set min max values on mat inputs.
 *
 * @example
 *      <input matInput type="number" appMinMax [min]="min" [max]="max" />
 *
 * @param min
 * @param max
 */

@Directive({
	selector: "[appMinMax]",
	host: {
		"(input)": "onInput()",
		"(keypress)": "restrictToNumeric($event)",
	},
})
export class MinMaxDirective {
	@Input()
	public min?: number;

	@Input()
	public max?: number;

	private readonly ref = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

	public onInput(): void {
		const val = parseInt(this.ref.value, 10);
		if (this.max != null && !Number.isNaN(val) && val >= this.max) {
			this.ref.value = this.max.toString();
		} else if (this.min != null && !Number.isNaN(val) && val <= this.min) {
			this.ref.value = this.min.toString();
		}
	}

	public restrictToNumeric(event: KeyboardEvent): boolean {
		return /^([0-9])$/.test(event.key);
	}
}

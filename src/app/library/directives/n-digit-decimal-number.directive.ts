import { Directive, ElementRef, Input, inject } from "@angular/core";

/**
 * Important to note, the input must be of type textbox for this directive to work.
 * A default value of 2 decimal places is set, if you wish to change this simply pass the numberOfDecimals input in.
 *
 * @example
 *      <input appNDigitDecimalNumber numberOfDecimals="3" type="textbox" .... />
 *
 * @param numberOfDecimals
 */
@Directive({
	selector: "[appNDigitDecimalNumber]",
	host: {
		"(keydown)": "onKeyDown($event)",
	},
})
export class NDigitDecimalNumberDirective {
	@Input() numberOfDecimals = "2";

	private readonly specialKeys: string[] = ["Backspace", "Tab", "End", "Home", "-", "ArrowLeft", "ArrowRight", "Del", "Delete", "Enter"];

	private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

	onKeyDown(event: KeyboardEvent): void {
		if (this.specialKeys.includes(event.key)) {
			return;
		}
		const current: string = this.element.nativeElement.value;
		const position = this.element.nativeElement.selectionStart ?? 0;
		const next: string = [current.slice(0, position), event.key == "Decimal" ? "." : event.key, current.slice(position)].join("");
		const regex = new RegExp(`^\\d*\\.?\\d{0,${this.numberOfDecimals}}$`, "g");
		if (next && !next.match(regex)) {
			event.preventDefault();
		}
	}
}

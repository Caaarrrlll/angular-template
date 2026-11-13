import { Directive, ElementRef, HostListener, Input, inject } from "@angular/core";

/**
 * Important to note, the input must be of type textbox for this directive to work.
 * A default value of 2 decimal places is set, if you wish to change this simply pass the numberOfDecimals input in.
 *
 * @example
 *      <input NDigitDecimalNumber numberOfDecimals="3" type="textbox" .... />
 *
 * @param numberOfDecimals
 */
@Directive({
	selector: "[NDigitDecimalNumber]",
	standalone: true,
})
export class NDigitDecimalNumberDirective {
	@Input() numberOfDecimals = "2";

	private readonly specialKeys: string[] = ["Backspace", "Tab", "End", "Home", "-", "ArrowLeft", "ArrowRight", "Del", "Delete", "Enter"];

	private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);

	@HostListener("keydown", ["$event"])
	onKeyDown(event: KeyboardEvent): void {
		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}
		const current: string = this.element.nativeElement.value;
		const position = this.element.nativeElement.selectionStart ?? 0;
		const next: string = [current.slice(0, position), event.key == "Decimal" ? "." : event.key, current.slice(position)].join("");
		const regex = new RegExp(`^\\d*\\.?\\d{0,${this.numberOfDecimals}}$`, "g");
		if (next && !String(next).match(regex)) {
			event.preventDefault();
		}
	}
}

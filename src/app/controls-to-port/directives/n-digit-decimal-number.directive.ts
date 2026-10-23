import { Directive, ElementRef, HostListener, Input, NgModule } from "@angular/core";

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
})
export class NDigitDecimalNumberDirective {
	@Input() numberOfDecimals = "2";

	private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home", "-", "ArrowLeft", "ArrowRight", "Del", "Delete", "Enter"];

	constructor(private element: ElementRef) {}

	@HostListener("keydown", ["$event"])
	onKeyDown(event: KeyboardEvent) {
		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}
		const current: string = this.element.nativeElement.value;
		const position = this.element.nativeElement.selectionStart;
		const next: string = [current.slice(0, position), event.key == "Decimal" ? "." : event.key, current.slice(position)].join("");
		const regex = new RegExp(`^\\d*\\.?\\d{0,${this.numberOfDecimals}}$`, "g");
		if (next && !String(next).match(regex)) {
			event.preventDefault();
		}
	}
}
@NgModule({
	imports: [],
	declarations: [NDigitDecimalNumberDirective],
	exports: [NDigitDecimalNumberDirective],
})
export class NDigitDecimalNumberDirectiveModule {}

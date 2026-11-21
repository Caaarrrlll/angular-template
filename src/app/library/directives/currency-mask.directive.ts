import { getCurrencySymbol } from "@angular/common";
import { DEFAULT_CURRENCY_CODE, Directive, Input, LOCALE_ID, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
	selector: "[formControlName][appCurrencyMask]",
	host: {
		"(ngModelChange)": "onModelChange($event)",
		"(keydown.backspace)": "keydownBackspace($event)",
	},
})
export class CurrencyMaskDirective {
	public readonly ngControl = inject(NgControl);
	/** ISO 4217 code whose narrow symbol prefixes the value; defaults to the app's `DEFAULT_CURRENCY_CODE`. */
	@Input() public currencyCode: string = inject(DEFAULT_CURRENCY_CODE);
	private readonly localeId: string = inject(LOCALE_ID);

	onModelChange(event: Event): void {
		this.onInputChange(typeof event === "string" ? event : "", false);
	}

	keydownBackspace(event: Event): void {
		if (!(event.target instanceof HTMLInputElement)) return;
		this.onInputChange(event.target.value, true);
	}

	private onInputChange(value: string, backspace: boolean): void {
		let newVal = value.replace(/\D/g, "");

		if (backspace && newVal.length <= 6) {
			newVal = newVal.substring(0, newVal.length - 1);
		}
		if (newVal.length === 0) {
			newVal = "";
		} else if (newVal.length <= 3) {
			newVal = newVal.replace(/^(\d{0,3})/, "$1");
		} else if (newVal.length <= 4) {
			newVal = newVal.replace(/^(\d{0,1})(\d{0,3})/, "$1,$2");
		} else if (newVal.length <= 5) {
			newVal = newVal.replace(/^(\d{0,2})(\d{0,3})/, "$1,$2");
		} else if (newVal.length <= 6) {
			newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "$1,$2");
		} else if (newVal.length <= 7) {
			newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,4})/, "$1,$2,$3");
		} else if (newVal.length <= 8) {
			newVal = newVal.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})/, "$1,$2,$3");
		} else if (newVal.length <= 9) {
			newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, "$1,$2,$3");
		} else {
			newVal = newVal.substring(0, 10);
			newVal = newVal.replace(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/, "$1,$2,$3,$4");
		}

		// eslint-disable-next-line @typescript-eslint/no-deprecated -- same symbol lookup as input-currency; CurrencyPipe cannot return the symbol alone
		this.ngControl.valueAccessor?.writeValue(getCurrencySymbol(this.currencyCode, "narrow", this.localeId) + newVal);
	}

	toNumber(val: string): string {
		return val
			.split("")
			.filter((x) => !isNaN(Number(x)))
			.join("");
	}
}

import { CurrencyPipe } from "@angular/common";
import { Directive, ElementRef, HostListener, Input, NgModule, OnInit } from "@angular/core";
import { LocalizeService } from "@apis/localize/localize.service";

/**
 * Apply currency pipe to input field. No Decimals.
 * @example
 *      <input matInput type="text" currencyInput [min]="min" [max]="max" />
 *
 * When the value needs to be submitted use the following:
 *
 *      if (Number.isNaN(Number(value))) value = value.replace(/[^0-9.]+/g, "");
 */

@Directive({ selector: "[currencyInput]" })
export class CurrencyInputDirective implements OnInit {
	@Input()
	public min: number;

	@Input()
	public max: number;

	private el: HTMLInputElement;
	currencyCode: string = this._localizeService.getCurrency();

	constructor(private elementRef: ElementRef, private currencyPipe: CurrencyPipe, private _localizeService: LocalizeService) {
		this.el = this.elementRef.nativeElement;
	}

	ngOnInit() {
		this.el.value = this.currencyPipe.transform(this.el.value, this.currencyCode, "symbol", "1.0-0");
	}

	@HostListener("ngModelChange") change(): string {
		this.el.value = this.el.value.replace(/[^0-9.]+/g, "");
		if (Number.isNaN(Number(this.el.value))) return;
		if (this.max !== null && this.max !== undefined && Number(this.el.value) > this.max) {
			this.el.value = this.max.toString();
		} else if (this.min !== null && this.min !== undefined && Number(this.el.value) < this.min) {
			this.el.value = this.min.toString();
		}
		this.el.value = this.currencyPipe.transform(this.el.value, this.currencyCode, "symbol", "1.0-0");
		return this.el.value;
	}
}

@NgModule({
	imports: [],
	declarations: [CurrencyInputDirective],
	exports: [CurrencyInputDirective],
})
export class CurrencyInputDirectiveModule { }

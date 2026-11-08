import { CurrencyPipe } from "@angular/common";
import { Directive, ElementRef, HostListener, Input, OnInit, inject } from "@angular/core";

/**
 * Apply currency pipe to input field. No Decimals.
 * @example
 *      <input matInput type="text" currencyInput [currencyCode]="currencyCode" [min]="min" [max]="max" />
 *
 * When the value needs to be submitted use the following:
 *
 *      if (Number.isNaN(Number(value))) value = value.replace(/[^0-9.]+/g, "");
 */

@Directive({ selector: "[currencyInput]", standalone: true })
export class CurrencyInputDirective implements OnInit {
	@Input()
	public currencyCode = "ZAR";

	@Input()
	public min?: number;

	@Input()
	public max?: number;

	private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	private readonly currencyPipe = inject(CurrencyPipe);

	private el: HTMLInputElement;

	constructor() {
		this.el = this.elementRef.nativeElement;
	}

	ngOnInit(): void {
		this.el.value = this.currencyPipe.transform(this.el.value, this.currencyCode, "symbol", "1.0-0") ?? "";
	}

	@HostListener("ngModelChange") change(): string | undefined {
		this.el.value = this.el.value.replace(/[^0-9.]+/g, "");
		if (Number.isNaN(Number(this.el.value))) return;
		if (this.max != null && Number(this.el.value) > this.max) {
			this.el.value = this.max.toString();
		} else if (this.min != null && Number(this.el.value) < this.min) {
			this.el.value = this.min.toString();
		}
		this.el.value = this.currencyPipe.transform(this.el.value, this.currencyCode, "symbol", "1.0-0") ?? "";
		return this.el.value;
	}
}

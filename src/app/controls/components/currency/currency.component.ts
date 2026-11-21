import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, DEFAULT_CURRENCY_CODE, inject, input } from "@angular/core";

@Component({
	selector: "app-currency",
	imports: [CurrencyPipe],
	template: `<span class="currency">{{ amount() ?? 0 | currency: currencyCode() : "symbol-narrow" : digitsInfo() }}</span>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
	/** Nullable on purpose: table/card callers pass untyped API data, and the template falls back to 0. */
	public readonly amount = input<string | number | null | undefined>(0);
	public readonly currencyCode = input<string>(inject(DEFAULT_CURRENCY_CODE));
	public readonly digitsInfo = input<string>("1.0-0");
}

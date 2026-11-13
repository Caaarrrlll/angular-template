import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
	selector: "app-currency",
	standalone: true,
	imports: [CurrencyPipe],
	template: `<span class="currency">{{ amount() ?? 0 | currency: currencyCode() : "symbol-narrow" : digitsInfo() }}</span>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
	public readonly amount = input<string | number>(0);
	public readonly currencyCode = input<string>("ZAR");
	public readonly digitsInfo = input<string>("1.0-0");
}

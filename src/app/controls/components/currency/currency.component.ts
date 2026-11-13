import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "app-currency",
	standalone: true,
	imports: [CurrencyPipe],
	template: `<span class="currency">{{ amount ?? 0 | currency: currencyCode : "symbol-narrow" : digitsInfo }}</span>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
	@Input() public amount: string | number = 0;
	@Input() public currencyCode: string = "ZAR";
	@Input() public digitsInfo: string = "1.0-0";
}

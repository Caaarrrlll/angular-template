import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CurrencyComponent } from "./currency/currency.component";
@NgModule({
	imports: [CommonModule],
	declarations: [CurrencyComponent],
	exports: [CurrencyComponent],
})
export class CustCurrencyModule {}

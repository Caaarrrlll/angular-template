import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CurrencyInStringPipe } from "@pipes/currency-in-string-pipe/currency-in-string.pipe";

@NgModule({
	declarations: [CurrencyInStringPipe],
	exports: [CurrencyInStringPipe],
	imports: [CommonModule],
})
export class CurrencyInStringModule {}

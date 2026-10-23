import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HideTradeRetailPipe } from "@pipes/hide-trade-retail-pipe/hide-trade-retail.pipe";

@NgModule({
	declarations: [HideTradeRetailPipe],
	imports: [CommonModule],
	exports: [HideTradeRetailPipe],
})
export class HideTradeRetailModule {}

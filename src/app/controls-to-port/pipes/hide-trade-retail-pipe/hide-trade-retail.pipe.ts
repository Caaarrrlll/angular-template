import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "hideTradeRetail",
})
export class HideTradeRetailPipe implements PipeTransform {
	transform(value: string): string {
		return value.replace(/Trade:\s*\d+\.\d+/, "Trade: *****").replace(/Retail:\s*\d+\.\d+/, "Retail: *****");
	}
}

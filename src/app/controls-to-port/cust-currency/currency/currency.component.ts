import { Component, Input, OnInit } from "@angular/core";
import { LocalizeService } from "@apis/localize/localize.service";

@Component({
	selector: "cust-currency",
	templateUrl: "./currency.component.html",
	styleUrls: ["./currency.component.scss"],
})
export class CurrencyComponent implements OnInit {
	@Input() amount: string;
	CurrencyCode: string = "";

	constructor(private _localizeService: LocalizeService) {}

	ngOnInit() {
		this.CurrencyCode = this._localizeService.getCurrency();
	}
}

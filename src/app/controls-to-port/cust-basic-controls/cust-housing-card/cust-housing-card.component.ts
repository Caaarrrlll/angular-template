import { AfterContentInit, Component, Input } from "@angular/core";
import { UserSettingsModel } from "src/app/modules/settings/models/settings.model";

@Component({
	selector: "cust-housing-card",
	templateUrl: "./cust-housing-card.component.html",
	styleUrls: ["./cust-housing-card.component.scss"],
})
export class CustHousingCardComponent implements AfterContentInit {
	@Input() title: string;
	@Input() height: string;

	conentHeight: string = "";

	constructor(public userSettingsModel: UserSettingsModel) {}

	ngAfterContentInit(): void {
		this.conentHeight = parseInt(this.height) - 50 + "px";
	}
}

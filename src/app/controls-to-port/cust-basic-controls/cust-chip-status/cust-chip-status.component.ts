import { Component, Input, OnInit } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { _ChipStatus } from "./enums/cust-chip-status.enum";

@Component({
	selector: "cust-chip-status",
	templateUrl: "./cust-chip-status.component.html",
	styleUrls: ["./cust-chip-status.component.scss"],
})
export class CustChipStatusComponent implements OnInit {
	@Input() text: string;
	@Input() type: string;
	@Input() isSmall?: boolean;
	@Input() showSolid?: boolean;
	chipStatus: typeof _ChipStatus = _ChipStatus;

	constructor(public MatChipsModule: MatChipsModule) {}

	ngOnInit() {
		if (!this.chipStatus[this.type]) {
			this.type = "Default";
		}
	}
}

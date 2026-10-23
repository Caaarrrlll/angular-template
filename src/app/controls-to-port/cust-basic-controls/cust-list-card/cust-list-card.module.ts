import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustButtonV2Module } from "@controls/cust-basic-controls/cust-button-v2/cust-button-v2.module";
import { CustChipStatusModule } from "@controls/cust-basic-controls/cust-chip-status/cust-chip-status.module";
import { CustChipsModule } from "@controls/cust-basic-controls/cust-chips/cust-chips.module";
import { CustCountDownModule } from "@controls/cust-count-down/cust-count-down.module";
import { CustCurrencyModule } from "src/app/controls/cust-currency/cust-currency.module";
import { CustDistanceModule } from "src/app/controls/cust-distance/cust-distance.module";
import { CustSensitiveInfoModule } from "src/app/controls/cust-sensitive-info/cust-sensitive-info.module";
import { CustButtonModule } from "../../cust-button/cust-button.module";
import { CustListCardComponent } from "./cust-list-card.component";

@NgModule({
	declarations: [CustListCardComponent],
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatCardModule,
		CustSensitiveInfoModule,
		CustButtonModule,
		CustCurrencyModule,
		CustDistanceModule,
		CustButtonV2Module,
		CustChipStatusModule,
		CustChipsModule,
		CustCountDownModule,
	],
	exports: [CustListCardComponent],
})
export class CustListCardModule {}

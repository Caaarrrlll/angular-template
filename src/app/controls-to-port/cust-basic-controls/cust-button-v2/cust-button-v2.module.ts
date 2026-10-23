import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CustLoaderModule } from "@controls/cust-loader/cust-loader.module";
import { CustButtonPrimaryComponent } from "../cust-button-primary/cust-button-primary.component";
import { CustButtonSecondaryComponent } from "../cust-button-secondary/cust-button-secondary.component";
import { CustButtonTertiaryComponent } from "../cust-button-tertiary/cust-button-tertiary.component";
import { CustButtonTextComponent } from "../cust-button-text/cust-button-text.component";
import { CustButtonV2Component } from "./cust-button-v2.component";

@NgModule({
	declarations: [CustButtonV2Component, CustButtonTertiaryComponent, CustButtonPrimaryComponent, CustButtonSecondaryComponent, CustButtonTextComponent],
	imports: [CommonModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatTooltipModule, CustLoaderModule],
	exports: [CustButtonV2Component, CustButtonTertiaryComponent, CustButtonPrimaryComponent, CustButtonSecondaryComponent, CustButtonTextComponent],
})
export class CustButtonV2Module {}

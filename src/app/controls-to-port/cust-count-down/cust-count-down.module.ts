import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustCountdownComponent } from "@controls/cust-count-down/cust-count-down.component";
import { MaterialModule } from "src/app/material.module";

@NgModule({
	imports: [CommonModule, MaterialModule],
	declarations: [CustCountdownComponent],
	exports: [CustCountdownComponent],
})
export class CustCountDownModule {}

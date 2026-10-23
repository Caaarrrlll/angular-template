import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { KeyValueV3Component } from "@controls/cust-key-value/key-value-v3/key-value-v3.component";
import { KeyValueV2Component } from "./key-value-v2/key-value-v2.component";
import { KeyValueComponent } from "./key-value/key-value.component";

@NgModule({
	imports: [CommonModule, MatIconModule],
	declarations: [KeyValueComponent, KeyValueV2Component, KeyValueV3Component],
	exports: [KeyValueComponent, KeyValueV2Component, KeyValueV3Component],
})
export class CustKeyValueModule {}

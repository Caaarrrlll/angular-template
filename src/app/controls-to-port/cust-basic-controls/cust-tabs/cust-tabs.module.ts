import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { CustTabsComponent } from "./cust-tabs.component";

@NgModule({
	declarations: [CustTabsComponent],
	imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, MatTabsModule],
	exports: [CustTabsComponent],
})
export class CustTabsModule {}

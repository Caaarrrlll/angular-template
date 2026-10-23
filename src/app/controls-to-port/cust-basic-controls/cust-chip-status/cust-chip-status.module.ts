import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { CustChipStatusComponent } from "./cust-chip-status.component";

@NgModule({
	declarations: [CustChipStatusComponent],
	imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule],
	exports: [CustChipStatusComponent],
})
export class CustChipStatusModule {}

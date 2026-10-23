import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { CustChipsComponent } from "./cust-chips.component";

@NgModule({
	declarations: [CustChipsComponent],
	imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule],
	exports: [CustChipsComponent],
})
export class CustChipsModule {}

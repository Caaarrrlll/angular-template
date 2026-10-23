import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { CustLoaderModule } from "@controls/cust-loader/cust-loader.module";
import { CustDekraButtonComponent } from "./cust-dekra-button.component";

@NgModule({
	declarations: [CustDekraButtonComponent],
	imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, CustLoaderModule],
	exports: [CustDekraButtonComponent],
})
export class CustDekraButtonModule {}

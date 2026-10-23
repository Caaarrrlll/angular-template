import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CustInputCurrencyComponent } from "./cust-input-currency/cust-input-currency.component";

@NgModule({
	imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule],
	declarations: [CustInputCurrencyComponent],
	exports: [CustInputCurrencyComponent],
})
export class CustInputCurrencyModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CustInputTextComponent } from "./cust-input-text/cust-input-text.component";

@NgModule({
	imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatNativeDateModule, MatDatepickerModule],
	declarations: [CustInputTextComponent],
	exports: [CustInputTextComponent],
})
export class CustInputTextModule {}

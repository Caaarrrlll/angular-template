import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CustInputNumberComponent } from "./cust-input-number/cust-input-number.component";

@NgModule({
	imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule],
	declarations: [CustInputNumberComponent],
	exports: [CustInputNumberComponent],
})
export class CustInputNumberModule {}

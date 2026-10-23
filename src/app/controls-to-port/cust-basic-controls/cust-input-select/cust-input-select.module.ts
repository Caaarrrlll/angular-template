import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { CustInputSelectComponent } from "./cust-input-select/cust-input-select.component";

@NgModule({
	imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, ReactiveFormsModule],
	declarations: [CustInputSelectComponent],
	exports: [CustInputSelectComponent],
})
export class CustInputSelectModule {}

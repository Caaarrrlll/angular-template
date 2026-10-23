import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CustInputPhoneComponent } from "./cust-input-phone/cust-input-phone.component";

@NgModule({
	imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
	declarations: [CustInputPhoneComponent],
	exports: [CustInputPhoneComponent],
})
export class CustInputPhoneModule {}

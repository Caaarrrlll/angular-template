import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CustInputEMailComponent } from "./cust-input-email/cust-input-email.component";

@NgModule({
	imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
	declarations: [CustInputEMailComponent],
	exports: [CustInputEMailComponent],
})
export class CustInputEMailModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CustSlideToggleComponent } from "./cust-slide-toggle/cust-slide-toggle.component";

@NgModule({
	imports: [CommonModule, MatSlideToggleModule, FormsModule, MatFormFieldModule],
	declarations: [CustSlideToggleComponent],
	exports: [CustSlideToggleComponent],
})
export class CustSlideToggleModule {}

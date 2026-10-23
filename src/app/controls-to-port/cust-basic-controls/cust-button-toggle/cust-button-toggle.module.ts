import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { CustButtonToggleComponent } from "./cust-button-toggle/cust-button-toggle.component";

@NgModule({
	imports: [CommonModule, MatButtonToggleModule, MatIconModule, FormsModule, ReactiveFormsModule],
	declarations: [CustButtonToggleComponent],
	exports: [CustButtonToggleComponent],
})
export class CustButtonToggleModule {}

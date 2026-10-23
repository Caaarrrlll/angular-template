import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { CustRangeDatePickerComponent } from "./cust-range-date-picker.component";

@NgModule({
	declarations: [CustRangeDatePickerComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatDialogModule, MatInputModule],
	exports: [CustRangeDatePickerComponent],
})
export class CustRangeDatePickerModule {}

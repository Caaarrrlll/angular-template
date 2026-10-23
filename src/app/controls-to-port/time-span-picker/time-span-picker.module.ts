import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TimeSpanPickerComponent } from "./time-span-picker.component";

@NgModule({
	declarations: [TimeSpanPickerComponent],
	imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
	exports: [TimeSpanPickerComponent],
})
export class TimeSpanPickerModule {}

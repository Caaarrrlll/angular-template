import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { DateRange, MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { provideNativeDateAdapter } from "@angular/material/core";
import { DateTimeOpsService } from "@shared/services/date-time-ops.service";

@Component({
	selector: "app-range-date-picker",
	templateUrl: "./range-date-picker.component.html",
	styleUrls: ["./range-date-picker.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
	providers: [provideNativeDateAdapter()],
})
export class RangeDatePickerComponent {
	@Input() public selectedRangeValue?: DateRange<Date>;
	@Input() public placeholder: string = "";
	@Output() public selectedRangeValueChange: EventEmitter<DateRange<Date>> = new EventEmitter<DateRange<Date>>();

	public inputFrom: FormControl<string | null> = new FormControl<string | null>("", Validators.required);
	public inputTo: FormControl<string | null> = new FormControl<string | null>("", Validators.required);

	private readonly dateTimeOpsService = inject(DateTimeOpsService);

	public selectedChange(dateSelected: Date): void {
		if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
			this.selectedRangeValue = new DateRange<Date>(dateSelected, null);
		} else {
			const start = this.selectedRangeValue.start;
			const end = dateSelected;
			if (end < start) {
				this.selectedRangeValue = new DateRange<Date>(end, start);
			} else {
				this.selectedRangeValue = new DateRange<Date>(start, end);
			}
		}

		this.inputFrom.setValue(this.dateTimeOpsService.dateFormat(this.selectedRangeValue?.start ?? dateSelected));
		if (this.selectedRangeValue?.end) {
			this.inputTo.setValue(this.dateTimeOpsService.dateFormat(this.selectedRangeValue?.end));
			this.inputTo.setErrors(null);
		} else {
			this.inputTo.setErrors({ toMissing: true });
			this.inputTo.markAllAsTouched();
		}

		this.selectedRangeValueChange.emit(this.selectedRangeValue);
	}
}

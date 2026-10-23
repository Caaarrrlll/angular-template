import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { DateRange } from "@angular/material/datepicker";
import { MatFormFieldControl } from "@angular/material/form-field";
import { DateTimeOpsService } from "@services/date-time-ops.service";

@Component({
	selector: "cust-range-date-picker",
	templateUrl: "./cust-range-date-picker.component.html",
	styleUrls: ["./cust-range-date-picker.component.scss"],

	providers: [{ provide: MatFormFieldControl, useExisting: CustRangeDatePickerComponent }],
})
export class CustRangeDatePickerComponent implements OnInit {
	@Input() selectedRangeValue: DateRange<Date> | undefined;
	@Input() placeholder: string;
	@Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();

	inputFrom: FormControl = new FormControl("", Validators.required);
	inputTo: FormControl = new FormControl("", Validators.required);

	constructor(private dateTimeOpsService: DateTimeOpsService) {}

	ngOnInit() {}

	selectedChange(dateSelected: Date): void {
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

		this.inputFrom.setValue(this.dateTimeOpsService.dateFormat(this.selectedRangeValue?.start));
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

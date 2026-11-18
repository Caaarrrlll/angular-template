import { ChangeDetectionStrategy, Component, Input, ModelSignal, effect, inject, model } from "@angular/core";
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideNativeDateAdapter()],
})
export class RangeDatePickerComponent {
	/** Two-way bindable range: `[(selectedRangeValue)]` (replaces the old @Input + selectedRangeValueChange @Output pair; same public names). */
	public readonly selectedRangeValue: ModelSignal<DateRange<Date> | undefined> = model<DateRange<Date> | undefined>();
	@Input() public placeholder = "";

	public inputFrom: FormControl<string | null> = new FormControl<string | null>("", Validators.required.bind(Validators));
	public inputTo: FormControl<string | null> = new FormControl<string | null>("", Validators.required.bind(Validators));

	private readonly dateTimeOpsService = inject(DateTimeOpsService);

	public constructor() {
		// Keep the text fields in sync with the range, including an initial range from the parent (AUD-12).
		effect((): void => {
			const range: DateRange<Date> | undefined = this.selectedRangeValue();
			this.inputFrom.setValue(range?.start ? this.dateTimeOpsService.dateFormat(range.start) : ``);
			this.inputTo.setValue(range?.end ? this.dateTimeOpsService.dateFormat(range.end) : ``);
		});
	}

	public selectedChange(dateSelected: Date): void {
		const current: DateRange<Date> | undefined = this.selectedRangeValue();
		let next: DateRange<Date>;
		if (!current?.start || current.end) {
			next = new DateRange<Date>(dateSelected, null);
		} else if (dateSelected < current.start) {
			next = new DateRange<Date>(dateSelected, current.start);
		} else {
			next = new DateRange<Date>(current.start, dateSelected);
		}

		if (next.end) {
			this.inputTo.setErrors(null);
		} else {
			this.inputTo.setErrors({ toMissing: true });
			this.inputTo.markAllAsTouched();
		}

		// model.set() also emits selectedRangeValueChange to the parent.
		this.selectedRangeValue.set(next);
	}
}

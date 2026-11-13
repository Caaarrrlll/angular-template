import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

const DEFAULT_TIMESPAN: string = "00:00:00";

type TimeField = "days" | "hours" | "minutes";

@Component({
	selector: "app-time-span-picker",
	templateUrl: "./time-span-picker.component.html",
	styleUrls: ["./time-span-picker.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TimeSpanPickerComponent),
			multi: true,
		},
	],
})
export class TimeSpanPickerComponent implements ControlValueAccessor {
	@Input() public label: string = "";

	@Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

	public formGroup: FormGroup<{ days: FormControl<string | null>; hours: FormControl<string | null>; minutes: FormControl<string | null> }> = new FormGroup({
		days: new FormControl<string | null>("", [Validators.required, Validators.min(0), Validators.max(2)]),
		hours: new FormControl<string | null>("", [Validators.required, Validators.min(0), Validators.max(23)]),
		minutes: new FormControl<string | null>("", [Validators.required, Validators.min(0), Validators.max(59)]),
	});

	public onChange: (value: string) => void = (): void => {};
	public onTouched: () => void = (): void => {};

	private _value: string = DEFAULT_TIMESPAN;

	@Input()
	public get value(): string {
		return this._value;
	}

	public set value(timeValue: string) {
		if (!timeValue) {
			return;
		}
		this._value = timeValue;
		const fullValue: string = timeValue.includes(".") ? timeValue : `00.${timeValue}`;
		this.formGroup.controls.days.setValue(fullValue.substring(0, fullValue.indexOf(".")));
		const timeSlots: string[] = fullValue.substring(fullValue.indexOf(".") + 1).split(":");
		this.formGroup.controls.hours.setValue(timeSlots[0] ?? "");
		this.formGroup.controls.minutes.setValue(timeSlots[1] ?? "");
	}

	public validateTime(field: TimeField): void {
		const control: FormControl<string | null> = this.formGroup.controls[field];
		if (control.invalid) {
			control.patchValue("00");
		}
		const valueString: string = this.updateValueString();
		this.valueChange.emit(valueString);
		this.onChange(valueString);
		this.onTouched();
	}

	public restrictToNumeric(event: KeyboardEvent, field: TimeField): boolean {
		if (!/^([0-9])$/.test(event.key)) {
			return false;
		}
		const control: FormControl<string | null> = this.formGroup.controls[field];
		const currentTime: string = control.value !== null ? control.value.toString() : "";
		const newTimeInt: number = parseInt(currentTime.concat(event.key), 10);
		const currentTimeInt: number = parseInt(currentTime, 10);
		if (newTimeInt.toString().length > 2) {
			return false;
		}
		if (newTimeInt < 10) {
			control.patchValue("0");
		} else {
			control.patchValue(currentTimeInt.toString());
		}
		return true;
	}

	public registerOnChange(onChange: (value: string) => void): void {
		this.onChange = onChange;
	}

	public registerOnTouched(onTouched: () => void): void {
		this.onTouched = onTouched;
	}

	public writeValue(value: string | null): void {
		if (value !== null) {
			this.value = value;
		}
	}

	public setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.formGroup.disable();
		} else {
			this.formGroup.enable();
		}
	}

	private updateValueString(): string {
		const days: string = (this.formGroup.controls.days.value ?? "0").padStart(2, "0");
		const hours: string = (this.formGroup.controls.hours.value ?? "0").padStart(2, "0");
		const minutes: string = (this.formGroup.controls.minutes.value ?? "0").padStart(2, "0");
		return `${days}.${hours}:${minutes}:00`;
	}
}

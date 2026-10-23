import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { DEFAULT_TIMESPAN } from "./core/constants/default-timespan.constant";
import { TimespanInterface } from "./core/intefaces/timespan.interface";

@Component({
	selector: "app-time-span-picker",
	templateUrl: "./time-span-picker.component.html",
	styleUrls: ["./time-span-picker.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TimeSpanPickerComponent),
			multi: true,
		},
	],
})
export class TimeSpanPickerComponent implements ControlValueAccessor {
	private _value: string = DEFAULT_TIMESPAN;

	public formGroup: FormGroup = new FormGroup({
		days: new FormControl("", [Validators.required, Validators.min(0), Validators.max(2)]),
		hours: new FormControl("", [Validators.required, Validators.min(0), Validators.max(23)]),
		minutes: new FormControl("", [Validators.required, Validators.min(0), Validators.max(59)]),
	});

	// Form control properties
	public onChange: any = (value: string) => {};
	public onTouched: any = () => {};
	public touched: boolean = false;
	public timespan: TimespanInterface = { days: 0, hours: 0, minutes: 0 };

	constructor() {}

	@Input() public label: string = "";


	@Input()
	public get value(): string {
		return this._value;
	}

	public set value(timeValue: string) {
		if (!timeValue) {
			return;
		}
		this._value = timeValue;

		timeValue = timeValue.includes(".") ? timeValue : "00." + timeValue;
		this.formGroup.get("days").setValue(timeValue.substring(0, timeValue.indexOf(".")));
		timeValue = timeValue.substring(timeValue.indexOf(".") + 1, timeValue.length);
		const timeSlots: string[] = timeValue.split(":");
		this.formGroup.get("hours").setValue(timeSlots[0]);
		this.formGroup.get("minutes").setValue(timeSlots[1]);
	}

	public validateTime(field: string): void {
		if (this.formGroup.get(field).invalid) {
			this.formGroup.get(field).patchValue("00");
		}
		const valueString: string = this.updateValueString();
		this.valueChange.emit(valueString);
		this.onChange(valueString);
	}

	public restrictToNumeric(event, field): boolean {
		const isValid = /^([0-9])$/.test(event.key);
		if (!isValid) {
			return false;
		}
		let currentTime = this.formGroup.get(field).value !== null ? this.formGroup.get(field).value.toString() : "";
		let newTime = currentTime.concat(event.key.toString());
		let newTimeInt = parseInt(newTime, 10);
		let currentTimeInt = parseInt(currentTime, 10);
		if (newTimeInt.toString().length > 2) {
			return false;
		}
		if (newTimeInt < 10) {
			this.formGroup.get(field).patchValue("0");
		} else {
			this.formGroup.get(field).patchValue(currentTimeInt.toString());
		}
		return true;
	}

	private updateValueString(): string {
		return `${this.formGroup.get("days").value.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		})}.${this.formGroup.get("hours").value.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		})}:${this.formGroup.get("minutes").value.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		})}:00`;
	}

	@Output() public valueChange: EventEmitter<string> = new EventEmitter();

	// Implementation of ControlValueAccessor
	public registerOnChange(onChange: any) {
		this.onChange = onChange;
	}

	public registerOnTouched(onTouched: any) {
		this.onTouched = onTouched;
	}

	public writeValue(value: string): void {
		if (value !== undefined) {
			this.value = value;
		}
	}

	public setDisabledState(value: boolean) {
		value ? this.formGroup.disable() : this.formGroup.enable();
	}
}

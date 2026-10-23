import { Component, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "app-range-checkbox-group",
	templateUrl: "./range-checkbox-group.component.html",
	styleUrls: ["./range-checkbox-group.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: RangeCheckboxGroupComponent,
			multi: true,
		},
	],
})
export class RangeCheckboxGroupComponent implements OnInit, ControlValueAccessor {
	@Input() public multi: boolean = false;

	public value: string[] = [];

	constructor() {}

	ngOnInit(): void {}

	public onChange = (value: string[]) => {};
	public onTouch = () => {};

	public registerOnChange(fn: (value: string[]) => void) {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void) {
		this.onTouch = fn;
	}

	public writeValue(value: string[]) {
		this.value = value;
	}

	public toggleValue(selectedValue: string) {
		if (this.multi) {
			const index = this.value.findIndex((item) => item["min"] === selectedValue["min"]);

			if (index > -1) {
				this.value = this.value.filter((item) => item["min"] !== selectedValue["min"]);
			} else {
				this.value = [...this.value, selectedValue];
			}
		} else {
			if (this.value[0] && this.value[0]["min"] === selectedValue["min"]) {
				this.value = [];
			} else {
				this.value = [selectedValue];
			}
		}

		this.onChange(this.value);
		this.onTouch();
	}

	public isSelected(valueToCheck: { min: number; max: number }) {
		if (this.value.length < 1) {
			return false;
		}
		return this.value.findIndex((item) => item["min"] === valueToCheck["min"]) > -1;
	}
}

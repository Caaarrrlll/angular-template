import { Component, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "app-checkbox-group",
	templateUrl: "./checkbox-group.component.html",
	styleUrls: ["./checkbox-group.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: CheckboxGroupComponent,
			multi: true,
		},
	],
})
export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {
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
			const index = this.value.indexOf(selectedValue);

			if (index > -1) {
				this.value = [...this.value.slice(0, index), ...this.value.slice(index + 1)];
			} else {
				this.value = [...this.value, selectedValue];
			}
		} else {
			this.value = [selectedValue];
		}

		this.onChange(this.value);
		this.onTouch();
	}

	public isSelected(valueToCheck: string) {
		return this.value.includes(valueToCheck);
	}
}

import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RangeCheckboxValue } from "@shared/components/range-checkbox-group/range-checkbox-group.interface";

@Component({
	selector: "app-range-checkbox-group",
	templateUrl: "./range-checkbox-group.component.html",
	styleUrls: ["./range-checkbox-group.component.scss"],
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: RangeCheckboxGroupComponent,
			multi: true,
		},
	],
})
export class RangeCheckboxGroupComponent implements ControlValueAccessor {
	@Input() public multi = false;

	public value: RangeCheckboxValue[] = [];

	private onChange: (value: RangeCheckboxValue[]) => void = () => undefined;
	private onTouch: () => void = () => undefined;

	public registerOnChange(fn: (value: RangeCheckboxValue[]) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouch = fn;
	}

	public writeValue(value: RangeCheckboxValue[] | null): void {
		this.value = value ?? [];
	}

	public toggleValue(selectedValue: RangeCheckboxValue): void {
		if (this.multi) {
			const isSelected = this.value.some((item) => item.min === selectedValue.min);
			this.value = isSelected ? this.value.filter((item) => item.min !== selectedValue.min) : [...this.value, selectedValue];
		} else {
			this.value = this.value[0]?.min === selectedValue.min ? [] : [selectedValue];
		}

		this.onChange(this.value);
		this.onTouch();
	}

	public isSelected(valueToCheck: RangeCheckboxValue): boolean {
		return this.value.some((item) => item.min === valueToCheck.min);
	}
}

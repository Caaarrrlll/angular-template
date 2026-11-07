import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "app-checkbox-group",
	templateUrl: "./checkbox-group.component.html",
	styleUrls: ["./checkbox-group.component.scss"],
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: CheckboxGroupComponent,
			multi: true,
		},
	],
})
export class CheckboxGroupComponent implements ControlValueAccessor {
	@Input() public multi = false;

	public value: string[] = [];

	private onChange: (value: string[]) => void = () => undefined;
	private onTouch: () => void = () => undefined;

	public registerOnChange(fn: (value: string[]) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouch = fn;
	}

	public writeValue(value: string[] | null): void {
		this.value = value ?? [];
	}

	public toggleValue(selectedValue: string): void {
		if (this.multi) {
			const index = this.value.indexOf(selectedValue);
			this.value = index > -1 ? this.value.filter((item) => item !== selectedValue) : [...this.value, selectedValue];
		} else {
			this.value = [selectedValue];
		}

		this.onChange(this.value);
		this.onTouch();
	}

	public isSelected(valueToCheck: string): boolean {
		return this.value.includes(valueToCheck);
	}
}

import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RangeCheckboxValue } from "@shared/components/range-checkbox-group/range-checkbox-group.interface";

@Component({
	selector: "app-range-checkbox-group",
	templateUrl: "./range-checkbox-group.component.html",
	styleUrls: ["./range-checkbox-group.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
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

	// Signal so the projected OnPush checkboxes re-render on writeValue/toggle (they read it via isSelected()).
	public readonly value: WritableSignal<RangeCheckboxValue[]> = signal<RangeCheckboxValue[]>([]);

	private onChange: (value: RangeCheckboxValue[]) => void = () => undefined;
	private onTouch: () => void = () => undefined;

	public registerOnChange(fn: (value: RangeCheckboxValue[]) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouch = fn;
	}

	public writeValue(value: RangeCheckboxValue[] | null): void {
		this.value.set(value ?? []);
	}

	public toggleValue(selectedValue: RangeCheckboxValue): void {
		if (this.multi) {
			const current = this.value();
			const isSelected = current.some((item) => item.min === selectedValue.min);
			this.value.set(isSelected ? current.filter((item) => item.min !== selectedValue.min) : [...current, selectedValue]);
		} else {
			this.value.set(this.value()[0]?.min === selectedValue.min ? [] : [selectedValue]);
		}

		this.onChange(this.value());
		this.onTouch();
	}

	public isSelected(valueToCheck: RangeCheckboxValue): boolean {
		return this.value().some((item) => item.min === valueToCheck.min);
	}
}

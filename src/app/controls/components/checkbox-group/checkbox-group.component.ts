import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "app-checkbox-group",
	templateUrl: "./checkbox-group.component.html",
	styleUrls: ["./checkbox-group.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
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

	// Signal so the projected OnPush checkboxes re-render on writeValue/toggle (they read it via isSelected()).
	public readonly value: WritableSignal<string[]> = signal<string[]>([]);

	private onChange: (value: string[]) => void = () => undefined;
	private onTouch: () => void = () => undefined;

	public registerOnChange(fn: (value: string[]) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouch = fn;
	}

	public writeValue(value: string[] | null): void {
		this.value.set(value ?? []);
	}

	public toggleValue(selectedValue: string): void {
		if (this.multi) {
			const current = this.value();
			this.value.set(current.includes(selectedValue) ? current.filter((item) => item !== selectedValue) : [...current, selectedValue]);
		} else {
			this.value.set([selectedValue]);
		}

		this.onChange(this.value());
		this.onTouch();
	}

	public isSelected(valueToCheck: string): boolean {
		return this.value().includes(valueToCheck);
	}
}

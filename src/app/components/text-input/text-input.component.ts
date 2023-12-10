import { Component } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: "app-text-input",
	templateUrl: "./text-input.component.html",
	styleUrls: ["./text-input.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: TextInputComponent,
		},
		// {
		// 	provide: NG_VALIDATORS,
		// 	multi: true,
		// 	useExisting: AddressFormComponent,
		// },
	],
})
export class TextInputComponent implements ControlValueAccessor /*,Validator*/ {
	textValue = "";
	touched = false;
	disabled = false;

	// eslint-disable-next-line
	onChange: any = (textValue: string) => {};

	onTouched: any = () => {};

	writeValue(textValue: string): void {
		this.textValue = textValue;
	}

	registerOnChange(fn: unknown): void {
		this.onChange = fn;
	}

	registerOnTouched(onTouched: unknown): void {
		this.onTouched = onTouched;
	}

	markAsTouched(): void {
		if (!this.touched) {
			this.onTouched();
			this.touched = true;
		}
	}

	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}
}

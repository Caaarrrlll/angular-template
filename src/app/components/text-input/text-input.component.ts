import { Component } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Component({
	selector: "app-text-input",
	templateUrl: "./text-input.component.html",
	styleUrls: ["./text-input.component.scss"],
})
export class TextInputComponent implements ControlValueAccessor {
	textValue: string = "";
	onChange: unknown = () => {};
	onTouched: any = () => {};

	constructor() {}

	writeValue(textValue: string): void {
		this.textValue = textValue;
		this.onChange(this.textValue);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}

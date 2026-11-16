import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const value: unknown = control.value;
		const stringValue = String(value);
		if (value === null || value === undefined || value === "") {
			return null;
		}
		return emailRegex.test(stringValue) ? null : { invalidEmail: { value } };
	};
}

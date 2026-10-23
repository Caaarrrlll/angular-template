import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const value = control.value;
		if (value === null || value === undefined || value === "") {
			return null;
		}
		return emailRegex.test(value) ? null : { invalidEmail: { value } };
	};
}

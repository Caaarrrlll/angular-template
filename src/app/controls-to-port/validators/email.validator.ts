import { AbstractControl, ValidatorFn } from "@angular/forms";

export function emailValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(control.value) ? null : { invalidEmail: { value: control.value } };
	};
}

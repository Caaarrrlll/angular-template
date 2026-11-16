import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function idNumberValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const idNumberRegex = /(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/;
		const value: unknown = control.value;
		const stringValue = String(value);
		if (!value) {
			return null;
		}
		return idNumberRegex.test(stringValue) ? null : { invalidIdNumber: { value } };
	};
}

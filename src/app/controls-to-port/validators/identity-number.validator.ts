import { AbstractControl, ValidatorFn } from "@angular/forms";

export function idNumberValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const idNumberRegex: RegExp = /(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/;
		return control.value ? (idNumberRegex.test(control.value) ? null : { invalidIdNumber: { value: control.value } }) : null;
	};
}

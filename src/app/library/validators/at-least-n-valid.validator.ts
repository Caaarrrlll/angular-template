import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function atLeastNValid(controlsNr: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!(control instanceof FormGroup)) {
			return null;
		}

		const formGroup = control as FormGroup;
		const controls = formGroup.controls;
		let validCount = 0;

		Object.keys(controls).forEach((key) => {
			const ctrl = controls[key];
			const value = ctrl.value;
			if (ctrl.valid && value !== null && value !== undefined && value !== "") {
				if (Array.isArray(value)) {
					if (value.length > 0) {
						validCount++;
					}
				} else if (typeof value === "string") {
					if (value.length > 0) {
						validCount++;
					}
				} else {
					validCount++;
				}
			}
		});

		return validCount >= controlsNr ? null : { atLeastNValid: true };
	};
}

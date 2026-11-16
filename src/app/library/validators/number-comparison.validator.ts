import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function numberComparisonValidator(shouldBeSmallerControlName: string, shouldBeLargerControlName: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!(control instanceof FormGroup)) {
			return null;
		}

		const formGroup = control;
		const controlA = formGroup.get(shouldBeSmallerControlName);
		const controlB = formGroup.get(shouldBeLargerControlName);

		if (!controlA || !controlB) {
			return null;
		}

		const controlAVal: unknown = controlA.value;
		const controlBVal: unknown = controlB.value;

		if (controlAVal === null || controlAVal === undefined || controlBVal === null || controlBVal === undefined) {
			return null;
		}

		return Number(controlAVal) > Number(controlBVal) ? { valuesDoNotMatch: true } : null;
	};
}

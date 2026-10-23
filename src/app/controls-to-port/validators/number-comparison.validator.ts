import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function numberComparisonValidator(_shouldBeSmallerControlName: string, _shouldBeLargerControlName: string): ValidatorFn | null {
	return (control: AbstractControl): ValidationErrors | null => {
		const formGroup = control as UntypedFormGroup;
		const controlAVal = formGroup.get(_shouldBeSmallerControlName).value;
		const controlBVal = formGroup.get(_shouldBeLargerControlName).value;

		if (controlAVal === null || controlBVal === null) return null;

		return controlAVal > controlBVal ? { valuesDoNotMatch: true } : null;
	};
}

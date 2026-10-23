import { FormGroup, ValidatorFn } from "@angular/forms";
export function atLeastNValid(controlsNr: number): ValidatorFn {
	return (formGroup: FormGroup) => {
		const controls = formGroup.controls;
		let validCount = 0;
		Object.keys(controls).map((key) => {
			if (controls[key].valid && controls[key].value?.length > 0) {
				validCount++;
			}
		});
		return validCount >= controlsNr ? null : { atLeastNValid: true };
	};
}

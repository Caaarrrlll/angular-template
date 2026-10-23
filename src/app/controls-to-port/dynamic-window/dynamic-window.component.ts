import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { BtnGroup, DialogSetup } from "@controls/dynamic-dialog/dialog-setup.model";
import { WindowRef } from "@progress/kendo-angular-dialog";
import { SnackbarService } from "@services/snackbar.service";

@Component({
	selector: "app-dynamic-window",
	templateUrl: "./dynamic-window.component.html",
	styleUrls: ["./dynamic-window.component.scss"],
})
export class DynamicWindowComponent implements OnInit {
	@Input() dialogSetup: DialogSetup;
	@Input() error;

	form: UntypedFormGroup;
	loading = false;

	constructor(private windowRef: WindowRef, private fb: UntypedFormBuilder, private _snackbarService: SnackbarService) {}

	ngOnInit(): void {
		this.form = this.fb.group({});

		this.dialogSetup.controls?.map((element, i) => {
			if (!element.formName) element.formName = i.toString();

			this.form.addControl(element.formName, new UntypedFormControl(element.value ? element.value : null));

			if (!element.validationDep) {
				this.form.controls[element.formName].clearValidators();
				if (element.required) {
					this.form.controls[element.formName].setValidators([conditionalValidator(() => element.required)]);
				}

				switch (element.validators) {
					case "phone": {
						this.form.controls[element.formName].setValidators([conditionalValidator(() => true, Validators.pattern("0[0-9]{9}"))]);
						break;
					}
					case "email": {
						this.form.controls[element.formName].setValidators([conditionalValidator(() => true, Validators.email)]);
						break;
					}
					case "nospace": {
						this.form.controls[element.formName].setValidators([conditionalValidator(() => true, Validators.pattern("[^s]+"))]);
						break;
					}
					default: {
						this.form.controls[element.formName].clearValidators();
						if (element.required) {
							this.form.controls[element.formName].setValidators([Validators.required]);
						}
						break;
					}
				}
			} else {
				this.form.controls[element.formName].clearValidators();
				if (element.required) {
					this.form.controls[element.formName].setValidators([conditionalValidator(() => element.required)]);
				}

				switch (element.validators) {
					case "phone": {
						this.form.controls[element.formName].setValidators([
							conditionalValidator(
								() => !this.form.controls[element.validationDep].value,
								Validators.compose([Validators.required, Validators.pattern("0[0-9]{9}")])
							),
						]);
						break;
					}
					case "email": {
						this.form.controls[element.formName].setValidators([
							conditionalValidator(() => !this.form.controls[element.validationDep].value, [Validators.email, Validators.required]),
						]);
						break;
					}
					case "nospace": {
						this.form.controls[element.formName].setValidators([conditionalValidator(() => true, Validators.pattern("[^s]+"))]);
						break;
					}
					default: {
						this.form.controls[element.formName].clearValidators();
						if (element.required) {
							this.form.controls[element.formName].setValidators([Validators.required]);
						}
						break;
					}
				}
			}

			if (element.disabled) {
				this.form.controls[element.formName].disable();
			}
		});
	}

	setFromValue(control, btn) {
		const dialogControl = this.dialogSetup.controls.find((x) => x.formName === control.formName);

		if (dialogControl instanceof BtnGroup) {
			dialogControl.data.map((x) => (x.selected = btn.value === x.value));
		}
		this.form.controls[control.formName].setValue(btn.value);
	}

	submit() {
		if (this.form.valid) {
			this.windowRef.close(this.form.value);
		} else {
			this._snackbarService.open("Please select a sales executive or type in a mobile number", "error");
		}
	}

	submitApproval(approval) {
		this.windowRef.close({ approval: approval, comment: this.form.value.comment });
	}

	close() {
		this.windowRef.close(false);
	}
}

function conditionalValidator(predicate, validator?) {
	return (formControl) => {
		if (!formControl.parent) {
			return null;
		}

		if (predicate()) {
			return validator(formControl);
		}
		return null;
	};
}

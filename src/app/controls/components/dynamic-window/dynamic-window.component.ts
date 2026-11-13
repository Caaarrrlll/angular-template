import { TextFieldModule } from "@angular/cdk/text-field";
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, ValidatorFn } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { ButtonPrimaryComponent } from "@shared/components/button/button-primary/button-primary.component";
import { ButtonSecondaryComponent } from "@shared/components/button/button-secondary/button-secondary.component";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { CustButtonInput } from "@shared/models/cust-basic-controls";
import { SafePipe } from "@shared/pipes/safe/safe.pipe";
import { SnackbarService } from "@shared/services/snackbar.service";
import { DialogSetup, _DialogWindowControl } from "./dynamic-window.models";

@Component({
	selector: "app-dynamic-window",
	templateUrl: "./dynamic-window.component.html",
	styleUrls: ["./dynamic-window.component.scss"],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TextFieldModule,
		SafePipe,
		LoaderComponent,
		ButtonPrimaryComponent,
		ButtonSecondaryComponent,
		MatButtonModule,
		MatButtonToggleModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSnackBarModule,
	],
})
export class DynamicWindowComponent implements OnInit {
	public readonly dialogSetup = inject<DialogSetup>(MAT_DIALOG_DATA);
	public readonly dialogRef = inject<MatDialogRef<DynamicWindowComponent>>(MatDialogRef);
	private readonly fb = inject(FormBuilder);
	private readonly snackbarService = inject(SnackbarService);

	public form: FormGroup = this.fb.group({});
	public loading = false;

	public ngOnInit(): void {
		this.form = this.fb.group({});

		this.dialogSetup.controls?.map((element: _DialogWindowControl, i: number): void => {
			const formName = element.formName || i.toString();
			element.formName = formName;

			this.form.addControl(formName, new FormControl(element.value ? element.value : null));

			const requiredValidator = conditionalValidator(() => element.required);
			const noSpaceValidator = conditionalValidator(() => true, Validators.pattern("[^s]+"));
			const phoneValidator = conditionalValidator(() => true, Validators.pattern("0[0-9]{9}"));
			const emailValidator = conditionalValidator(() => true, Validators.email);

			if (!element.validationDep) {
				this.form.controls[formName].clearValidators();
				if (element.required) {
					this.form.controls[formName].setValidators([requiredValidator]);
				}

				switch (element.validators) {
					case "phone": {
						this.form.controls[formName].setValidators([phoneValidator]);
						break;
					}
					case "email": {
						this.form.controls[formName].setValidators([emailValidator]);
						break;
					}
					case "nospace": {
						this.form.controls[formName].setValidators([noSpaceValidator]);
						break;
					}
					default: {
						this.form.controls[formName].clearValidators();
						if (element.required) {
							this.form.controls[formName].setValidators([Validators.required]);
						}
						break;
					}
				}
			} else {
				const validationDep = element.validationDep;
				const dependentPhoneValidator = conditionalValidator(
					() => !this.form.controls[validationDep].value,
					Validators.compose([Validators.required, Validators.pattern("0[0-9]{9}")]),
				);
				const dependentEmailValidator = conditionalValidator(() => !this.form.controls[validationDep].value, Validators.compose([Validators.email, Validators.required]));

				this.form.controls[formName].clearValidators();
				if (element.required) {
					this.form.controls[formName].setValidators([requiredValidator]);
				}

				switch (element.validators) {
					case "phone": {
						this.form.controls[formName].setValidators([dependentPhoneValidator]);
						break;
					}
					case "email": {
						this.form.controls[formName].setValidators([dependentEmailValidator]);
						break;
					}
					case "nospace": {
						this.form.controls[formName].setValidators([noSpaceValidator]);
						break;
					}
					default: {
						this.form.controls[formName].clearValidators();
						if (element.required) {
							this.form.controls[formName].setValidators([Validators.required]);
						}
						break;
					}
				}
			}

			if (element.disabled) {
				this.form.controls[formName].disable();
			}
		});
	}

	public setFromValue(control: _DialogWindowControl, btnValue: unknown): void {
		control.data?.map((x) => {
			x.selected = btnValue === x.value;
			return x;
		});
		this.form.controls[control.formName].setValue(btnValue);
	}

	public submit(): void {
		if (this.form.valid) {
			this.dialogRef.close(this.form.value);
		} else {
			this.snackbarService.open("Please select a sales executive or type in a mobile number", "error");
		}
	}

	public submitApproval(approval: string): void {
		this.dialogRef.close({ approval: approval, comment: this.form.value.comment });
	}

	public close(): void {
		this.dialogRef.close(false);
	}

	public buttonInput(display: string, value: string, disabled: boolean = false): CustButtonInput {
		return {
			type: "",
			icon: "",
			tooltip: "",
			display: display,
			value: value,
			disabled: disabled,
		};
	}
}

/**
 * Opens the dynamic window as a Material dialog; returns whatever the
 * window closes with (form value, `{ approval, comment }` or `false`).
 */
export function openDynamicWindow(dialog: MatDialog, dialogSetup: DialogSetup, config: MatDialogConfig): Observable<unknown> {
	const dialogRef = dialog.open(DynamicWindowComponent, { ...config, data: dialogSetup });
	return dialogRef.afterClosed();
}

function conditionalValidator(predicate: () => unknown, validator?: ValidatorFn | null): ValidatorFn {
	return (formControl: AbstractControl): ValidationErrors | null => {
		if (!formControl.parent) {
			return null;
		}

		if (predicate()) {
			return validator ? validator(formControl) : null;
		}
		return null;
	};
}

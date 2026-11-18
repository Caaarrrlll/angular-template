import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, NgZone, OnInit, ViewChild, inject } from "@angular/core";
import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, map, startWith } from "rxjs/operators";
import { ButtonToggleComponent } from "@shared/components/button-toggle/button-toggle.component";
import { ButtonToggleResponse } from "@shared/components/button-toggle/button-toggle.interface";
import { CheckboxComponent } from "@shared/components/checkbox-group/checkbox/checkbox.component";
import { CheckboxGroupComponent } from "@shared/components/checkbox-group/checkbox-group.component";
import { RangeCheckboxComponent } from "@shared/components/range-checkbox-group/range-checkbox/range-checkbox.component";
import { RangeCheckboxGroupComponent } from "@shared/components/range-checkbox-group/range-checkbox-group.component";
import { DateTransformDirective } from "@shared/directives/date-transform.directive";
import { DragAndDropFilesDirective } from "@shared/directives/drag-and-drop-files.directive";
import { MinMaxDirective } from "@shared/directives/min-max.directive";
import { SnackbarService } from "@shared/services/snackbar.service";
import { CheckBox, CheckBoxRange, DynamicDialogSetup, FormType, RadioButton, ValidatorType, _ControlInterface, _FormData } from "./dynamic-material-dialog-setup.model";
import { DynamicDialogService } from "./dynamic-dialog.service";

export interface _DynamicDialogOptions {
	setup: DynamicDialogSetup;
	options?: _DialogOptions;
}

export interface _DialogOptions {
	draggable?: boolean;
}

@Component({
	selector: "app-dynamic-material-dialog",
	templateUrl: "./dynamic-material-dialog.component.html",
	styleUrls: ["./dynamic-material-dialog.component.scss"],
	imports: [
		AsyncPipe,
		CurrencyPipe,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatRadioModule,
		MatSliderModule,
		DragDropModule,
		MatProgressSpinnerModule,
		MatIconModule,
		ButtonToggleComponent,
		CheckboxGroupComponent,
		CheckboxComponent,
		RangeCheckboxGroupComponent,
		RangeCheckboxComponent,
		DragAndDropFilesDirective,
		MinMaxDirective,
		DateTransformDirective,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicMaterialDialogComponent implements OnInit, AfterViewInit {
	public readonly form: FormGroup = new FormGroup({});
	public readonly dialogSetup: DynamicDialogSetup;
	public readonly options: _DialogOptions = {};
	public data: _FormData[] = [];
	public filteredData?: Observable<_FormData[]>;
	public autoCompleteList: string[] = [];
	public files: File[] = [];
	public showSearch = false;
	public searchInputName = "";
	public autoCompleteActive = false;
	public showSpinner = false;
	public equalSelected = false;
	public selectedDate: Date | null = null;
	public curRange: unknown;
	public allowManualInput = false;
	public filesToAccept = "";
	public searchControl = new FormControl<string>("");
	@ViewChild("mapSearchField") searchField: ElementRef<HTMLElement> | undefined;
	private readonly inputChange$ = new Subject<_ControlInterface>();
	private readonly dialogData = inject<_DynamicDialogOptions>(MAT_DIALOG_DATA);
	private readonly dialogRef = inject<MatDialogRef<DynamicMaterialDialogComponent>>(MatDialogRef);
	private readonly snackbarService = inject(SnackbarService);
	private readonly ngZone = inject(NgZone);
	public readonly dynamicDialogService = inject(DynamicDialogService);
	private readonly destroyRef = inject(DestroyRef);

	constructor() {
		this.dialogSetup = this.dialogData.setup;
		this.options = this.dialogData.options ?? {};
		if (this.dialogSetup.simple === false) {
			this.equalSelected = this.dialogSetup.controls?.[0].value === "eq";
		}
	}

	public get formType(): typeof FormType {
		return FormType;
	}

	_filter(value: string): _FormData[] {
		const filterValue = value.toLowerCase();

		return this.data.filter((option) => option.display.toLowerCase().includes(filterValue));
	}

	getEnumName(type: ValidatorType): string {
		// noSpace/phone are implemented with Validators.pattern, so their errors live under the `pattern` key.
		return type === ValidatorType.noSpace || type === ValidatorType.phone ? ValidatorType[ValidatorType.pattern] : ValidatorType[type];
	}

	ngAfterViewInit(): void {
		this.dynamicDialogService.responseNotification.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
			this.showSpinner = false;
			if (res.length > 0 && !this.autoCompleteActive) {
				this.autoCompleteList = this.dynamicDialogService.getResponse();
			}
		});
		this.loadMaps();
	}

	formatDate(name: string): void {
		const control = this.form.get(name);
		if (!control) {
			return;
		}
		const val = control.value as string;
		if (Number.isNaN(Date.parse(val))) {
			return;
		}
		control.setValue(new Date(val));
	}

	ngOnInit(): void {
		this.inputChange$.pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500)).subscribe((control: _ControlInterface) => {
			this.handleControlChange(control);
		});

		this.dialogSetup.controls?.map((element, i) => {
			if (!element.formName) {
				element.formName = i.toString();
			}
			const formName: string = element.formName;

			if ((element.data?.length ?? 0) > 5) {
				this.showSearch = true;
			}

			switch (element.type) {
				case FormType.RangeDate: {
					const rangeValue = element.value as { start?: unknown; end?: unknown } | undefined;
					this.form.addControl(
						formName,
						new FormGroup({
							start: new FormControl(rangeValue?.start ?? null),
							end: new FormControl(rangeValue?.end ?? null),
						}),
					);
					break;
				}
				case FormType.DateTime: {
					const value = new Date((element.value as string | number | Date | undefined) ?? Date.now());
					const hour: string = String(value.getHours()).padStart(2, "0");
					const min: string = String(value.getMinutes()).padStart(2, "0");

					this.form.addControl(
						formName,
						new FormGroup({
							date: new FormControl(value),
							time: new FormControl(`${hour}:${min}`),
						}),
					);
					break;
				}
				case FormType.SingleDate: {
					this.selectedDate = element.value ? new Date(element.value as string | number | Date) : null;
					this.form.addControl(formName, new FormControl(this.selectedDate));
					this.form
						.get(formName)
						?.valueChanges.pipe(filter((val): val is Date => !Number.isNaN(Date.parse(String(val)))))
						.subscribe((val) => {
							this.selectedDate = new Date(val);
						});
					break;
				}
				case FormType.CheckBox: {
					this.form.addControl(formName, new FormControl(element.value ?? []));
					if (element instanceof CheckBox) {
						this.data = element.data;
						this.filteredData = this.searchControl.valueChanges.pipe(
							startWith(""),
							map((value) => this._filter(value ?? "")),
						);
					}
					break;
				}
				case FormType.CheckBoxRange: {
					this.form.addControl(formName, new FormControl(element.value ?? []));
					if (element instanceof CheckBoxRange) {
						this.data = element.data;
						this.filteredData = this.searchControl.valueChanges.pipe(
							startWith(""),
							map((value) => this._filter(value ?? "")),
						);
					}
					break;
				}
				case FormType.Radio: {
					this.form.addControl(formName, new FormControl(element.value || typeof element.value === "boolean" ? element.value : []));
					if (element instanceof RadioButton) {
						this.data = element.data;
						this.filteredData = this.searchControl.valueChanges.pipe(
							startWith(""),
							map((value) => this._filter(value ?? "")),
						);
					}
					break;
				}
				case FormType.Upload: {
					this.form.addControl(formName, new FormControl([]));
					break;
				}
				case FormType.ButtonGroup: {
					this.form.addControl(formName, new FormControl(element.value ?? false));
					break;
				}
				case FormType.CUSTButtonGroup: {
					this.form.addControl(formName, new FormControl(element.value ?? false));
					break;
				}
				case FormType.Address: {
					this.form.addControl(formName, new FormControl(element.value ?? null));
					break;
				}
				default:
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: falsy non-nullish values (0, "") must fall back to null for numeric/text/slider controls
					this.form.addControl(formName, new FormControl(element.value ? element.value : null));
			}

			this.form.controls[formName].clearValidators();
			const dependentControlName = element.validationDep ?? "";
			if (!element.validationDep) {
				if (element.validators) {
					element.validators.map((error) => {
						error.value ??= 0;
						switch (error.validator) {
							case ValidatorType.min:
								this.form.controls[formName].addValidators(Validators.min(error.value as number));
								break;
							case ValidatorType.max:
								this.form.controls[formName].addValidators(Validators.max(error.value as number));
								break;
							case ValidatorType.required:
								this.form.controls[formName].addValidators(Validators.required.bind(Validators));
								break;
							case ValidatorType.requiredTrue:
								this.form.controls[formName].addValidators(Validators.requiredTrue.bind(Validators));
								break;
							case ValidatorType.email:
								this.form.controls[formName].addValidators(Validators.email.bind(Validators));
								break;
							case ValidatorType.minlength:
								this.form.controls[formName].addValidators(Validators.minLength(error.value as number));
								break;
							case ValidatorType.maxlength:
								this.form.controls[formName].addValidators(Validators.maxLength(error.value as number));
								break;
							case ValidatorType.pattern:
								this.form.controls[formName].addValidators(Validators.pattern(error.value as string | RegExp));
								break;
							case ValidatorType.nullValidator:
								this.form.controls[formName].addValidators(Validators.nullValidator.bind(Validators));
								break;
							case ValidatorType.noSpace:
								this.form.controls[formName].addValidators(Validators.pattern(/^\S+$/));
								break;
							case ValidatorType.phone:
								this.form.controls[formName].addValidators(Validators.pattern("0[0-9]{9}"));
								break;
						}
					});
				}
			} else {
				if (element.validators) {
					element.validators.map((error) => {
						error.value ??= 0;
						switch (error.validator) {
							case ValidatorType.min:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.min(error.value as number)));
								break;
							case ValidatorType.max:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.max(error.value as number)));
								break;
							case ValidatorType.required:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.required.bind(Validators)));
								break;
							case ValidatorType.requiredTrue:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.requiredTrue.bind(Validators)));
								break;
							case ValidatorType.email:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.email.bind(Validators)));
								break;
							case ValidatorType.minlength:
								this.form.controls[formName].addValidators(
									conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.minLength(error.value as number)),
								);
								break;
							case ValidatorType.maxlength:
								this.form.controls[formName].addValidators(
									conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.maxLength(error.value as number)),
								);
								break;
							case ValidatorType.pattern:
								this.form.controls[formName].addValidators(
									conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.pattern(error.value as string | RegExp)),
								);
								break;
							case ValidatorType.nullValidator:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.nullValidator.bind(Validators)));
								break;
							case ValidatorType.noSpace:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.pattern(/^\S+$/)));
								break;
							case ValidatorType.phone:
								this.form.controls[formName].addValidators(conditionalValidator(() => !this.form.controls[dependentControlName].value, Validators.pattern("0[0-9]{9}")));
								break;
						}
					});
				}
			}

			if (element.disabled) {
				this.form.controls[formName].disable();
			}
		});
	}

	actions(action: string): void {
		switch (action) {
			case "Clear": {
				this.curRange = "";
				this.clear();
				this.close("clear");
				break;
			}
			case "Reset": {
				this.curRange = "";
				this.clear();
				this.close("reset");
				break;
			}
			default: {
				this.close("close");
				break;
			}
		}
	}

	close(action: string): void {
		this.dialogRef.close({ action: action });
	}

	clear(): void {
		(this.form.controls[this.dialogSetup.title] as AbstractControl | undefined)?.setValue("");
	}

	rangeClicked(value: _FormData): void {
		const firstControl = this.dialogSetup.controls?.[0];
		if (firstControl?.formName === "selectedColumns") {
			if (value.value === "all") {
				const act = value.activated ? false : true;
				firstControl.data?.map((column) => {
					column.activated = act;
					return column;
				});
				this.form.get("selectedColumns")?.setValue(firstControl.data?.filter((column) => column.activated).map((column) => column.value) ?? []);
			} else {
				const selectedValues: string[] = (this.form.get("selectedColumns")?.value as string[] | undefined) ?? [];
				const allSelected = firstControl.data?.slice(1).every((column) => selectedValues.includes(column.value as string)) ?? false;
				if (allSelected) {
					selectedValues.push("all");
				} else {
					const ind = selectedValues.indexOf("all");
					if (ind > -1) {
						selectedValues.splice(ind, 1);
					}
				}
				const firstData: _FormData[] = firstControl.data ?? [];
				firstData[0].activated = allSelected;
			}
		}
		if (this.curRange != value) {
			this.curRange = value;
		} else {
			this.curRange = "";
		}
	}

	save(): void {
		this.form.markAllAsTouched();
		if (this.form.get("email")?.errors?.["pattern"]) {
			this.snackbarService.open("An email address containing 'payroll' cannot be used. Please provide a different email address.", "warning");
			return;
		}
		if (this.form.valid) {
			this.dialogRef.close(this.form.value);
		} else {
			this.snackbarService.open("Please complete the form fully", "warning");
		}
	}

	calendarUpdateControl(value: unknown, formName: string): void {
		this.form.get(formName)?.setValue(value);
	}

	submitApproval(approval: string): void {
		this.dialogRef.close(approval);
	}

	loadMaps(): void {
		if (!this.searchField) {
			return;
		}

		const searchBox = new google.maps.places.Autocomplete(this.searchField.nativeElement, {
			types: ["address"],
			componentRestrictions: { country: "za" },
		});

		this.ngZone.run(() => {
			searchBox.addListener("place_changed", () => {
				const place = searchBox.getPlace();
				if (place === undefined || place === null) {
					return;
				}

				for (const control of this.dialogSetup.controls ?? []) {
					if (control.type == this.formType.Address) {
						control.value = place.formatted_address;
						if (!this.form.get("lat")?.value) {
							this.form.addControl("lat", new FormControl(place.geometry.location.lat()));
							this.form.addControl("lng", new FormControl(place.geometry.location.lng()));
						}
					}
				}
			});
		});
	}

	controlChange(control: _ControlInterface): void {
		this.inputChange$.next(control);
	}

	dropdownChange(event: MatSelectChange, filterName: string): void {
		if (this.dialogSetup.simple || filterName === "thirdOperator") {
			return;
		}
		const controls = this.dialogSetup.controls;
		if (!controls) {
			return;
		}

		this.equalSelected = event.value === "eq";
		controls[0].value = event.value as string;
		this.form.controls[controls[0].formName].setValue(event.value);

		if (controls[2].value === "or") {
			return;
		}
		if (this.equalSelected && controls[2].value !== "") {
			controls[2].value = "or";
			this.form.controls[controls[2].formName].setValue("or");
		}
		const secondDropdown = controls[3];
		secondDropdown.data = controls[2].value === "or" ? controls[0].data : (controls[0].data?.filter((op) => op.value !== event.value && op.value !== "eq") ?? []);
		const secondData: _FormData[] = secondDropdown.data ?? [];
		secondDropdown.value = secondData[0].value;
		this.form.controls[secondDropdown.formName].setValue(secondDropdown.value);
	}

	handleControlChange(control: _ControlInterface): void {
		if (this.searchInputName.length > 0 && this.searchInputName != control.formName) {
			this.dynamicDialogService.clearResponse();
			this.autoCompleteActive = true;
			return;
		}

		if (this.autoCompleteActive) {
			this.autoCompleteActive = false;
			return;
		}

		this.dynamicDialogService.setDialogInputSearch(control.value ?? "");
		this.showSpinner = true;
		if (this.searchInputName.length == 0) {
			this.searchInputName = control.formName ?? "";
		}
	}

	autoCompleteSet(control: _ControlInterface, value: string): void {
		this.autoCompleteActive = true;

		this.dynamicDialogService.setDialogInputSearch("");
		this.dynamicDialogService.clearResponse();

		control.value = value;
		this.dynamicDialogService.setSelected(value);
		this.autoCompleteList = [];
	}

	handleFilesDropped(files: File[] | FileList, formName?: string): void {
		this.files = Array.from(files);
		if (formName) {
			this.form.get(formName)?.setValue(this.files);
			this.form.get(formName)?.markAsDirty();
		}
	}

	inputChange(input: ButtonToggleResponse, formName: string): void {
		if (!this.dialogSetup.simple && formName === "secondOperator") {
			this.updateSecondDropdown(input.value);
		}

		this.form.get(formName)?.setValue(input.value);
	}

	private updateSecondDropdown(value: string | string[]): void {
		const controls = this.dialogSetup.controls;
		if (!controls) {
			return;
		}
		if (!controls[2].value) {
			this.form.controls[controls[3].formName].enable();
			this.form.controls[controls[4].formName].enable();
		}
		const secondDropdown = controls[3];
		secondDropdown.data = value === "or" ? controls[0].data : (controls[0].data?.filter((op) => op.value !== controls[0].value && op.value !== "eq") ?? []);
		const secondData: _FormData[] = secondDropdown.data ?? [];
		secondDropdown.value = secondData[0].value;
		this.form.controls[secondDropdown.formName].setValue(secondDropdown.value);
		controls[2].value = value;
	}
}

function conditionalValidator(predicate: () => boolean, validator: ValidatorFn): ValidatorFn {
	return (formControl: AbstractControl): ValidationErrors | null => {
		if (!formControl.parent) {
			return null;
		}

		if (predicate()) {
			return validator(formControl);
		}
		return null;
	};
}

export function openDynamicDialog(dialog: MatDialog, dialogSetup: DynamicDialogSetup, config: MatDialogConfig, options?: _DialogOptions): Observable<unknown> {
	config.data = {
		setup: dialogSetup,
		options: options,
	};

	config.autoFocus = false;
	dialogSetup.controls?.map((element) => {
		if ((element.data?.length ?? 0) > 5) {
			config.autoFocus = true;
		}
	});

	const dialogRef = dialog.open(DynamicMaterialDialogComponent, config);

	dialogRef.backdropClick().subscribe(() => {
		dialogRef.close("close");
	});

	return dialogRef.afterClosed();
}

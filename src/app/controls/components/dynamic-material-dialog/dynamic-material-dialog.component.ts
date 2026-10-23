import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import {
	CheckBox,
	CheckBoxRange,
	DynamicDialogSetup,
	FormType,
	RadioButton,
	ValidatorType,
	_ControlInterface,
	_FormData,
} from "@controls/dynamic-material-dialog/dynamic-material-dialog-setup.model";
import { _CustInputReturn, _custInputGeneral } from "@controls/cust-basic-controls/cust-basic-controls.interface";
import { SnackbarService } from "@services/snackbar.service";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, map, startWith, takeUntil } from "rxjs/operators";
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
})
export class DynamicMaterialDialogComponent implements OnInit, AfterViewInit {
	public form?: FormGroup;
	public searchControl?: FormControl;
	public dialogSetup?: DynamicDialogSetup;
	public options: _DialogOptions;
	public data: _FormData[];
	public filteredData: Observable<_FormData[]>;
	@ViewChild("mapSearchField") searchField: ElementRef;
	autoCompleteList: string[] = [];
	searchInputName: string = "";
	autoCompleteActive: boolean = false;
	showSpinner: boolean = false;
	private destroy$ = new Subject<void>();
	private inputChange$ = new Subject<_ControlInterface>();
	files: File[] = [];
	showSearch: boolean = false;
	curRange: unknown;
	selectedDate: Date;
	inputObject: _custInputGeneral;
	equalSelected: boolean = false;

	constructor(
		private _formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) private _dialogData: _DynamicDialogOptions,
		private _snackbarService: SnackbarService,
		private _dialogRef: MatDialogRef<DynamicMaterialDialogComponent>,
		private ngZone: NgZone,
		public dynamicDialogService: DynamicDialogService
	) {
		this.dialogSetup = this._dialogData.setup;
		if (this.dialogSetup.simple === false) this.equalSelected = this.dialogSetup.controls[0].value === "eq";
		this.options = this._dialogData.options;
	}

	public get formType(): typeof FormType {
		return FormType;
	}

	_filter(value: string): _FormData[] {
		const filterValue = value.toLowerCase();

		return this.data.filter((option) => option.display.toLowerCase().includes(filterValue));
	}

	getEnumName(type: ValidatorType): string {
		return ValidatorType[type];
	}

	ngAfterViewInit(): void {
		this.loadMaps();
		this.dynamicDialogService.responseNotification?.subscribe((res) => {
			this.showSpinner = false;
			if (res.length > 0 && !this.autoCompleteActive) {
				this.autoCompleteList = this.dynamicDialogService.getResponse();
			}
		});
	}

	formatDate(name: string): void {
		let val = this.form.get(name).value;
		if (Number.isNaN(Date.parse(val))) return;
		this.form.get(name).setValue(new Date(val));
	}

	ngOnInit(): void {
		this.inputChange$.pipe(takeUntil(this.destroy$), debounceTime(500))?.subscribe((control: _ControlInterface) => {
			this.handleControlChange(control);
		});

		this.form = this._formBuilder.group({});

		this.dialogSetup.controls?.map((element, i) => {
			if (!element.formName) {
				element.formName = i.toString();
			}

			if (element["data"]?.length > 5) {
				this.showSearch = true;
			}

			switch (element.type) {
				case FormType.RangeDate: {
					this.form.addControl(
						element.formName,
						new FormGroup({
							start: new FormControl(element.value && element.value.start ? element.value.start : null),
							end: new FormControl(element.value && element.value.end ? element.value.end : null),
						})
					);
					break;
				}
				case FormType.DateTime: {
					let value = new Date(element.value ? element.value : Date.now());
					let hour = value.getHours();
					let min = value.getMinutes();

					this.form.addControl(
						element.formName,
						new FormGroup({
							date: new FormControl(value),
							time: new FormControl(`${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`),
						})
					);
					break;
				}
				case FormType.SingleDate: {
					this.selectedDate = element.value ? new Date(element.value) : null;
					this.form.addControl(element.formName, new FormControl(this.selectedDate));
					this.form
						.get(element.formName)
						.valueChanges.pipe(filter((val) => !Number.isNaN(Date.parse(val))))
						.subscribe((val) => {
							this.selectedDate = new Date(val);
						});
					break;
				}
				case FormType.CheckBox: {
					this.form.addControl(element.formName, new FormControl(element.value ? element.value : []));
					if (element instanceof CheckBox) {
						this.data = element.data;
						this.searchControl = new FormControl("");
						this.filteredData = this.searchControl.valueChanges.pipe(
							startWith(""),
							map((value) => this._filter(value || ""))
						);
					}
					break;
				}
				case FormType.CheckBoxRange: {
					this.form.addControl(element.formName, new FormControl(element.value ? element.value : []));
					if (element instanceof CheckBoxRange) {
						this.data = element.data;
						this.searchControl = new FormControl("");
						this.filteredData = this.searchControl.valueChanges.pipe(
							startWith(""),
							map((value) => this._filter(value || ""))
						);
					}
					break;
				}
				case FormType.Radio: {
					this.form.addControl(element.formName, new FormControl(element.value || typeof element.value === "boolean" ? element.value : []));
					if (element instanceof RadioButton) {
						this.data = element.data;
						this.searchControl = new FormControl("");
						this.filteredData = this.searchControl.valueChanges.pipe(
							startWith(""),
							map((value) => this._filter(value || ""))
						);
					}
					break;
				}
				case FormType.Upload: {
					this.form.addControl(element.formName, new FormControl([]));
					break;
				}
				case FormType.ButtonGroup: {
					this.form.addControl(element.formName, new FormControl(element.value ? element.value : false));
					break;
				}
				case FormType.CUSTButtonGroup: {
					this.form.addControl(element.formName, new FormControl(element.value ? element.value : false));
					break;
				}
				default:
					this.form.addControl(element.formName, new FormControl(element.value ? element.value : null));
			}

			this.form.controls[element.formName].clearValidators();
			if (!element.validationDep) {
				if (element.validators) {
					element.validators.map((error) => {
						if (error.value == undefined) {
							error.value = 0;
						}
						switch (error.validator) {
							case ValidatorType.min:
								this.form.controls[element.formName].addValidators(Validators.min(error.value));
								break;
							case ValidatorType.max:
								this.form.controls[element.formName].addValidators(Validators.max(error.value));
								break;
							case ValidatorType.required:
								this.form.controls[element.formName].addValidators(Validators.required);
								break;
							case ValidatorType.requiredTrue:
								this.form.controls[element.formName].addValidators(Validators.requiredTrue);
								break;
							case ValidatorType.email:
								this.form.controls[element.formName].addValidators(Validators.email);
								break;
							case ValidatorType.minlength:
								this.form.controls[element.formName].addValidators(Validators.minLength(error.value));
								break;
							case ValidatorType.maxlength:
								this.form.controls[element.formName].addValidators(Validators.maxLength(error.value));
								break;
							case ValidatorType.pattern:
								this.form.controls[element.formName].addValidators(Validators.pattern(error.value));
								break;
							case ValidatorType.nullValidator:
								this.form.controls[element.formName].addValidators(Validators.nullValidator);
								break;
							case ValidatorType.noSpace:
								error.validator = ValidatorType.pattern;
								this.form.controls[element.formName].addValidators(Validators.pattern("0[0-9]{9}"));
								break;
							case ValidatorType.phone:
								error.validator = ValidatorType.pattern;
								this.form.controls[element.formName].addValidators(Validators.pattern("[^s]+"));
								break;
						}
					});
				}
			} else {
				if (element.validators) {
					element.validators.map((error) => {
						if (error.value == undefined) {
							error.value = 0;
						}
						switch (error.validator) {
							case ValidatorType.min:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.min(error.value))
								);
								break;
							case ValidatorType.max:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.max(error.value))
								);
								break;
							case ValidatorType.required:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.required)
								);
								break;
							case ValidatorType.requiredTrue:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.requiredTrue)
								);
								break;
							case ValidatorType.email:
								this.form.controls[element.formName].addValidators(conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.email));
								break;
							case ValidatorType.minlength:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.minLength(error.value))
								);
								break;
							case ValidatorType.maxlength:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.maxLength(error.value))
								);
								break;
							case ValidatorType.pattern:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.pattern(error.value))
								);
								break;
							case ValidatorType.nullValidator:
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.nullValidator)
								);
								break;
							case ValidatorType.noSpace:
								error.validator = ValidatorType.pattern;
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.pattern("0[0-9]{9}"))
								);
								break;
							case ValidatorType.phone:
								error.validator = ValidatorType.pattern;
								this.form.controls[element.formName].addValidators(
									conditionalValidator(() => !this.form.controls[element.validationDep].value, Validators.pattern("[^s]+"))
								);
								break;
						}
					});
				}
			}

			if (element.disabled) {
				this.form.controls[element.formName].disable();
			}
		});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	actions(action: string) {
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
		this._dialogRef.close({ action: action });
	}

	clear(): void {
		this.form.controls[this.dialogSetup.title]?.setValue("");
	}

	rangeClicked(value: unknown): void {
		if (this.dialogSetup.controls[0]?.formName === "selectedColumns") {
			if (value["value"] === "all") {
				let act = value["activated"] ? false : true;
				this.dialogSetup.controls[0]["data"].map((column) => {
					column.activated = act;
					return column;
				});
				this.form.get("selectedColumns").setValue(this.dialogSetup.controls[0]["data"].filter((column) => column.activated).map((column) => column.value));
			} else {
				let allSelected = this.dialogSetup.controls[0]["data"].slice(1).every((column) => this.form.get("selectedColumns").value.includes(column.value));
				if (allSelected) this.form.get("selectedColumns").value.push("all");
				else {
					let ind = this.form.get("selectedColumns").value.indexOf("all");
					if (ind > -1) this.form.get("selectedColumns").value.splice(ind, 1);
				}
				this.dialogSetup.controls[0]["data"][0].activated = allSelected;
			}
		}
		if (this.curRange != value) {
			this.curRange = value;
		} else {
			this.curRange = "";
		}
	}

	save(): void {
		//Working in progress file upload
		// const fileUploadName = this.dialogSetup.controls.find((elem) => {
		// 	return elem.type == FormType.Upload;
		// });

		this.form.markAllAsTouched();
		if (this.form.get("email")?.errors?.pattern) {
			this._snackbarService.open("An email address containing 'payroll' cannot be used. Please provide a different email address.", "warning");
			return;
		}
		if (this.form.valid) {
			//let newResult = { ...this.form.value, fileUploadContent: this.files };
			this._dialogRef.close(this.form.value);
		} else {
			this._snackbarService.open("Please complete the form fully", "warning");
		}
	}

	calendarUpdateControl(value, formName): void {
		this.form.get(formName).setValue(value);
	}

	submitApproval(approval): void {
		this._dialogRef.close(approval);
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

				for (let control of this.dialogSetup.controls) {
					if (control.type == this.formType.Address) {
						control.value = place.formatted_address;
						if (!this.form.controls["lat"]?.value) {
							this.form.addControl("lat", new FormControl(place.geometry.location.lat()));
							this.form.addControl("lng", new FormControl(place.geometry.location.lng()));
						}
					}
				}
			});
		});
	}

	searchChange(control: FormControl): void {
		this.searchControl = control;
	}

	controlChange(control: _ControlInterface): void {
		this.inputChange$.next(control);
	}

	dropdownChange(event: MatSelectChange, filterName: string): void {
		if (this.dialogSetup.simple) return;
		if (filterName === "thirdOperator") return;

		this.equalSelected = event.value === "eq";
		this.dialogSetup.controls[0].value = event.value;
		this.form.controls[this.dialogSetup.controls[0].formName].setValue(event.value);

		if (this.dialogSetup.controls[2].value === "or") return;
		if (this.equalSelected && this.dialogSetup.controls[2].value !== "") {
			this.dialogSetup.controls[2].value = "or";
			this.form.controls[this.dialogSetup.controls[2].formName].setValue("or");
		}
		let secondDropdown = this.dialogSetup.controls[3];
		secondDropdown["data"] =
			this.dialogSetup.controls[2].value === "or"
				? this.dialogSetup.controls[0]["data"]
				: this.dialogSetup.controls[0]["data"].filter((op) => op.value !== event.value && op.value !== "eq");
		secondDropdown.value = secondDropdown["data"][0].value;
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

		this.dynamicDialogService.setDialogInputSearch(control.value);
		this.showSpinner = true;
		if (this.searchInputName.length == 0) {
			this.searchInputName = control.formName;
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

	handleFilesDropped(files: File[]) {
		this.files = files;
	}

	inputChange(event: _CustInputReturn, formName: string): void {
		if (!this.dialogSetup.simple && formName === "secondOperator") {
			if (!this.dialogSetup.controls[2].value) {
				this.form.controls[this.dialogSetup.controls[3].formName].enable();
				this.form.controls[this.dialogSetup.controls[4].formName].enable();
			}
			let secondDropdown = this.dialogSetup.controls[3];
			secondDropdown["data"] =
				event.value === "or"
					? this.dialogSetup.controls[0]["data"]
					: this.dialogSetup.controls[0]["data"].filter((op) => op.value !== this.dialogSetup.controls[0].value && op.value !== "eq");

			secondDropdown.value = secondDropdown["data"][0].value;
			this.form.controls[secondDropdown.formName].setValue(secondDropdown.value);
			this.dialogSetup.controls[2].value = event.value;
		}

		this.form.get(formName).setValue(event.value);
	}
}

function conditionalValidator(predicate, validator?): ValidatorFn {
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

export function openDynamicDialog(dialog: MatDialog, dialogSetup: DynamicDialogSetup, config: MatDialogConfig, options?: _DialogOptions) {
	config.data = {
		setup: dialogSetup,
		options: options,
	};

	config.autoFocus = false;
	dialogSetup.controls?.map((element, i) => {
		if (element["data"]?.length > 5) {
			config.autoFocus = true;
		}
	});

	const dialogRef = dialog.open(DynamicMaterialDialogComponent, config);

	dialogRef.backdropClick().subscribe(() => {
		dialogRef.close("close");
	});

	return dialogRef.afterClosed();
}

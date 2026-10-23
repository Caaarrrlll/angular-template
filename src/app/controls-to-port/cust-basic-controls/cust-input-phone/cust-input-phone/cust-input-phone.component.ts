import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { _CustInputReturn, _custInputGeneral } from "../../cust-basic-controls.interface";

@Component({
	selector: "cust-input-phone",
	templateUrl: "./cust-input-phone.component.html",
	styleUrls: ["./cust-input-phone.component.scss"],
})
export class CustInputPhoneComponent implements OnInit {
	@Input() inputObj: _custInputGeneral;
	@Output() inputChanged: EventEmitter<_CustInputReturn> = new EventEmitter<_CustInputReturn>();

	pattern: string = "";
	inputControl: FormControl;

	constructor() {}

	ngOnInit(): void {
		this.pattern = `^[0-9]{${this.inputObj.minlength}}$`;
		this.inputControl = new FormControl("", Validators.pattern(this.pattern));

		this.inputControl.setValue(this.inputObj.value);

		this.inputControl.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
			this.inputControl.markAsTouched();

			if (this.inputControl.invalid) return;

			const retObj: _CustInputReturn = {
				value: this.inputControl.getRawValue(),
				error: false,
				errorDescription: "",
			};

			this.inputChanged.emit(retObj);
		});
	}
}

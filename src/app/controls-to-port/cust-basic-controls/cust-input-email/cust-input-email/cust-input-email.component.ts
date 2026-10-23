import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { _CustInputReturn, _custInputGeneral } from "../../cust-basic-controls.interface";

@Component({
	selector: "cust-input-email",
	templateUrl: "./cust-input-email.component.html",
	styleUrls: ["./cust-input-email.component.scss"],
})
export class CustInputEMailComponent implements OnInit {
	@Input() inputObj: _custInputGeneral;
	@Output() inputChanged: EventEmitter<_CustInputReturn> = new EventEmitter<_CustInputReturn>();

	inputControl: FormControl = new FormControl("", Validators.pattern(/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));

	constructor() {}

	ngOnInit(): void {
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

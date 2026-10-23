import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { _CustInputReturn, _custInputGeneral } from "../../cust-basic-controls.interface";

@Component({
	selector: "cust-input-select",
	templateUrl: "./cust-input-select.component.html",
	styleUrls: ["./cust-input-select.component.scss"],
})
export class CustInputSelectComponent implements OnInit {
	@Input() inputObj: _custInputGeneral;
	@Output() inputChanged: EventEmitter<_CustInputReturn> = new EventEmitter<_CustInputReturn>();

	inputControl: FormControl;
	constructor() {}

	ngOnInit(): void {}

	ngAfterContentInit(): void {
		this.inputControl = new FormControl(this.inputObj.value, null);
	}

	onClick(name: string): void {
		const retObj: _CustInputReturn = {
			value: name,
			error: false,
			errorDescription: "",
		};

		this.inputChanged.emit(retObj);
	}
}

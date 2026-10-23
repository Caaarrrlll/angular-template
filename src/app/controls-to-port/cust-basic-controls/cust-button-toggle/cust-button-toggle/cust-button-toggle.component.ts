import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { _custInputGeneral, custInputResponse } from "@controls/cust-basic-controls/cust-basic-controls.interface";

@Component({
	selector: "cust-button-toggle",
	templateUrl: "./cust-button-toggle.component.html",
	styleUrls: ["./cust-button-toggle.component.scss"],
})
export class CustButtonToggleComponent implements OnInit {
	@Input() inputObj: _custInputGeneral;
	@Input() equalToSelected: boolean = false;
	@Output() inputChanged: EventEmitter<custInputResponse> = new EventEmitter<custInputResponse>();
	inputControl = new FormControl();
	constructor() {}

	ngOnInit(): void {
		if (!this.inputObj) return;
		if (this.inputObj["value"] !== null && this.inputObj["value"] !== undefined) {
			this.inputControl.setValue(this.inputObj.value);
			this.inputObj.inputList = this.inputObj["data"];
		} else {
			this.inputObj.multiSelect ? new FormControl<string[]>([]) : (this.inputControl = new FormControl<string>(""));
			this.inputObj.multiSelect ? this.inputControl.setValue(this.inputObj.valueList) : this.inputControl.setValue(this.inputObj.valueList[0]);
		}

		this.inputControl.valueChanges.pipe().subscribe((ret) => {
			this.inputControl.markAsTouched();

			const retObj: custInputResponse = {
				value: ret,
				error: false,
				errorDescription: "",
			};

			this.inputChanged.emit(retObj);
		});
	}
}

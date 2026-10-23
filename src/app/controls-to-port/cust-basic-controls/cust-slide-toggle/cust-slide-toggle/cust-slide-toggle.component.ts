import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { _CustInputReturn, _custInputGeneral } from "../../cust-basic-controls.interface";
@Component({
	selector: "cust-slide-toggle",
	templateUrl: "./cust-slide-toggle.component.html",
	styleUrls: ["./cust-slide-toggle.component.scss"],
})
export class CustSlideToggleComponent implements OnInit {
	@Input() inputObj: _custInputGeneral;
	@Output() inputChanged: EventEmitter<any> = new EventEmitter<any>();

	constructor() {}

	ngOnInit(): void {}

	onChange(event: Event): void {
		const retObj: _CustInputReturn = {
			value: event["checked"],
			error: false,
			errorDescription: "",
		};

		this.inputChanged.emit(retObj);
	}
}

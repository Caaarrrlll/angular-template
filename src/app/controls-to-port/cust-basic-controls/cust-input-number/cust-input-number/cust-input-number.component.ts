import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";
import { _CustButtonInputType, _CustInputAdvance } from "../../cust-basic-controls.interface";

@Component({
	selector: "cust-input-number",
	templateUrl: "./cust-input-number.component.html",
	styleUrls: ["./cust-input-number.component.scss"],
})
export class CustInputNumberComponent implements AfterContentInit {
	@Input() label: string;
	@Input() isReadOnly: boolean;
	@Input() placeholder: string;
	@Input() inputControl: _CustInputAdvance;
	@Input() action: _CustButtonInputType;
	@Input() isTextNumber?: boolean;
	@Output() actionOut: EventEmitter<{ action: string; parameters?: string[] }> = new EventEmitter<{ action: string; parameters?: string[] }>();

	constructor() {}

	ngAfterContentInit(): void {
		let validations: ValidatorFn[] = [];

		if (this.inputControl.validations.every((val) => typeof val === "function")) {
			validations = this.inputControl.validations as ValidatorFn[];
		}
		this.inputControl.inputControl.setValidators(Validators.compose(validations));
	}

	buttonClick(action: string, parameters?: string[]): void {
		this.actionOut.emit({
			action: action,
			parameters: parameters,
		});
	}

	checkInput(event: Event): void {
		if (isNaN(event["key"])) {
			this.inputControl.inputControl.setValue(this.inputControl.inputControl.getRawValue().replace(/[^0-9]/g, ""));
		}
	}
}

import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";
import { _CustButtonInputType, _CustInputAdvance } from "../../cust-basic-controls.interface";

@Component({
	selector: "cust-input-text",
	templateUrl: "./cust-input-text.component.html",
	styleUrls: ["./cust-input-text.component.scss"],
})
export class CustInputTextComponent implements AfterContentInit {
	@Input() label: string;
	@Input() isReadOnly: boolean;
	@Input() placeholder: string;
	@Input() inputControl: _CustInputAdvance;
	@Input() action: _CustButtonInputType;
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

	dateChange():void {
		this.actionOut.emit({
			action: "dateChange",
		});
	}
}

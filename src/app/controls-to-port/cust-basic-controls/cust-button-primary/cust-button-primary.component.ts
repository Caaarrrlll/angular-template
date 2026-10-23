import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { _CustButtonType } from "@controls/cust-basic-controls/cust-basic-controls.enum";
import { _CustButtonInput, _CustChipReturn } from "@controls/cust-basic-controls/cust-basic-controls.interface";

@Component({
	selector: "cust-button-primary",
	templateUrl: "./cust-button-primary.component.html",
	styleUrls: ["./cust-button-primary.component.scss"],
})
export class CustButtonPrimaryComponent implements AfterContentInit, OnChanges {
	@Input() type: _CustButtonInput;
	@Output() buttonClick: EventEmitter<_CustChipReturn> = new EventEmitter<_CustChipReturn>();

	button: _CustButtonInput;
	constructor() {}

	ngAfterContentInit(): void {
		this.button = {
			...this.type,
			type: _CustButtonType.primary,
		};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.button = {
			...changes.type.currentValue,
			type: _CustButtonType.primary,
		};
	}

	action(event: Event): void {
		const retObj: _CustChipReturn = {
			value: this.button.value,
			action: "click",
			event: event,
		};

		this.buttonClick.emit(retObj);
	}
}

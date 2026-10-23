import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { _CustButtonType } from "@controls/cust-basic-controls/cust-basic-controls.enum";
import { _CustButtonInput, _CustChipReturn } from "@controls/cust-basic-controls/cust-basic-controls.interface";

@Component({
	selector: "cust-button-text",
	templateUrl: "./cust-button-text.component.html",
	styleUrls: ["./cust-button-text.component.scss"],
})
export class CustButtonTextComponent implements AfterContentInit, OnChanges {
	@Input() type: _CustButtonInput;
	@Output() buttonClick: EventEmitter<_CustChipReturn> = new EventEmitter<_CustChipReturn>();

	button: _CustButtonInput;

	constructor() {}

	ngAfterContentInit(): void {
		this.button = {
			...this.type,
			type: _CustButtonType.text,
		};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.button = {
			...changes.type.currentValue,
			type: _CustButtonType.text,
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

import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { _CustButtonType } from "@controls/cust-basic-controls/cust-basic-controls.enum";
import { _CustButtonInput, _CustChipReturn } from "@controls/cust-basic-controls/cust-basic-controls.interface";

@Component({
	selector: "cust-button-tertiary",
	templateUrl: "./cust-button-tertiary.component.html",
	styleUrls: ["./cust-button-tertiary.component.scss"],
})
export class CustButtonTertiaryComponent implements AfterContentInit, OnChanges {
	@Input() type: _CustButtonInput;
	@Output() buttonClick: EventEmitter<_CustChipReturn> = new EventEmitter<_CustChipReturn>();

	button: _CustButtonInput;

	constructor() {}

	ngAfterContentInit() {
		this.button = {
			...this.type,
			type: _CustButtonType.tertiary,
		};
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.button = {
			...changes.type.currentValue,
			type: _CustButtonType.tertiary,
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

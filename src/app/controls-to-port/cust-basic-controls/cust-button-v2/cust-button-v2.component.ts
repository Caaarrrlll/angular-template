import { AfterContentInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { _CustButtonType } from "@controls/cust-basic-controls/cust-basic-controls.enum";
import { _CustButtonInput, _CustInputReturn } from "@controls/cust-basic-controls/cust-basic-controls.interface";

@Component({
	selector: "cust-button-v2",
	templateUrl: "./cust-button-v2.component.html",
	styleUrls: ["./cust-button-v2.component.scss"],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CustButtonV2Component implements AfterContentInit, OnChanges {
	@Input() type: _CustButtonInput;
	@Output() buttonClick: EventEmitter<_CustInputReturn> = new EventEmitter<_CustInputReturn>();

	buttonClass: string = "mat-flat-button color-set-primary";
	buttonPadding: string = "8px";
	buttonHeight: string = "36px";
	buttonFontSize: string = "14px";

	constructor() {}

	ngAfterContentInit(): void {
		if (this.type.display?.length == 0) {
			this.buttonPadding = "0px";
		}

		if (this.type.isTableButton) {
			this.buttonHeight = "32px";
			this.buttonFontSize = "12px";
			this.buttonPadding = "4px";
		}

		switch (this.type.type) {
			case _CustButtonType.primary: {
				this.buttonClass = "mat-flat-button color-set-primary";
				break;
			}
			case _CustButtonType.icon: {
				this.buttonClass = "mat-flat-button color-set-icon";
				break;
			}
			case _CustButtonType.secondary: {
				this.buttonClass = "mat-flat-button color-set-secondary";
				break;
			}
			case _CustButtonType.tertiary: {
				this.buttonClass = "mat-stroked-button color-set-tertiary";
				break;
			}
			case _CustButtonType.text: {
				this.buttonClass = "mat-button color-set-text";
				break;
			}
			case _CustButtonType.disabled: {
				this.buttonClass = "mat-flat-button disabled";
				break;
			}
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.type = {
			...changes.type.currentValue,
		};
	}

	onClick(selected: string, event?: Event): void {
		const retObj: _CustInputReturn = {
			value: selected,
			error: false,
			errorDescription: "",
			event: event,
		};

		this.buttonClick.emit(retObj);
	}
}

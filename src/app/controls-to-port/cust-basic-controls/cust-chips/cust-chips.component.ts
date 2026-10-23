import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { _CustChipInput, _CustChipReturn, _CustInputReturn } from "@controls/cust-basic-controls/cust-basic-controls.interface";

@Component({
	selector: "cust-chips",
	templateUrl: "./cust-chips.component.html",
	styleUrls: ["./cust-chips.component.scss"],
})
export class CustChipsComponent implements OnInit {
	@Input() input: Array<_CustChipInput>;
	@Output() inputChanged: EventEmitter<any> = new EventEmitter<any>();

	chipClear: boolean = false;
	optionSelected: string = "";

	constructor(public MatChipsModule: MatChipsModule) {}

	ngOnInit() {}

	onClick(selected: string): void {
		const retObj: _CustInputReturn = {
			value: selected,
			error: false,
			errorDescription: "",
		};

		this.inputChanged.emit(retObj);
		this.optionSelected = selected;
	}

	mouseOver(item: _CustChipInput): void {
		item.mouseOver = true;
	}

	mouseLeave(item: _CustChipInput): void {
		item.mouseOver = false;
	}

	chipAction(item: _CustChipInput, event: Event): void {
		if (this.chipClear) {
			this.chipClear = false;
			return;
		}
		const retObj: _CustChipReturn = {
			value: item.value,
			action: "click",
			event: event,
		};

		if (item.isToggle != null) item.isToggle = !item.isToggle;
		this.inputChanged.emit(retObj);
	}

	chipClearAction(item: _CustChipInput): void {
		this.chipClear = true;
		const retObj: _CustChipReturn = {
			value: item.value,
			action: item.refresh ? "refresh" : "clear",
			event: null,
		};

		this.inputChanged.emit(retObj);
	}
}

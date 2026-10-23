import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "cust-key-value-v2",
	templateUrl: "./key-value-v2.component.html",
	styleUrls: ["./key-value-v2.component.scss"],
})
export class KeyValueV2Component {
	@Input() key: string;
	@Input() value: string;
	@Input() valPercent?: number = null;
	@Input() alignRight?: boolean = false;
	@Input() showEdit?: boolean = false;
	@Input() showView?: boolean = false;
	@Input() title?: string;
	@Input() keyTitle?: string;
	@Input() boldValue = false;
	@Input() keyColor?: "red" | "green" | "orange";
	@Input() valueColor?: "red" | "green" | "orange";

	@Output() edit: EventEmitter<any> = new EventEmitter();
	@Output() view: EventEmitter<any> = new EventEmitter();

	constructor() {}

	editField() {
		this.edit.emit();
	}

	viewField() {
		this.view.emit();
	}
}

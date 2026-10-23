import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "cust-key-value-v3",
	templateUrl: "./key-value-v3.component.html",
	styleUrls: ["./key-value-v3.component.scss"],
})
export class KeyValueV3Component {
	@Input() key: string;
	@Input() value: string;
	@Input() showEdit?: boolean = false;
	@Input() showView?: boolean = false;
	@Input() alignRight?: boolean = false;
	@Input() title?: string;
	@Input() keyTitle?: string;
	@Input() boldValue = false;
	@Input() colon? = true;
	@Input() keyColor?: string = "black";
	@Input() valueColor?: string = "black";
	@Input() bottomPadding?: string = "10px";

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

import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";

@Component({
	selector: "cust-key-value",
	templateUrl: "./key-value.component.html",
	styleUrls: ["./key-value.component.scss"],
})
export class KeyValueComponent implements OnInit {
	@Input() key: string;
	@Input() value: string;
	@Input() row?: boolean = false;
	@Input() showEdit?: boolean = false;
	@Input() removeValuePadding: boolean = false;
	@Input() sameFontSize: boolean = false;
	@Output() edit: EventEmitter<any> = new EventEmitter();

	constructor() {}

	editField() {
		this.edit.emit();
	}

	public ngOnInit(): void {}
}

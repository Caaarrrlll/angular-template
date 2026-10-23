import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
	selector: "cust-option",
	templateUrl: "./option.component.html",
	styleUrls: ["./option.component.scss"],
})
export class OptionComponent implements OnInit {
	@Input() value: any;
	@Input() type = "radio";
	@Output() selected = new EventEmitter<any>();
	constructor() {}

	ngOnInit() {}
	selectedOption() {
		this.selected.emit();
	}
}

import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "cust-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
})
export class InputComponent implements OnInit {
	@Input() type: string;
	@Input() label: string;
	constructor() {}

	ngOnInit() {}
}

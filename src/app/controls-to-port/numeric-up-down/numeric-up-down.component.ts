import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-numeric-up-down",
	templateUrl: "./numeric-up-down.component.html",
	styleUrls: ["./numeric-up-down.component.scss"],
})
export class NumericUpDownComponent implements OnInit {
	@Input() public upDownCallback: Function;

	@Input() upValue: number;
	@Input() downValue: number;

	constructor() {}

	ngOnInit() {}
}

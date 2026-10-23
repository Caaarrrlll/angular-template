import { Component, Input, OnInit, SkipSelf, ViewEncapsulation } from "@angular/core";
import { ControlContainer } from "@angular/forms";

@Component({
	selector: "cust-select",
	templateUrl: "./select.component.html",
	styleUrls: ["./select.component.scss"],
	encapsulation: ViewEncapsulation.None,
	viewProviders: [
		{
			provide: ControlContainer,
			useFactory: (container: ControlContainer) => container,
			deps: [[new SkipSelf(), ControlContainer]],
		},
	],
})
export class SelectComponent implements OnInit {
	@Input() placeholder = "Select Option";
	@Input() controlName: string;
	active = false;
	@Input() options: any[];
	@Input() type = "radio";
	constructor() {}

	ngOnInit() {}

	selected() {
		this.active = !this.active;
	}
	closeDropdown() {
		if (this.active) {
			this.active = false;
		}
	}
}

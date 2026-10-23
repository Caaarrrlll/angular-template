import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
	selector: "app-fab-button",
	templateUrl: "./fab-button.component.html",
	styleUrls: ["./fab-button.component.scss"],
})
export class FabButtonComponent implements OnInit {
	@Output() public emitClick = new EventEmitter();
	constructor() {}

	ngOnInit() {}

	onClick() {
		this.emitClick.emit();
	}
}

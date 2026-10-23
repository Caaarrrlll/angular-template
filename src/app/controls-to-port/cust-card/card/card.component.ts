import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "cust-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
	@Input() color: string;
	@Input() showSidebar = false;
	@Input() marginRight = false;
	@Input() selected = false;
	@Input() fillHeight = false;

	constructor() {}

	ngOnInit() {}
}

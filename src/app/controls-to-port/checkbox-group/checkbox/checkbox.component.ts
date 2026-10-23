import { Component, Host, Input, OnInit } from "@angular/core";
import { CheckboxGroupComponent } from "@controls/checkbox-group/checkbox-group.component";

@Component({
	selector: "app-checkbox",
	templateUrl: "./checkbox.component.html",
	styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent implements OnInit {
	@Input() public value: any;

	constructor(@Host() public checkBoxGroup: CheckboxGroupComponent) {}

	ngOnInit(): void {}
}

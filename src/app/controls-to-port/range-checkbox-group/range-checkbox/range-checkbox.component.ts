import { Component, Host, Input, OnInit } from "@angular/core";
import { RangeCheckboxGroupComponent } from "@controls/range-checkbox-group/range-checkbox-group.component";

@Component({
	selector: "app-range-checkbox",
	templateUrl: "./range-checkbox.component.html",
	styleUrls: ["./range-checkbox.component.scss"],
})
export class RangeCheckboxComponent implements OnInit {
	@Input() public value: any;

	constructor(@Host() public checkBoxGroup: RangeCheckboxGroupComponent) {}

	ngOnInit(): void {}
}

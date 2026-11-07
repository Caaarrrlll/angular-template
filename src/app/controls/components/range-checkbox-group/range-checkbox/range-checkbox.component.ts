import { Component, Input, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RangeCheckboxGroupComponent } from "@shared/components/range-checkbox-group/range-checkbox-group.component";
import { RangeCheckboxValue } from "@shared/components/range-checkbox-group/range-checkbox-group.interface";

@Component({
	selector: "app-range-checkbox",
	templateUrl: "./range-checkbox.component.html",
	styleUrls: ["./range-checkbox.component.scss"],
	standalone: true,
	imports: [MatButtonModule, MatCheckboxModule],
})
export class RangeCheckboxComponent {
	@Input({ required: true }) public value!: RangeCheckboxValue;

	public readonly checkBoxGroup: RangeCheckboxGroupComponent = inject(RangeCheckboxGroupComponent, { host: true });
}

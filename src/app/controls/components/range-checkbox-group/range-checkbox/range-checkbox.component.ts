import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RangeCheckboxGroupComponent } from "@shared/components/range-checkbox-group/range-checkbox-group.component";
import { _RangeCheckboxValue } from "@shared/components/range-checkbox-group/range-checkbox-group.interface";

@Component({
	selector: "app-range-checkbox",
	templateUrl: "./range-checkbox.component.html",
	styleUrls: ["./range-checkbox.component.scss"],
	imports: [MatButtonModule, MatCheckboxModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeCheckboxComponent {
	public readonly value = input.required<_RangeCheckboxValue>();

	public readonly checkBoxGroup: RangeCheckboxGroupComponent = inject(RangeCheckboxGroupComponent, { host: true });
}

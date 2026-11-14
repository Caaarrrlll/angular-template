import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CheckboxGroupComponent } from "@shared/components/checkbox-group/checkbox-group.component";

@Component({
	selector: "app-checkbox",
	templateUrl: "./checkbox.component.html",
	styleUrls: ["./checkbox.component.scss"],
	imports: [MatButtonModule, MatCheckboxModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
	public readonly value = input.required<string>();

	public readonly checkBoxGroup: CheckboxGroupComponent = inject(CheckboxGroupComponent, { host: true });
}

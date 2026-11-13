import { Component, Input, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CheckboxGroupComponent } from "@shared/components/checkbox-group/checkbox-group.component";

@Component({
	selector: "app-checkbox",
	templateUrl: "./checkbox.component.html",
	styleUrls: ["./checkbox.component.scss"],
	standalone: true,
	imports: [MatButtonModule, MatCheckboxModule],
})
export class CheckboxComponent {
	@Input({ required: true }) public value!: string;

	public readonly checkBoxGroup: CheckboxGroupComponent = inject(CheckboxGroupComponent, { host: true });
}

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-tab",
	templateUrl: "./tab.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
	public readonly title = input.required<string>();
	public readonly active = model<boolean>(false);
	public readonly completed = model<boolean>(false);
	public readonly isConfig = input<boolean>(false);
	public readonly stepControl = input<FormGroup | undefined>();
}

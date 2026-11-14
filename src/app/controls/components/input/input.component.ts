import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
	selector: "app-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
	public readonly type = input<string | undefined>();
	public readonly label = input<string | undefined>();
}

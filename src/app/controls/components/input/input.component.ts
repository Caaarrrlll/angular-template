import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "app-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
	@Input() public type?: string;
	@Input() public label?: string;
}

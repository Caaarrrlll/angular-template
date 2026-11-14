import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

@Component({
	selector: "app-select-option",
	templateUrl: "./option.component.html",
	styleUrls: ["./option.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent {
	public readonly value = input<unknown>();
	public readonly type = input<string>("radio");

	public readonly selected = output<unknown>();

	public selectedOption(): void {
		this.selected.emit(this.value());
	}
}

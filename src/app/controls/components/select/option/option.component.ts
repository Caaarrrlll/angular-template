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
	/** Native `name`: give radios that form one group the same name (AUD-13: it used to be hard-coded to "test" for every instance on the page). */
	public readonly name = input<string>();

	public readonly selected = output<unknown>();

	public selectedOption(): void {
		this.selected.emit(this.value());
	}
}

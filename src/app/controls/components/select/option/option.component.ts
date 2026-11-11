import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-select-option",
	templateUrl: "./option.component.html",
	styleUrls: ["./option.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent {
	@Input() public value: unknown = undefined;
	@Input() public type: string = "radio";

	@Output() public selected: EventEmitter<unknown> = new EventEmitter<unknown>();

	public selectedOption(): void {
		this.selected.emit(this.value);
	}
}

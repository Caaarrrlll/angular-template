import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

@Component({
	selector: "app-key-value",
	templateUrl: "./key-value.component.html",
	styleUrls: ["./key-value.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueComponent {
	public readonly key = input.required<string>();
	public readonly value = input.required<string>();
	public readonly row = input<boolean>(false);
	public readonly showEdit = input<boolean>(false);
	public readonly removeValuePadding = input<boolean>(false);
	public readonly sameFontSize = input<boolean>(false);
	public readonly edit = output<void>();

	public editField(): void {
		this.edit.emit();
	}
}

import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-key-value-v3",
	templateUrl: "./key-value-v3.component.html",
	styleUrls: ["./key-value-v3.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueV3Component {
	public readonly key = input.required<string>();
	public readonly value = input.required<string>();
	public readonly showEdit = input<boolean>(false);
	public readonly showView = input<boolean>(false);
	public readonly alignRight = input<boolean>(false);
	public readonly title = input<string | undefined>();
	public readonly keyTitle = input<string | undefined>();
	public readonly boldValue = input<boolean>(false);
	public readonly colon = input<boolean>(true);
	public readonly bottomPadding = input<string>("10px");

	public readonly edit = output();
	public readonly view = output();

	public editField(): void {
		this.edit.emit();
	}

	public viewField(): void {
		this.view.emit();
	}
}

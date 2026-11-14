import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { PercentPipe } from "@angular/common";

@Component({
	selector: "app-key-value-v2",
	templateUrl: "./key-value-v2.component.html",
	styleUrls: ["./key-value-v2.component.scss"],
	imports: [MatIconModule, PercentPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueV2Component {
	public readonly key = input.required<string>();
	public readonly value = input.required<string>();
	public readonly valPercent = input<number | undefined>();
	public readonly alignRight = input<boolean>(false);
	public readonly showEdit = input<boolean>(false);
	public readonly showView = input<boolean>(false);
	public readonly title = input<string | undefined>();
	public readonly keyTitle = input<string | undefined>();
	public readonly boldValue = input<boolean>(false);
	public readonly keyColor = input<"red" | "green" | "orange" | undefined>();
	public readonly valueColor = input<"red" | "green" | "orange" | undefined>();

	public readonly edit = output<void>();
	public readonly view = output<void>();

	public editField(): void {
		this.edit.emit();
	}

	public viewField(): void {
		this.view.emit();
	}
}

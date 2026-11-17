import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-fab-button",
	templateUrl: "./fab-button.component.html",
	styleUrls: ["./fab-button.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabButtonComponent {
	public readonly icon = input<string>("help");
	public readonly ariaLabel = input<string>("Help");

	public readonly emitClick = output();

	public onClick(): void {
		this.emitClick.emit();
	}
}

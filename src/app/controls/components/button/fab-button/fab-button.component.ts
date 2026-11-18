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
	/** true (default): fixed to the viewport's bottom-right corner. false: rendered inline where it is placed. */
	public readonly floating = input<boolean>(true);

	public readonly emitClick = output();

	public onClick(): void {
		this.emitClick.emit();
	}
}

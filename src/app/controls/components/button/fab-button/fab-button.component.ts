import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-fab-button",
	templateUrl: "./fab-button.component.html",
	styleUrls: ["./fab-button.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabButtonComponent {
	public readonly emitClick = output<void>();

	public onClick(): void {
		this.emitClick.emit();
	}
}

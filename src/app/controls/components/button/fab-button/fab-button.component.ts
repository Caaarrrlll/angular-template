import { ChangeDetectionStrategy, Component, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-fab-button",
	templateUrl: "./fab-button.component.html",
	styleUrls: ["./fab-button.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabButtonComponent {
	@Output() public emitClick: EventEmitter<void> = new EventEmitter<void>();

	public onClick(): void {
		this.emitClick.emit();
	}
}

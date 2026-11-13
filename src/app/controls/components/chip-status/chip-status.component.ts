import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { ChipStatus } from "./chip-status.enum";

@Component({
	selector: "app-chip-status",
	templateUrl: "./chip-status.component.html",
	styleUrls: ["./chip-status.component.scss"],
	imports: [MatChipsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipStatusComponent {
	@Input({ required: true }) public text: string = "";
	@Input() public type: string = ChipStatus["Default"];
	@Input() public isSmall?: boolean;
	@Input() public showSolid?: boolean;

	public get statusClass(): string {
		return ChipStatus[this.type] ?? ChipStatus["Default"];
	}
}

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
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
	public readonly text = input<string>("");
	public readonly type = input<string>(ChipStatus["Default"]);
	public readonly isSmall = input<boolean | undefined>();
	public readonly showSolid = input<boolean | undefined>();

	public get statusClass(): string {
		return ChipStatus[this.type()] ?? ChipStatus["Default"];
	}
}

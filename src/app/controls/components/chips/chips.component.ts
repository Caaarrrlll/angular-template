import { Component, input, output } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { CustChipInput, CustChipReturn, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-chips",
	templateUrl: "./chips.component.html",
	styleUrls: ["./chips.component.scss"],
	imports: [MatChipsModule, MatIconModule],
})
export class ChipsComponent {
	public readonly input = input.required<CustChipInput[]>();
	public readonly inputChanged = output<CustChipReturn | CustInputReturn>();

	private chipClear = false;

	public mouseOver(item: CustChipInput): void {
		item.mouseOver = true;
	}

	public mouseLeave(item: CustChipInput): void {
		item.mouseOver = false;
	}

	public chipAction(item: CustChipInput, event: Event): void {
		if (item.disabled) {
			return;
		}
		if (this.chipClear) {
			this.chipClear = false;
			return;
		}
		if (item.isToggle !== undefined && item.isToggle !== null) {
			item.isToggle = !item.isToggle;
		}
		this.inputChanged.emit({
			value: item.value,
			action: "click",
			event: event,
		});
	}

	public chipClearAction(item: CustChipInput): void {
		this.chipClear = true;
		this.inputChanged.emit({
			value: item.value,
			action: item.refresh ? "refresh" : "clear",
			event: null,
		});
	}
}

import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { _CustChipInput, _CustChipReturn, _CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-chips",
	templateUrl: "./chips.component.html",
	styleUrls: ["./chips.component.scss"],
	imports: [MatChipsModule, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsComponent {
	public readonly input = input.required<_CustChipInput[]>();
	public readonly inputChanged = output<_CustChipReturn | _CustInputReturn>();

	private chipClear = false;

	public mouseOver(item: _CustChipInput): void {
		item.mouseOver = true;
	}

	public mouseLeave(item: _CustChipInput): void {
		item.mouseOver = false;
	}

	public chipAction(item: _CustChipInput, event: Event): void {
		if (item.disabled) {
			return;
		}
		if (this.chipClear) {
			this.chipClear = false;
			return;
		}
		if (item.isToggle !== undefined) {
			item.isToggle = !item.isToggle;
		}
		this.inputChanged.emit({
			value: item.value,
			action: "click",
			event: event,
		});
	}

	public chipClearAction(item: _CustChipInput): void {
		this.chipClear = true;
		this.inputChanged.emit({
			value: item.value,
			action: item.refresh ? "refresh" : "clear",
			event: null,
		});
	}
}

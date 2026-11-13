import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-numeric-up-down",
	templateUrl: "./numeric-up-down.component.html",
	styleUrls: ["./numeric-up-down.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumericUpDownComponent {
	@Input({ required: true }) public upDownCallback!: (value: number) => void;
	@Input() public upValue?: number;
	@Input() public downValue?: number;

	public call(value?: number): void {
		if (value === undefined) {
			return;
		}
		this.upDownCallback(value);
	}
}

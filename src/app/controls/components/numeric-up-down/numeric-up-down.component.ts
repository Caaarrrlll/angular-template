import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-numeric-up-down",
	templateUrl: "./numeric-up-down.component.html",
	styleUrls: ["./numeric-up-down.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumericUpDownComponent {
	public readonly upDownCallback = input.required<(value: number) => void>();
	public readonly upValue = input<number | undefined>();
	public readonly downValue = input<number | undefined>();

	public call(value?: number): void {
		if (value === undefined) {
			return;
		}
		this.upDownCallback()(value);
	}
}

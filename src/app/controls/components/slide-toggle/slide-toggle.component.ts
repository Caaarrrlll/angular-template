import { ChangeDetectionStrategy, Component, Signal, computed, input, output } from "@angular/core";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-slide-toggle",
	templateUrl: "./slide-toggle.component.html",
	imports: [MatSlideToggleModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleComponent {
	public readonly inputObj = input.required<CustInputGeneral>();
	public readonly inputChanged = output<CustInputReturn>();

	/** `value` is a string in CustInputGeneral: only `"true"` means on (`!!value` also turned `"false"` on). */
	public readonly checked: Signal<boolean> = computed((): boolean => this.inputObj().value === `true`);

	public onChange(event: MatSlideToggleChange): void {
		this.inputChanged.emit({
			value: String(event.checked),
			error: false,
			errorDescription: "",
		});
	}
}

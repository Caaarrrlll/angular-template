import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-slide-toggle",
	templateUrl: "./slide-toggle.component.html",
	styleUrls: ["./slide-toggle.component.scss"],
	imports: [MatSlideToggleModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleComponent {
	@Input({ required: true }) public inputObj!: CustInputGeneral;
	@Output() public inputChanged: EventEmitter<CustInputReturn> = new EventEmitter<CustInputReturn>();

	public onChange(event: MatSlideToggleChange): void {
		this.inputChanged.emit({
			value: String(event.checked),
			error: false,
			errorDescription: "",
		});
	}
}

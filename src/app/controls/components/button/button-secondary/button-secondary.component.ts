import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ButtonV2Component } from "../button-v2/button-v2.component";
import { CustButtonInput, CustButtonType, CustChipReturn, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-button-secondary",
	templateUrl: "./button-secondary.component.html",
	imports: [ButtonV2Component],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSecondaryComponent {
	public readonly type = input.required<CustButtonInput>();
	public readonly buttonClick = output<CustChipReturn>();

	public get button(): CustButtonInput {
		return { ...this.type(), type: CustButtonType.secondary };
	}

	public action(click: CustInputReturn): void {
		this.buttonClick.emit({
			value: this.type().value,
			action: "click",
			event: click.event ?? null,
		});
	}
}

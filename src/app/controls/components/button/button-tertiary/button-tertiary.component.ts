import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ButtonV2Component } from "../button-v2/button-v2.component";
import { CustButtonInput, CustButtonType, CustChipReturn, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-button-tertiary",
	templateUrl: "./button-tertiary.component.html",
	imports: [ButtonV2Component],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonTertiaryComponent {
	public readonly type = input.required<CustButtonInput>();
	public readonly buttonClick = output<CustChipReturn>();

	public get button(): CustButtonInput {
		return { ...this.type(), type: CustButtonType.tertiary };
	}

	public action(click: CustInputReturn): void {
		this.buttonClick.emit({
			value: this.type().value,
			action: "click",
			event: click.event ?? null,
		});
	}
}

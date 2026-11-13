import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { CustButtonInput, CustButtonType, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-button-v2",
	templateUrl: "./button-v2.component.html",
	styleUrls: ["./button-v2.component.scss"],
	imports: [MatButtonModule, MatIconModule, MatTooltipModule, LoaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonV2Component {
	@Input({ required: true }) public type!: CustButtonInput;
	@Output() public buttonClick: EventEmitter<CustInputReturn> = new EventEmitter<CustInputReturn>();

	public get displayLength(): number {
		return this.type.display?.length ?? 0;
	}

	public get buttonClass(): string {
		switch (this.type.type) {
			case CustButtonType.primary: {
				return "mat-flat-button color-set-primary";
			}
			case CustButtonType.icon: {
				return "mat-flat-button color-set-icon";
			}
			case CustButtonType.secondary: {
				return "mat-flat-button color-set-secondary";
			}
			case CustButtonType.tertiary: {
				return "mat-stroked-button color-set-tertiary";
			}
			case CustButtonType.text: {
				return "mat-button color-set-text";
			}
			case CustButtonType.disabled: {
				return "mat-flat-button disabled";
			}
			default: {
				return "mat-flat-button color-set-primary";
			}
		}
	}

	public get buttonPadding(): string {
		if (this.displayLength === 0) {
			return "0px";
		}
		return this.type.isTableButton ? "4px" : "8px";
	}

	public get buttonHeight(): string {
		return this.type.isTableButton ? "32px" : "36px";
	}

	public get buttonFontSize(): string {
		return this.type.isTableButton ? "12px" : "14px";
	}

	public onClick(selected: string, event?: Event): void {
		this.buttonClick.emit({
			value: selected,
			error: false,
			errorDescription: "",
			event: event,
		});
	}
}

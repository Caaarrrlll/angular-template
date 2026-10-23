import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "cust-button",
	templateUrl: "./button.component.html",
	styleUrls: ["./button.component.scss"],
})
export class ButtonComponent {
	@Input() value: string;
	@Input() color: string = "default";
	@Input() fontSize? = "15px";
	@Input() padding? = "15px 30px";
	@Input() width? = "100%";
	@Input() margin? = "0px";
	@Input() loading = false;
	@Input() disabled = false;
	@Input() askToConfirm = false;
	@Input() fontWeight = "normal";
	@Input() icon = "";
	@Input() iconColor = "";
	@Input() iconStyle = "";
	@Input() colorIcon = "";
	@Input() display = "initial";
	@Input() alignItems = "center";

	numberOfClicks = 0;
	private confirmationTimer = 3000; // change animation time variable in scss file as well
	private originalValue: string;
	private confirmationText = "Click to Confirm";

	@Input() menuItems: any[] = [];
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	constructor() {}

	clicked(event: any) {
		if (this.disabled || this.loading) {
			event.stopPropagation();
		}

		if (this.askToConfirm) {
			if (this.numberOfClicks === 0) {
				event.stopPropagation();
				this.startConfirmation();
			} else if (this.numberOfClicks === 1) {
				this.resetConfirmation();
			}
		}
	}

	onSelect(event) {
		this.selected.emit(event);
	}

	private startConfirmation() {
		this.numberOfClicks = 1;
		this.originalValue = this.value;
		this.value = this.confirmationText;
		this.delay(this.confirmationTimer).then((e) => {
			this.resetConfirmation();
		});
	}

	private resetConfirmation() {
		this.numberOfClicks = 0;
		this.value = this.originalValue;
	}

	private delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

import { getCurrencySymbol } from "@angular/common";
import { Component, EventEmitter, Input, LOCALE_ID, OnInit, Output, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CustButtonInputType, CustInputAdvance } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-currency",
	templateUrl: "./input-currency.component.html",
	styleUrls: ["./input-currency.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
})
export class InputCurrencyComponent implements OnInit {
	@Input({ required: true }) public label!: string;
	@Input() public isReadOnly: boolean = false;
	@Input() public placeholder: string = "";
	@Input({ required: true }) public inputControl!: CustInputAdvance;
	@Input() public action?: CustButtonInputType;
	@Input() public currencyCode: string = "ZAR";
	@Output() public actionOut: EventEmitter<{ action: string; parameters?: string[] }> = new EventEmitter<{ action: string; parameters?: string[] }>();

	private readonly localeId: string = inject(LOCALE_ID);

	public get currencySymbol(): string {
		return getCurrencySymbol(this.currencyCode, "narrow", this.localeId);
	}

	public ngOnInit(): void {
		this.inputControl.inputControl.setValidators(this.inputControl.validations);
		if (!this.inputControl.inputControl.value) {
			this.inputControl.inputControl.setValue("0.00");
		}
	}

	public buttonClick(action: string, parameters?: string[]): void {
		this.actionOut.emit({
			action: action,
			parameters: parameters,
		});
	}
}

import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { ValidatorFn, Validators } from "@angular/forms";
import { LocalizeService } from "@apis/localize/localize.service";
import { _CustButtonInputType, _CustInputAdvance } from "../../cust-basic-controls.interface";

@Component({
	selector: "cust-input-currency",
	templateUrl: "./cust-input-currency.component.html",
	styleUrls: ["./cust-input-currency.component.scss"],
})
export class CustInputCurrencyComponent implements AfterContentInit {
	@Input() label: string;
	@Input() isReadOnly: boolean;
	@Input() placeholder: string;
	@Input() inputControl: _CustInputAdvance;
	@Input() action: _CustButtonInputType;
	@Output() actionOut: EventEmitter<{ action: string; parameters?: string[] }> = new EventEmitter<{ action: string; parameters?: string[] }>();
	currencyCode: string = "";
	currencySymbol: string = "";

	constructor(private _localizeService: LocalizeService) {}

	ngAfterContentInit(): void {
		let validations: ValidatorFn[] = [];

		if (this.inputControl.validations.every((val) => typeof val === "function")) {
			validations = this.inputControl.validations as ValidatorFn[];
		}
		this.inputControl.inputControl.setValidators(Validators.compose(validations));
		this.currencyCode = this._localizeService.getCurrency();
		const getCurrencySymbol = (locale, currency) =>
			(0).toLocaleString(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, "").trim();

		this.currencySymbol = getCurrencySymbol("en-ZA", this.currencyCode);
		if (!this.inputControl.inputControl.value) this.inputControl.inputControl.setValue("0.00");
	}

	buttonClick(action: string, parameters?: string[]): void {
		this.actionOut.emit({
			action: action,
			parameters: parameters,
		});
	}
}

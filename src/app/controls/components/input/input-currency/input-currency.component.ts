import { getCurrencySymbol } from "@angular/common";
import { ChangeDetectionStrategy, Component, LOCALE_ID, OnInit, inject, input, output } from "@angular/core";
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCurrencyComponent implements OnInit {
	public readonly label = input.required<string>();
	public readonly isReadOnly = input<boolean>(false);
	public readonly placeholder = input<string>("");
	public readonly inputControl = input.required<CustInputAdvance>();
	public readonly action = input<CustButtonInputType | undefined>();
	public readonly currencyCode = input<string>("ZAR");
	public readonly actionOut = output<{ action: string; parameters?: string[] }>();

	private readonly localeId: string = inject(LOCALE_ID);

	public get currencySymbol(): string {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		return getCurrencySymbol(this.currencyCode(), "narrow", this.localeId);
	}

	public ngOnInit(): void {
		// addValidators keeps validators the caller already put on the control (setValidators replaced them) and skips duplicates.
		this.inputControl().inputControl.addValidators(this.inputControl().validations);
		this.inputControl().inputControl.updateValueAndValidity({ emitEvent: false });
		if (!this.inputControl().inputControl.value) {
			this.inputControl().inputControl.setValue("0.00");
		}
	}

	public buttonClick(action: string, parameters?: string[]): void {
		this.actionOut.emit({
			action: action,
			parameters: parameters,
		});
	}
}

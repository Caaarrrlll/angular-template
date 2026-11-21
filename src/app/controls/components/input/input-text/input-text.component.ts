import { ChangeDetectionStrategy, Component, OnInit, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { _CustButtonInputType, _CustInputAdvance } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-text",
	templateUrl: "./input-text.component.html",
	styleUrls: ["./input-text.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDatepickerModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements OnInit {
	public readonly label = input.required<string>();
	public readonly isReadOnly = input<boolean>(false);
	public readonly placeholder = input<string>("");
	public readonly inputControl = input.required<_CustInputAdvance>();
	public readonly action = input<_CustButtonInputType | undefined>();
	public readonly actionOut = output<{ action: string; parameters?: string[] }>();

	public ngOnInit(): void {
		// addValidators keeps validators the caller already put on the control (setValidators replaced them) and skips duplicates.
		this.inputControl().inputControl.addValidators(this.inputControl().validations);
		this.inputControl().inputControl.updateValueAndValidity({ emitEvent: false });
	}

	public buttonClick(action: string, parameters?: string[]): void {
		this.actionOut.emit({
			action: action,
			parameters: parameters,
		});
	}

	public dateChange(): void {
		this.actionOut.emit({
			action: "dateChange",
		});
	}
}

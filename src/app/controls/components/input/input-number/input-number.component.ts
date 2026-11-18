import { ChangeDetectionStrategy, Component, OnInit, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CustButtonInputType, CustInputAdvance } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-number",
	templateUrl: "./input-number.component.html",
	styleUrls: ["./input-number.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent implements OnInit {
	public readonly label = input.required<string>();
	public readonly isReadOnly = input<boolean>(false);
	public readonly placeholder = input<string>("");
	public readonly inputControl = input.required<CustInputAdvance>();
	public readonly action = input<CustButtonInputType | undefined>();
	public readonly isTextNumber = input<boolean>(false);
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

	public checkInput(event: KeyboardEvent): void {
		if (isNaN(Number(event.key))) {
			this.inputControl().inputControl.setValue(String(this.inputControl().inputControl.value ?? "").replace(/[^0-9]/g, ""));
		}
	}
}

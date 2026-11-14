import { Component, OnInit, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { CustButtonInputType, CustInputAdvance } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-text",
	templateUrl: "./input-text.component.html",
	styleUrls: ["./input-text.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDatepickerModule],
})
export class InputTextComponent implements OnInit {
	public readonly label = input.required<string>();
	public readonly isReadOnly = input<boolean>(false);
	public readonly placeholder = input<string>("");
	public readonly inputControl = input.required<CustInputAdvance>();
	public readonly action = input<CustButtonInputType | undefined>();
	public readonly actionOut = output<{ action: string; parameters?: string[] }>();

	public ngOnInit(): void {
		this.inputControl().inputControl.setValidators(this.inputControl().validations);
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

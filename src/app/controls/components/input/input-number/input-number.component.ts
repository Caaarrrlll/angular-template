import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
})
export class InputNumberComponent implements OnInit {
	@Input({ required: true }) public label!: string;
	@Input() public isReadOnly: boolean = false;
	@Input() public placeholder: string = "";
	@Input({ required: true }) public inputControl!: CustInputAdvance;
	@Input() public action?: CustButtonInputType;
	@Input() public isTextNumber: boolean = false;
	@Output() public actionOut: EventEmitter<{ action: string; parameters?: string[] }> = new EventEmitter<{ action: string; parameters?: string[] }>();

	public ngOnInit(): void {
		this.inputControl.inputControl.setValidators(this.inputControl.validations);
	}

	public buttonClick(action: string, parameters?: string[]): void {
		this.actionOut.emit({
			action: action,
			parameters: parameters,
		});
	}

	public checkInput(event: KeyboardEvent): void {
		if (isNaN(Number(event.key))) {
			this.inputControl.inputControl.setValue(String(this.inputControl.inputControl.value ?? "").replace(/[^0-9]/g, ""));
		}
	}
}

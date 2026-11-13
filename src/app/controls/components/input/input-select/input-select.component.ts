import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-select",
	templateUrl: "./input-select.component.html",
	styleUrls: ["./input-select.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
})
export class InputSelectComponent implements OnInit {
	@Input({ required: true }) public inputObj!: CustInputGeneral;
	@Output() public inputChanged: EventEmitter<CustInputReturn> = new EventEmitter<CustInputReturn>();

	public inputControl: FormControl<unknown> = new FormControl<unknown>("");

	public ngOnInit(): void {
		this.inputControl.setValue(this.inputObj.value ?? "");
	}

	public onClick(name: unknown): void {
		this.inputChanged.emit({
			value: String(name),
			error: false,
			errorDescription: "",
		});
	}
}

import { ChangeDetectionStrategy, Component, OnInit, effect, input, output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-select",
	templateUrl: "./input-select.component.html",
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectComponent implements OnInit {
	public readonly inputObj = input.required<CustInputGeneral>();
	public readonly inputChanged = output<CustInputReturn>();

	public inputControl: FormControl<unknown> = new FormControl<unknown>("");

	constructor() {
		// Reactive forms own the disabled state: binding `[disabled]` next to `[formControl]` triggers Angular's warning.
		effect(() => {
			if (this.inputObj().isReadOnly ?? false) {
				this.inputControl.disable({ emitEvent: false });
			} else {
				this.inputControl.enable({ emitEvent: false });
			}
		});
	}

	public ngOnInit(): void {
		this.inputControl.setValue(this.inputObj().value ?? "");
	}

	public onClick(name: unknown): void {
		this.inputChanged.emit({
			value: String(name),
			error: false,
			errorDescription: "",
		});
	}
}

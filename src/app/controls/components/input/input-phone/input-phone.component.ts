import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-phone",
	templateUrl: "./input-phone.component.html",
	styleUrls: ["./input-phone.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class InputPhoneComponent implements OnInit {
	@Input({ required: true }) public inputObj!: CustInputGeneral;
	@Output() public inputChanged: EventEmitter<CustInputReturn> = new EventEmitter<CustInputReturn>();

	public readonly inputControl: FormControl<string | null> = new FormControl<string | null>("");

	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	public ngOnInit(): void {
		const pattern: string = this.inputObj.minlength !== undefined ? `^[0-9]{${this.inputObj.minlength}}$` : "^[0-9]*$";
		this.inputControl.setValidators(Validators.pattern(pattern));

		this.inputControl.setValue(this.inputObj.value ?? null);

		this.inputControl.valueChanges.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe((value: string | null): void => {
			this.inputControl.markAsTouched();

			if (this.inputControl.invalid) {
				return;
			}

			this.inputChanged.emit({
				value: value ?? "",
				error: false,
				errorDescription: "",
			});
		});
	}
}

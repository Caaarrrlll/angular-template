import { Component, DestroyRef, OnInit, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-email",
	templateUrl: "./input-email.component.html",
	styleUrls: ["./input-email.component.scss"],
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class InputEmailComponent implements OnInit {
	public readonly inputObj = input.required<CustInputGeneral>();
	public readonly inputChanged = output<CustInputReturn>();

	public readonly inputControl: FormControl<string | null> = new FormControl<string | null>("", Validators.pattern(/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/));

	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	public ngOnInit(): void {
		this.inputControl.setValue(this.inputObj().value ?? null);

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

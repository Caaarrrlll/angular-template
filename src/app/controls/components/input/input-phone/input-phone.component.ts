import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { _CustInputGeneral, _CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-input-phone",
	templateUrl: "./input-phone.component.html",
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneComponent implements OnInit {
	public readonly inputObj = input.required<_CustInputGeneral>();
	public readonly inputChanged = output<_CustInputReturn>();

	public readonly inputControl: FormControl<string | null> = new FormControl<string | null>("");

	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	public ngOnInit(): void {
		const minLength: number | undefined = this.inputObj().minlength;
		const pattern: string = minLength !== undefined ? `^[0-9]{${String(minLength)}}$` : "^[0-9]*$";
		this.inputControl.setValidators(Validators.pattern(pattern));

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

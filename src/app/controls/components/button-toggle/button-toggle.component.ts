import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { _ButtonToggleInput, _ButtonToggleOption, _ButtonToggleResponse } from "@shared/components/button-toggle/button-toggle.interface";

@Component({
	selector: "app-button-toggle",
	templateUrl: "./button-toggle.component.html",
	styleUrls: ["./button-toggle.component.scss"],
	imports: [MatButtonToggleModule, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonToggleComponent implements OnInit {
	public readonly inputObj = input.required<_ButtonToggleInput>();
	public readonly equalToSelected = input<boolean>(false);
	public readonly inputChanged = output<_ButtonToggleResponse>();

	public readonly inputControl: FormControl<string | string[] | null> = new FormControl<string | string[] | null>(null);

	private readonly destroyRef = inject(DestroyRef);

	public get options(): _ButtonToggleOption[] {
		return this.inputObj().inputList ?? this.inputObj().data ?? [];
	}

	public ngOnInit(): void {
		const value = this.inputObj().value;
		if (value !== undefined) {
			this.inputControl.setValue(value);
		} else if (this.inputObj().multiSelect) {
			this.inputControl.setValue(this.inputObj().valueList ?? []);
		} else {
			this.inputControl.setValue(this.inputObj().valueList?.[0] ?? "");
		}

		this.inputControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
			this.inputControl.markAsTouched();
			this.inputChanged.emit({
				value: value ?? "",
				error: false,
				errorDescription: "",
			});
		});
	}
}

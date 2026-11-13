import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ButtonToggleInput, ButtonToggleOption, ButtonToggleResponse } from "@shared/components/button-toggle/button-toggle.interface";

@Component({
	selector: "app-button-toggle",
	templateUrl: "./button-toggle.component.html",
	styleUrls: ["./button-toggle.component.scss"],
	standalone: true,
	imports: [MatButtonToggleModule, ReactiveFormsModule],
})
export class ButtonToggleComponent implements OnInit {
	@Input({ required: true }) public inputObj!: ButtonToggleInput;
	@Input() public equalToSelected = false;
	@Output() public inputChanged: EventEmitter<ButtonToggleResponse> = new EventEmitter<ButtonToggleResponse>();

	public readonly inputControl: FormControl<string | string[] | null> = new FormControl<string | string[] | null>(null);

	private readonly destroyRef = inject(DestroyRef);

	public get options(): ButtonToggleOption[] {
		return this.inputObj.inputList ?? this.inputObj.data ?? [];
	}

	public ngOnInit(): void {
		if (this.inputObj.value !== null && this.inputObj.value !== undefined) {
			this.inputControl.setValue(this.inputObj.value);
		} else if (this.inputObj.multiSelect) {
			this.inputControl.setValue(this.inputObj.valueList ?? []);
		} else {
			this.inputControl.setValue(this.inputObj.valueList?.[0] ?? "");
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

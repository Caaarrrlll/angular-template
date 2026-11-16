import { KeyValuePipe, TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { AbstractControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TextFieldModule } from "@angular/cdk/text-field";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { _ExpandableGridAdditionalButtonInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-additional-button.interface";
import { _ExpandableGridOptionsInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-options.interface";
import { _ExpandableGridRow } from "@shared/components/expandable-grid/core/types/expandable-grid-row.type";

@Component({
	selector: "app-expandable-grid-form",
	templateUrl: "./expandable-grid-form.component.html",
	styleUrls: ["./expandable-grid-form.component.scss"],
	standalone: true,
	imports: [ReactiveFormsModule, TitleCasePipe, KeyValuePipe, TextFieldModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableGridFormComponent {
	private _currentElement?: _ExpandableGridRow;

	@Input() public additionalButton?: _ExpandableGridAdditionalButtonInterface;
	@Input()
	public get currentElement(): _ExpandableGridRow | undefined {
		return this._currentElement;
	}
	public set currentElement(value: _ExpandableGridRow | undefined) {
		if (!value) {
			return;
		}

		this._currentElement = value;

		this.form.reset();

		if (this.form.contains("cellIndex") && value["isNew"]) {
			this.form.controls["cellIndex"].setValue(999);
		}

		this.form.patchValue(value);
	}
	@Input() public form!: FormGroup;
	@Input() public editableColumns: _ExpandableGridOptionsInterface[] = [];
	@Input() public isDisabled = false;
	@Output() public closed = new EventEmitter<void>();
	@Output() public saved = new EventEmitter<unknown>();

	public hasError(key: string, error: string): boolean {
		return (this.form.controls[key] as AbstractControl | undefined)?.hasError(error) ?? false;
	}

	public cancel(): void {
		this.form.reset();
		this.closed.emit();
	}

	public submit(): void {
		this.saved.emit(this.form.getRawValue());
		this.form.reset();
		this.closed.emit();
	}

	public compareFn(option1: unknown, option2: unknown): boolean {
		// eslint-disable-next-line @typescript-eslint/no-base-to-string -- mat-select compareWith intentionally compares arbitrary option values via their string form, exactly as before
		return String(option1 ?? "") === String(option2 ?? "");
	}
}

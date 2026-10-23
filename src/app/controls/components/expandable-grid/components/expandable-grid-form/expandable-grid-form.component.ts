import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { _ExpandableGridAdditionalButtonInterface } from "@controls/expandable-grid/core/interfaces/expandable-grid-additional-button.interface";
import { _ExpandableGridOptionsInterface } from "../../core/interfaces/expandable-grid-options.interface";

@Component({
	selector: "app-expandable-grid-form",
	templateUrl: "./expandable-grid-form.component.html",
	styleUrls: ["./expandable-grid-form.component.scss"],
})
export class ExpandableGridFormComponent {
	private _currentElement!: Element;

	@Input() public additionalButton?: _ExpandableGridAdditionalButtonInterface;
	@Input()
	public get currentElement(): Element {
		return this._currentElement;
	}
	public set currentElement(v: Element | any) {
		if (!!v) {
			this._currentElement = v;
			this.form.reset();
			this.form.contains("cellIndex") && v.isNew ? this.form.controls["cellIndex"].setValue(999) : v;
			this.form.patchValue(v);
		}
	}
	@Input() public form!: FormGroup;
	@Input() public editableColumns: _ExpandableGridOptionsInterface[] = [];
	@Input() public isDisabled: boolean = false;
	@Output() public onClose = new EventEmitter<void>();
	@Output() public onSave = new EventEmitter<any>();

	constructor(private cdr: ChangeDetectorRef) {}

	public close(): void {
		this.onClose.emit();
		this.form.reset();
		this.cdr.detectChanges();
	}

	public save(): void {
		this.onSave.emit(this.form.value);
		this.form.reset();
		this.cdr.detectChanges();
		this.close();
	}

	public compareFn(option1: any, option2: any) {
		return option1?.toString() === option2?.toString();
	}
}

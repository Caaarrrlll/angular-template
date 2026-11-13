import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-key-value",
	templateUrl: "./key-value.component.html",
	styleUrls: ["./key-value.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueComponent {
	@Input({ required: true }) public key!: string;
	@Input({ required: true }) public value!: string;
	@Input() public row: boolean = false;
	@Input() public showEdit: boolean = false;
	@Input() public removeValuePadding: boolean = false;
	@Input() public sameFontSize: boolean = false;
	@Output() public edit: EventEmitter<void> = new EventEmitter<void>();

	public editField(): void {
		this.edit.emit();
	}
}

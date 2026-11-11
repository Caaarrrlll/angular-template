import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-key-value-v3",
	templateUrl: "./key-value-v3.component.html",
	styleUrls: ["./key-value-v3.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueV3Component {
	@Input({ required: true }) public key!: string;
	@Input({ required: true }) public value!: string;
	@Input() public showEdit: boolean = false;
	@Input() public showView: boolean = false;
	@Input() public alignRight: boolean = false;
	@Input() public title?: string;
	@Input() public keyTitle?: string;
	@Input() public boldValue: boolean = false;
	@Input() public colon: boolean = true;
	@Input() public bottomPadding: string = "10px";

	@Output() public edit: EventEmitter<void> = new EventEmitter<void>();
	@Output() public view: EventEmitter<void> = new EventEmitter<void>();

	public editField(): void {
		this.edit.emit();
	}

	public viewField(): void {
		this.view.emit();
	}
}

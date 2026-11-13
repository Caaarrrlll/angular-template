import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { PercentPipe } from "@angular/common";

@Component({
	selector: "app-key-value-v2",
	templateUrl: "./key-value-v2.component.html",
	styleUrls: ["./key-value-v2.component.scss"],
	imports: [MatIconModule, PercentPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueV2Component {
	@Input({ required: true }) public key!: string;
	@Input({ required: true }) public value!: string;
	@Input() public valPercent?: number;
	@Input() public alignRight: boolean = false;
	@Input() public showEdit: boolean = false;
	@Input() public showView: boolean = false;
	@Input() public title?: string;
	@Input() public keyTitle?: string;
	@Input() public boldValue: boolean = false;
	@Input() public keyColor?: "red" | "green" | "orange";
	@Input() public valueColor?: "red" | "green" | "orange";

	@Output() public edit: EventEmitter<void> = new EventEmitter<void>();
	@Output() public view: EventEmitter<void> = new EventEmitter<void>();

	public editField(): void {
		this.edit.emit();
	}

	public viewField(): void {
		this.view.emit();
	}
}

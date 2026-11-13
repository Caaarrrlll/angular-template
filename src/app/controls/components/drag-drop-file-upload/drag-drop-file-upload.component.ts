import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { DragAndDropFilesDirective } from "@shared/directives/drag-and-drop-files.directive";

@Component({
	selector: "app-drag-drop-file-upload",
	templateUrl: "./drag-drop-file-upload.component.html",
	styleUrls: ["./drag-drop-file-upload.component.scss"],
	imports: [DragAndDropFilesDirective, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragDropFileUploadComponent {
	@Input() public files: File[] = [];
	@Input() public isInDialog: boolean = false;
	@Input() public filesToAccept?: string;
	@Output() public fileAdded: EventEmitter<File[]> = new EventEmitter<File[]>();
	@Output() public close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public handleFilesDropped(files: FileList | File[] | null): void {
		if (files === null) {
			return;
		}
		this.fileAdded.emit(Array.from(files));
	}

	public onClose(): void {
		this.close.emit(true);
	}
}

import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
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
	public readonly files = input<File[]>([]);
	public readonly isInDialog = input<boolean>(false);
	public readonly filesToAccept = input<string | undefined>();
	public readonly fileAdded = output<File[]>();
	public readonly closed = output<boolean>();

	public handleFilesDropped(files: FileList | File[] | null): void {
		if (files === null) {
			return;
		}
		this.fileAdded.emit(Array.from(files));
	}

	public onClose(): void {
		this.closed.emit(true);
	}
}

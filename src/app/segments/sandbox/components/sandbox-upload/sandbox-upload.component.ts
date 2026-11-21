import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { _SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { DragDropFileUploadComponent } from "@shared/components/drag-drop-file-upload/drag-drop-file-upload.component";
import { DragAndDropFilesDirective } from "@shared/directives/drag-and-drop-files.directive";

const ACCEPT_IMAGES_AND_PDF = `image/*,.pdf`;

@Component({
	selector: "app-sandbox-upload",
	templateUrl: "./sandbox-upload.component.html",
	styleUrls: ["./sandbox-upload.component.scss"],
	imports: [SandboxPageComponent, SandboxDemoComponent, DragDropFileUploadComponent, DragAndDropFilesDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxUploadComponent {
	public readonly acceptHint: string = ACCEPT_IMAGES_AND_PDF;

	// ---- drag-drop-file-upload ---- //
	public readonly uploadFiles: WritableSignal<File[]> = signal<File[]>([]);
	public readonly uploadIsInDialog: WritableSignal<boolean> = signal(false);
	public readonly uploadRestrictTypes: WritableSignal<boolean> = signal(false);
	public readonly uploadVisible: WritableSignal<boolean> = signal(true);
	public readonly uploadLog = new _SandboxEventLog();

	// ---- appDragAndDropFiles directive ---- //
	public readonly droppedFiles: WritableSignal<File[]> = signal<File[]>([]);
	public readonly dropLog = new _SandboxEventLog();

	public onFileAdded(files: File[]): void {
		this.uploadFiles.update((current: File[]): File[] => [...current, ...files]);
		this.uploadLog.add(`fileAdded: ${this.describeFiles(files)}`);
	}

	public onUploadClosed(closed: boolean): void {
		this.uploadVisible.set(false);
		this.uploadLog.add(`closed: ${String(closed)}`);
	}

	public reopenUpload(): void {
		this.uploadVisible.set(true);
	}

	public clearUploadFiles(): void {
		this.uploadFiles.set([]);
		this.uploadLog.add(`files cleared (parent state)`);
	}

	public onFileDropped(files: File[]): void {
		this.droppedFiles.set(files);
		this.dropLog.add(`fileDropped: ${this.describeFiles(files)}`);
	}

	public formatSize(bytes: number): string {
		if (bytes < 1024) {
			return `${String(bytes)} B`;
		}
		if (bytes < 1024 * 1024) {
			return `${(bytes / 1024).toFixed(1)} KB`;
		}
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	private describeFiles(files: File[]): string {
		return files.map((file: File): string => `${file.name} (${this.formatSize(file.size)})`).join(`, `);
	}
}

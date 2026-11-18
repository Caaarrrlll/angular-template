import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { DragAndDropFilesDirective } from "@shared/directives/drag-and-drop-files.directive";

/** Gives each instance its own file-input id, so every "Browse for file" label opens its own input. */
let nextInstanceId = 0;

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
	/** Same syntax as the native `accept` attribute (".pdf,image/*,text/plain"); applied to browsed and dropped files. */
	public readonly filesToAccept = input<string | undefined>();
	public readonly fileAdded = output<File[]>();
	public readonly closed = output<boolean>();

	public readonly inputId = `file-drop-${String(++nextInstanceId)}`;

	public handleFilesDropped(files: FileList | File[] | null): void {
		if (files === null) {
			return;
		}
		// `accept` only filters the browse dialog (and can be overridden there); drops bypass it entirely.
		const accepted: File[] = Array.from(files).filter((file: File): boolean => matchesAccept(file, this.filesToAccept()));
		if (accepted.length > 0) {
			this.fileAdded.emit(accepted);
		}
	}

	public onClose(): void {
		this.closed.emit(true);
	}
}

/** Native `accept` matching: `.ext` by file name, `type/*` by MIME prefix, otherwise an exact MIME type. */
function matchesAccept(file: File, accept: string | undefined): boolean {
	const tokens: string[] = (accept ?? ``)
		.split(`,`)
		.map((token: string): string => token.trim().toLowerCase())
		.filter((token: string): boolean => token.length > 0);
	if (tokens.length === 0) {
		return true;
	}
	const name: string = file.name.toLowerCase();
	const type: string = file.type.toLowerCase();
	return tokens.some((token: string): boolean => {
		if (token.startsWith(`.`)) {
			return name.endsWith(token);
		}
		if (token.endsWith(`/*`)) {
			return type.startsWith(token.slice(0, -1));
		}
		return type === token;
	});
}

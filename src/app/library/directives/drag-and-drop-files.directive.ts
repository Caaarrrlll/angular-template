import { Directive, EventEmitter, Output } from "@angular/core";

@Directive({
	selector: "[appDragAndDropFiles]",
	host: {
		"[class.fileover]": "fileOver",
		"(dragover)": "onDragOver($event)",
		"(dragleave)": "onDragLeave($event)",
		"(drop)": "onDrop($event)",
	},
})
export class DragAndDropFilesDirective {
	public fileOver = false;
	@Output() public fileDropped = new EventEmitter<File[]>();

	public onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.fileOver = true;
	}

	public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.fileOver = false;
	}

	public onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.fileOver = false;
		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			this.fileDropped.emit(Array.from(files));
		}
	}
}

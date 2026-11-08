import { Directive, EventEmitter, HostBinding, HostListener, Output } from "@angular/core";

@Directive({
	selector: "[appDragAndDropFiles]",
	standalone: true,
})
export class DragAndDropFilesDirective {
	@HostBinding("class.fileover") public fileOver = false;
	@Output() public fileDropped = new EventEmitter<File[]>();

	@HostListener("dragover", ["$event"]) public onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.fileOver = true;
	}

	@HostListener("dragleave", ["$event"]) public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.fileOver = false;
	}

	@HostListener("drop", ["$event"]) public onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.fileOver = false;
		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			this.fileDropped.emit(Array.from(files));
		}
	}
}

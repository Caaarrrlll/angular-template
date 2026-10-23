import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
	selector: "app-drag-drop-file-upload",
	templateUrl: "./drag-drop-file-upload.component.html",
	styleUrls: ["./drag-drop-file-upload.component.scss"],
})
export class DragDropFileUploadComponent implements OnInit, OnChanges {
	@Output() fileAdded = new EventEmitter<File[]>();
	@Output() close = new EventEmitter<boolean>();
	@Input() public files: File[] = [];
	@Input() public isInDialog: boolean = false;
	@Input() public filesToAccept?: string;

	constructor() {}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		this.files = changes.files.currentValue;
	}

	handleFilesDropped(files: File[]) {
		this.fileAdded.emit(files);
	}

	onClose() {
		this.close.emit(true);
	}
}

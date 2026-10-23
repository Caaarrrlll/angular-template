import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
	selector: "app-drag-drop-file-upload-with-comment",
	templateUrl: "./drag-drop-file-upload-with-comment.component.html",
	styleUrls: ["./drag-drop-file-upload-with-comment.component.scss"],
})
export class DragDropFileUploadWithCommentComponent implements OnInit, OnChanges {
	@Output() fileAdded = new EventEmitter<File[]>();
	@Output() close = new EventEmitter<boolean>();
	@Output() comment = new EventEmitter<string>();
	@Input() public files: File[] = [];
	@Input() public isInDialog: boolean = false;
	@Input() public filesToAccept?: string;
	@Input() public newComment?: string;

	constructor() {}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		this.files = changes.files.currentValue;
	}

	handleFilesDropped(files: File[]) {
		this.fileAdded.emit(files);
	}

	handleAddedComment(comm: string) {
		this.comment.emit(comm);
	}

	onClose() {
		this.close.emit(true);
	}
}

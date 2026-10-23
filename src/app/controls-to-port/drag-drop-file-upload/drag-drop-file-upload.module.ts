import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DragDropFileUploadComponent } from "@controls/drag-drop-file-upload/drag-drop-file-upload.component";
import { DragAndDropFilesDirectiveModule } from "@directives/drag-and-drop-files.directive";

@NgModule({
	declarations: [DragDropFileUploadComponent],
	imports: [CommonModule, DragAndDropFilesDirectiveModule],
	exports: [DragDropFileUploadComponent],
})
export class DragDropFileUploadModule {}

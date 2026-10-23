import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "@controls/index";

@NgModule({
	declarations: [ConfirmationDialogComponent],
	imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmationDialogModule {}

import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { _ConfirmationDialogData } from "@shared/components/confirmation-dialog/confirmation-dialog.interface";

@Component({
	selector: "app-confirmation-dialog",
	templateUrl: "./confirmation-dialog.component.html",
	styleUrls: ["./confirmation-dialog.component.scss"],
	standalone: true,
	imports: [MatButtonModule, MatDialogModule],
})
export class ConfirmationDialogComponent {
	public readonly dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);
	public readonly data = inject<_ConfirmationDialogData | null>(MAT_DIALOG_DATA, { optional: true });
}

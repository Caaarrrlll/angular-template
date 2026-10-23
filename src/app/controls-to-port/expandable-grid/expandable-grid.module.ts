import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { PipesModule } from "@pipes/pipes.module";
import { ChipListModule } from "../chip-list/chip-list.module";
import { ConfirmationDialogModule } from "../confirmation-dialog/confirmation-dialog.module";
import { TimeSpanPickerModule } from "../time-span-picker/time-span-picker.module";
import { ExpandableGridFormComponent } from "./components/expandable-grid-form/expandable-grid-form.component";
import { ExpandableGridComponent } from "@controls/expandable-grid/expandable-grid.component";

@NgModule({
	declarations: [ExpandableGridComponent, ExpandableGridFormComponent],
	imports: [
		CommonModule,
		MatTableModule,
		MatCardModule,
		MatPaginatorModule,
		MatButtonModule,
		MatIconModule,
		ConfirmationDialogModule,
		MatProgressSpinnerModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatInputModule,
		MatCardModule,
		MatSelectModule,
		MatCheckboxModule,
		PipesModule,
		TimeSpanPickerModule,
		ChipListModule,
	],
	exports: [ExpandableGridComponent, ExpandableGridFormComponent],
})
export class ExpandableGridModule {}

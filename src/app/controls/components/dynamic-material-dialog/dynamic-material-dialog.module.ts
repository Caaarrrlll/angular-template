import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { CheckboxGroupModule } from "@controls/checkbox-group/checkbox-group.module";
import { DragDropFileUploadModule } from "@controls/drag-drop-file-upload/drag-drop-file-upload.module";
import { DynamicMaterialDialogComponent } from "@controls/dynamic-material-dialog/dynamic-material-dialog.component";
import { RangeCheckboxGroupModule } from "@controls/range-checkbox-group/range-checkbox-group.module";
import { CustButtonToggleModule } from "@controls/cust-basic-controls/cust-button-toggle/cust-button-toggle.module";
import { DateTransformDirectiveModule } from "@directives/date-transform.directive";
import { MinMaxDirectiveModule } from "@directives/min-max.directive";
import { PipesModule } from "@pipes/pipes.module";

@NgModule({
	declarations: [DynamicMaterialDialogComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatRadioModule,
		MatSliderModule,
		DragDropModule,
		MatButtonToggleModule,
		PipesModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatIconModule,
		CheckboxGroupModule,
		RangeCheckboxGroupModule,
		DragDropFileUploadModule,
		MinMaxDirectiveModule,
		DateTransformDirectiveModule,
		CustButtonToggleModule,
	],
	exports: [DynamicMaterialDialogComponent],
})
export class DynamicMaterialDialogModule {}

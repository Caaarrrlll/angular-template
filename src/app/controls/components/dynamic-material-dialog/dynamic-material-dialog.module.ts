import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { ButtonToggleComponent } from "@shared/components/button-toggle/button-toggle.component";
import { CheckboxGroupComponent } from "@shared/components/checkbox-group/checkbox-group.component";
import { CheckboxComponent } from "@shared/components/checkbox-group/checkbox/checkbox.component";
import { RangeCheckboxGroupComponent } from "@shared/components/range-checkbox-group/range-checkbox-group.component";
import { RangeCheckboxComponent } from "@shared/components/range-checkbox-group/range-checkbox/range-checkbox.component";
import { DateTransformDirectiveModule } from "@shared/directives/date-transform.directive";
import { DragAndDropFilesDirectiveModule } from "@shared/directives/drag-and-drop-files.directive";
import { MinMaxDirectiveModule } from "@shared/directives/min-max.directive";
import { DynamicMaterialDialogComponent } from "./dynamic-material-dialog.component";

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
		MatProgressSpinnerModule,
		MatIconModule,
		CheckboxGroupComponent,
		CheckboxComponent,
		RangeCheckboxGroupComponent,
		RangeCheckboxComponent,
		ButtonToggleComponent,
		DragAndDropFilesDirectiveModule,
		MinMaxDirectiveModule,
		DateTransformDirectiveModule,
	],
	exports: [DynamicMaterialDialogComponent],
})
export class DynamicMaterialDialogModule {}

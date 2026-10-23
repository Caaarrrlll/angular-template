import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { QueryBuilderComponent } from "@controls/query-builder/query-builder.component";
import { CustButtonV2Module } from "@controls/cust-basic-controls/cust-button-v2/cust-button-v2.module";

@NgModule({
	declarations: [QueryBuilderComponent],
	imports: [CommonModule, MatButtonToggleModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatInputModule, CustButtonV2Module],
	exports: [QueryBuilderComponent],
})
export class QueryBuilderModule {}

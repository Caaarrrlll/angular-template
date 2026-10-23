import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "@pipes/pipes.module";
import { KendoModule } from "src/app/kendo.module";
import { CustButtonModule } from "../cust-button/cust-button.module";
import { DynamicWindowComponent } from "./dynamic-window.component";

@NgModule({
	imports: [CommonModule, KendoModule, FormsModule, ReactiveFormsModule, CustButtonModule, PipesModule],
	declarations: [DynamicWindowComponent],
	exports: [DynamicWindowComponent],
})
export class DynamicWindowModule {}

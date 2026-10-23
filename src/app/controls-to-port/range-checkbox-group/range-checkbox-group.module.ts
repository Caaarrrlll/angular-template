import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RangeCheckboxComponent } from "@controls/range-checkbox-group/range-checkbox/range-checkbox.component";
import { RangeCheckboxGroupComponent } from "./range-checkbox-group.component";

@NgModule({
	declarations: [RangeCheckboxGroupComponent, RangeCheckboxComponent],
	imports: [CommonModule, MatCheckboxModule, MatButtonModule],
	exports: [RangeCheckboxGroupComponent, RangeCheckboxComponent],
})
export class RangeCheckboxGroupModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CheckboxComponent } from "@controls/checkbox-group/checkbox/checkbox.component";
import { CheckboxGroupComponent } from "./checkbox-group.component";

@NgModule({
	declarations: [CheckboxGroupComponent, CheckboxComponent],
	imports: [CommonModule, MatCheckboxModule, MatButtonModule],
	exports: [CheckboxGroupComponent, CheckboxComponent],
})
export class CheckboxGroupModule {}

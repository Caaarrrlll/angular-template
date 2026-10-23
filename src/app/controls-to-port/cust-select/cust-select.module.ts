import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectComponent } from "./select/select.component";
import { CustClickElsewhereDirective } from "./select/cust-click-elsewhere.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { OptionComponent } from "./option/option.component";

@NgModule({
	imports: [CommonModule, ReactiveFormsModule],
	declarations: [SelectComponent, OptionComponent, CustClickElsewhereDirective],
	exports: [SelectComponent, OptionComponent, CustClickElsewhereDirective],
})
export class CustSelectModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { CustLoaderModule } from "@controls/cust-loader/cust-loader.module";
import { MenusModule } from "@progress/kendo-angular-menu";
import { SharedControlsModule } from "src/app/controls/shared-controls.module";
import { ButtonComponent } from "./button/button.component";
import { FabButtonComponent } from "./fab-button/fab-button.component";

@NgModule({
	imports: [CommonModule, MatRippleModule, MenusModule, SharedControlsModule, MatIconModule, CustLoaderModule],
	declarations: [ButtonComponent, FabButtonComponent],
	exports: [ButtonComponent, FabButtonComponent],
})
export class CustButtonModule {}

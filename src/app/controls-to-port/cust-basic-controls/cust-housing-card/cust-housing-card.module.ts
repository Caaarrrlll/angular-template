import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { CustHousingCardComponent } from "./cust-housing-card.component";

@NgModule({
	declarations: [CustHousingCardComponent],
	imports: [CommonModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatCardModule],
	exports: [CustHousingCardComponent],
})
export class CustHousingCardModule {}

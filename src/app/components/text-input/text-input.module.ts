import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { TextInputComponent } from "src/app/components/text-input/text-input.component";

@NgModule({
	declarations: [TextInputComponent],
	imports: [CommonModule, MatInputModule],
	exports: [TextInputComponent],
})
export class TextInputModule {}

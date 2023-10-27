import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { PlaygroundRoutingModule } from "./playground-routing.module";
import { PlaygroundComponent } from "./playground/playground.component";

@NgModule({
	declarations: [PlaygroundComponent],
	imports: [CommonModule, PlaygroundRoutingModule, MatFormFieldModule],
})
export class PlaygroundModule {}

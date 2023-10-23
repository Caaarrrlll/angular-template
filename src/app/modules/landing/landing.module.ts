import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TextInputModule } from "src/app/components/text-input/text-input.module";
import { LandingComponent } from "./components/landing/landing.component";
import { LandingRoutingModule } from "./landing-routing.module";

@NgModule({
	declarations: [LandingComponent],
	imports: [CommonModule, LandingRoutingModule, TextInputModule],
})
export class LandingModule {}

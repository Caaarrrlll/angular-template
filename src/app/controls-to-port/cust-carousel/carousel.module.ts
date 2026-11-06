import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustLoaderModule } from "@controls/cust-loader/cust-loader.module";
import { SafePipe } from "@shared/pipes/safe/safe.pipe";
import { SpaceBetweenUppercasePipe } from "@shared/pipes/space-between-uppercase/space-between-uppercase.pipe";
import { SharedControlsModule } from "src/app/controls/shared-controls.module";
import { CarouselComponent } from "src/app/controls-to-port/cust-carousel/carousel/carousel.component";

@NgModule({
	imports: [CommonModule, SharedControlsModule, CustLoaderModule, SafePipe, SpaceBetweenUppercasePipe],
	declarations: [CarouselComponent],
	exports: [CarouselComponent],
})
export class CustCarouselModule {}

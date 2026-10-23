import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustLoaderModule } from "@controls/cust-loader/cust-loader.module";
import { PipesModule } from "@pipes/pipes.module";
import { SharedControlsModule } from "src/app/controls/shared-controls.module";
import { CarouselComponent } from "src/app/controls/cust-carousel/carousel/carousel.component";

@NgModule({
	imports: [CommonModule, PipesModule, SharedControlsModule, CustLoaderModule],
	declarations: [CarouselComponent],
	exports: [CarouselComponent],
})
export class CustCarouselModule {}

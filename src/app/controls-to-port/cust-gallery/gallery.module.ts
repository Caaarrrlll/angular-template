import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { CustFlatVehicleModule } from "@controls/cust-flat-vehicle/cust-flat-vehicle.module";
import { ZoomDirectiveModule } from "@directives/zoom.directive";
import { PipesModule } from "@pipes/pipes.module";
import { SafePipe } from "@shared/pipes/safe/safe.pipe";
import { GalleryPreviewComponent } from "./gallery-preview/gallery-preview.component";
import { GalleryComponent } from "./gallery/gallery.component";

@NgModule({
	imports: [CommonModule, MatRippleModule, ZoomDirectiveModule, PipesModule, CustFlatVehicleModule, SafePipe],
	declarations: [GalleryComponent, GalleryPreviewComponent],
	exports: [GalleryComponent, GalleryPreviewComponent],
})
export class CustGalleryModule {}

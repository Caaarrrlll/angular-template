import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PascalToTitlePipe } from "@pipes/pascal-to-title-pipe/pascal-to-title.pipe";

@NgModule({
	declarations: [PascalToTitlePipe],
	exports: [PascalToTitlePipe],
	imports: [CommonModule],
})
export class PascalToTitleModule {}

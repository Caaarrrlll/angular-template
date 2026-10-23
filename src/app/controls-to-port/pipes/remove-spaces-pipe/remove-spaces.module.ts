import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RemoveSpacesPipe } from "@pipes/remove-spaces-pipe/remove-spaces.pipe";

@NgModule({
	declarations: [RemoveSpacesPipe],
	exports: [RemoveSpacesPipe],
	imports: [CommonModule],
})
export class RemoveSpacesModule {}

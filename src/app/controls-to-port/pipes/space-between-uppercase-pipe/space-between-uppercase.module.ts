import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SpaceBetweenUppercase } from "@pipes/space-between-uppercase-pipe/space-between-uppercase.pipe";

@NgModule({
	declarations: [SpaceBetweenUppercase],
	exports: [SpaceBetweenUppercase],
	imports: [CommonModule],
})
export class SpaceBetweenUppercaseModule {}

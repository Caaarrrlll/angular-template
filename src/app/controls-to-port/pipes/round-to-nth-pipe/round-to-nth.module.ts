import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RoundToNthPipe } from "@pipes/round-to-nth-pipe/round-to-nth.pipe";

@NgModule({
	declarations: [RoundToNthPipe],
	exports: [RoundToNthPipe],
	imports: [CommonModule],
})
export class RoundToNthModule {}

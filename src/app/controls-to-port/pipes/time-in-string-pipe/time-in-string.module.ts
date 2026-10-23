import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TimeInStringPipe } from "@pipes/time-in-string-pipe/time-in-string.pipe";

@NgModule({
	declarations: [TimeInStringPipe],
	exports: [TimeInStringPipe],
	imports: [CommonModule],
})
export class TimeInStringModule {}

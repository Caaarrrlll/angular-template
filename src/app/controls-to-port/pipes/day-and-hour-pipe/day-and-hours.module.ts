import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DayAndHoursPipe } from "@pipes/day-and-hour-pipe/day-and-hours.pipe";

@NgModule({
	declarations: [DayAndHoursPipe],
	exports: [DayAndHoursPipe],
	imports: [CommonModule],
})
export class DayAndHoursModule {}

import { Pipe, PipeTransform, inject } from "@angular/core";
import { DateTimeOpsService } from "@shared/services/date-time-ops.service";

@Pipe({
	name: "timeElapsedFormat",
	standalone: true,
	pure: false,
})
export class TimeElapsedFormatPipe implements PipeTransform {
	private readonly dateTimeOps = inject(DateTimeOpsService);

	public transform(date: string): string {
		const relativeDate = new Date(date);
		const currentDate = new Date();

		if (currentDate.getTime() >= relativeDate.getTime()) {
			return this.dateTimeOps.getRelativeTime(relativeDate);
		}
		return this.dateTimeOps.timeTillNow(true, relativeDate);
	}
}

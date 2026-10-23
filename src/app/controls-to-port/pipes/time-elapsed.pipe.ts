import { Pipe, PipeTransform } from "@angular/core";
import { DateTimeOpsService } from "@services/date-time-ops.service";

@Pipe({
	name: "timeElapsedFormat",
	pure: false,
})
export class TimeElapsedFormatPipe implements PipeTransform {
	constructor(private _dts: DateTimeOpsService) {}
	transform(date: string): string {
		const relativeDate = new Date(date);
		const currentDate = new Date();

		if (currentDate.getTime() >= relativeDate.getTime()) {
			return this._dts.getRelativeTime(relativeDate);
		}
		return this._dts.timeTillNow(true, relativeDate);
	}
}

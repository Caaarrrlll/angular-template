import { DatePipe } from "@angular/common";
import { inject, Pipe, PipeTransform } from "@angular/core";

/**
 * Converts UTC date-time strings (`dd/MM/yyyy HH:mm:ss +00:00`) embedded in a string to `dd/MM/yyyy HH:mm:ss`
 * in the user's local time, or in the given time zone, using the DatePipe.
 *
 * @example
 *      {{ "Report from 01/02/2024 08:00:00 +00:00" | timeInString }}            → local time
 *      {{ "Report from 01/02/2024 08:00:00 +00:00" | timeInString: "+0200" }}   → "Report from 01/02/2024 10:00:00"
 */
@Pipe({
	name: "timeInString",
})
export class TimeInStringPipe implements PipeTransform {
	private readonly datePipe = inject(DatePipe);

	/** @param timezone DatePipe time zone (an offset such as `+0200`, or `UTC`); omit for the DatePipe default (local time). */
	public transform(value: string | undefined, timezone?: string): string {
		if (!value) {
			return "";
		}
		return value.replace(/[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} \+00:00/gm, (match) => {
			if (match) {
				return this.datePipe.transform(match, "dd/MM/yyyy HH:mm:ss", timezone) ?? "";
			}
			return match;
		});
	}
}

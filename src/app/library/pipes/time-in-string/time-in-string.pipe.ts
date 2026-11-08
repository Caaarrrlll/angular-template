import { DatePipe } from "@angular/common";
import { inject, Pipe, PipeTransform } from "@angular/core";

/**
 * Converts UTC date-time strings (`dd/MM/yyyy HH:mm:ss +00:00`) embedded in a
 * string into CAT time using the DatePipe.
 *
 * @example
 *      {{ "Report from 01/02/2024 08:00:00 +00:00" | timeInString }}
 */
@Pipe({
	name: "timeInString",
	standalone: true,
})
export class TimeInStringPipe implements PipeTransform {
	private readonly datePipe = inject(DatePipe);

	public transform(value: string | undefined): string {
		if (!value) {
			return "";
		}
		return value.replace(/[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} \+00:00/gm, (match) => {
			if (match) {
				return `${(this.datePipe.transform(match, "dd/MM/yyyy HH:mm:ss", "CAT") ?? "")}`;
			}
			return match;
		});
	}
}

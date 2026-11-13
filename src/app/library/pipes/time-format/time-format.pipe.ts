import { Pipe, PipeTransform } from "@angular/core";

/**
 * Formats a date string as a time using the given zone abbreviation (for
 * example `CAT`).
 *
 * @example
 *      {{ "2024-01-01T09:30:00Z" | timeFormat }}
 */
@Pipe({
	name: "timeFormat",
	pure: false,
	standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
	public transform(date: string, timeZone: string = "CAT"): string {
		return new Date(date).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", timeZone: timeZone, hour12: false });
	}
}

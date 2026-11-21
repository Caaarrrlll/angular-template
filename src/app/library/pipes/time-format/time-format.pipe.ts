import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

/**
 * Formats a date string as a 24-hour `HH:mm` time in the app locale (`LOCALE_ID`).
 * Shows the user's local time unless an IANA time zone is given.
 *
 * @example
 *      {{ "2024-01-01T09:30:00Z" | timeFormat }}                          → local time
 *      {{ "2024-01-01T09:30:00Z" | timeFormat: "Africa/Johannesburg" }}   → "11:30"
 */
@Pipe({
	name: "timeFormat",
	pure: false,
})
export class TimeFormatPipe implements PipeTransform {
	private readonly localeId: string = inject(LOCALE_ID);

	/** @param timeZone IANA zone name (e.g. `Europe/London`); omit for the user's local time. */
	public transform(date: string, timeZone?: string): string {
		return new Date(date).toLocaleTimeString(this.localeId, { hour: `2-digit`, minute: `2-digit`, timeZone: timeZone, hour12: false });
	}
}

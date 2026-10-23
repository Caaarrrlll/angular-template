import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "timeFormat",
	pure: false,
})
export class TimeFormatPipe implements PipeTransform {
	transform(date: string, timeZone: string = "CAT"): string {
		return new Date(date).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", timeZone: timeZone, hour12: false });
	}
}

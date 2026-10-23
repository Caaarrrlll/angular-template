import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "timeInString" })
export class TimeInStringPipe implements PipeTransform {
	constructor(private _datePipe: DatePipe) {}
	transform(value: string): string {
		return value.replace(/[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} \+00:00/gm, (match) => {
			if (match) {
				return `${this._datePipe.transform(match, "dd/MM/yyyy HH:mm:ss", "CAT")}`;
			}
			return match;
		});
	}
}

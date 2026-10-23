import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "timeMask",
})
export class TimeMaskPipe implements PipeTransform {
	transform(value: string): string {
		const values = value.split(".");
		return values[0] + "d " + values[1];
	}
}

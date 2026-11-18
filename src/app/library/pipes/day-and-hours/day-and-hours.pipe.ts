import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "dayAndHours",
})
export class DayAndHoursPipe implements PipeTransform {
	public transform(value: Date | string | null | undefined): string {
		if (!value) {
			return "";
		}

		const date = new Date(value);
		const currentDate = new Date();
		const diffInHours = (currentDate.getTime() - date.getTime()) / 1000 / 60 / 60;
		return `${String(Math.floor(diffInHours / 24))} Days: ${String(Math.ceil(diffInHours % 24))} Hours`;
	}
}

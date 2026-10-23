import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "dayAndHours",
})
export class DayAndHoursPipe implements PipeTransform {
	transform(value: Date): unknown {
		if (value) {
			const date = new Date(value);
			const currentDate = new Date();
			const diffInHours = (currentDate.getTime() - date.getTime()) / 1000 / 60 / 60;
			return `${Math.floor(diffInHours / 24)} Days: ${Math.ceil(diffInHours % 24)} Hours`;
		} else {
			return "";
		}
	}
}

import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "groupByDate" })
export class GroupByDatePipe implements PipeTransform {
	constructor(private _datePipe: DatePipe) {}

	transform(collection: Array<any>) {
		if (!collection) {
			return null;
		}

		const gc = collection.reduce((previous, current) => {
			const dt = this._datePipe.transform(current["entryDate"], "d MMMM yyyy");

			if (!previous[dt]) {
				previous[dt] = [];
			}
			previous[dt].push(current);
			return previous;
		}, {});

		return Object.keys(gc).map((date) => ({ date: date, leadHistory: gc[date] }));
	}
}

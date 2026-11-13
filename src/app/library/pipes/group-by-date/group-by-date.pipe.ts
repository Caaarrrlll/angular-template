import { DatePipe } from "@angular/common";
import { inject, Pipe, PipeTransform } from "@angular/core";

/** A collection grouped by formatted date. */
export interface _GroupedDate {
	date: string;
	leadHistory: unknown[];
}

/**
 * Groups a collection of items by their `entryDate` property.
 *
 * @example
 *      {{ leadHistory | groupByDate }}
 */
@Pipe({
	name: "groupByDate",
	standalone: true,
})
export class GroupByDatePipe implements PipeTransform {
	private readonly datePipe = inject(DatePipe);

	public transform(collection: unknown[] | undefined | null): _GroupedDate[] | null {
		if (!collection) {
			return null;
		}

		const grouped = collection.reduce<Record<string, unknown[]>>((previous, current) => {
			const entry = (current as Record<string, unknown>)["entryDate"];
			const dt = this.datePipe.transform(entry as string | number | Date, "d MMMM yyyy") ?? "";

			if (!previous[dt]) {
				previous[dt] = [];
			}
			previous[dt].push(current);
			return previous;
		}, {});

		return Object.keys(grouped).map((date) => ({ date: date, leadHistory: grouped[date] }));
	}
}

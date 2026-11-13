import { Pipe, PipeTransform } from "@angular/core";

/**
 * Filters an array with an object of property values or a predicate function.
 *
 * @example
 *      {{ items | arrayFilter: { status: "open" } }}
 *      {{ items | arrayFilter: (item) => item.amount > 10 }}
 */
@Pipe({
	name: "arrayFilter",
	standalone: true,
})
export class FilterPipe implements PipeTransform {
	public transform<T extends object>(items: T[] | undefined | null, filter: Partial<T> | ((item: T) => boolean)): T[] {
		if (!items || !filter) {
			return items ?? [];
		}

		if (typeof filter === "function") {
			return items.filter(filter);
		}
		return items.filter((item) => this.compare(item, filter));
	}

	private compare<T extends object>(item: T, filter: Partial<T>): boolean {
		for (const prop of Object.keys(filter) as Array<keyof T>) {
			if (filter[prop] !== item[prop]) {
				return false;
			}
		}
		return true;
	}
}

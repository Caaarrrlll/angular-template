import { Pipe, PipeTransform } from "@angular/core";

/**
 * Sorts an array with a comparator function. Only function comparators are
 * supported; anything else returns undefined.
 *
 * @example
 *      {{ items | orderBy: (a: SortRow, b: SortRow) => a.name.localeCompare(b.name) }}
 */
@Pipe({
	name: "orderBy",
	standalone: true,
})
export class OrderByPipe implements PipeTransform {
	public transform<T>(value: T[] | undefined, sort: (a: T, b: T) => number): T[] | undefined {
		if (typeof sort === "function") {
			return value?.sort(sort);
		}
		return undefined;
	}
}

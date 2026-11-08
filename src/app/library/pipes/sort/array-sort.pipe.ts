import { Pipe, PipeTransform } from "@angular/core";

/**
 * Sorts an array of records by a field.
 *
 * @example
 *      {{ rows | sort: "name" }}
 */
@Pipe({
	name: "sort",
	standalone: true,
})
export class ArraySortPipe implements PipeTransform {
	public transform(array: Array<Record<string, any>> | undefined | null, field: string): Array<Record<string, any>> {
		if (!Array.isArray(array)) {
			return [];
		}

		array.sort((a, b) => {
			if (a[field] < b[field]) {
				return -1;
			} else if (a[field] > b[field]) {
				return 1;
			} else {
				return 0;
			}
		});
		return array;
	}
}

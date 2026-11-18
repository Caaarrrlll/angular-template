import { Pipe, PipeTransform } from "@angular/core";

/**
 * Sorts an array of records by a field.
 *
 * @example
 *      {{ rows | sort: "name" }}
 */
@Pipe({
	name: "sort",
})
export class ArraySortPipe implements PipeTransform {
	public transform(array: Record<string, unknown>[] | undefined | null, field: string): Record<string, unknown>[] {
		if (!Array.isArray(array)) {
			return [];
		}

		array.sort((a, b) => {
			if ((a[field] as string | number) < (b[field] as string | number)) {
				return -1;
			} else if ((a[field] as string | number) > (b[field] as string | number)) {
				return 1;
			} else {
				return 0;
			}
		});
		return array;
	}
}

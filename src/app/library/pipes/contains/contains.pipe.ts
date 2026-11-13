import { Pipe, PipeTransform } from "@angular/core";

/**
 * Checks whether an array contains a value or matches a predicate function.
 *
 * @example
 *      {{ items | contains: "item-1" }}
 *      {{ items | contains: (item) => item.active }}
 */
@Pipe({
	name: "contains",
	standalone: true,
})
export class ContainsPipe implements PipeTransform {
	public transform<T>(items: T[] | undefined, someCondition: T | ((item: T) => boolean)): boolean {
		if (!items || !someCondition) {
			return false;
		}

		if (typeof someCondition === "function") {
			return items.some(someCondition as (item: T) => boolean);
		}
		return items.some((item) => item === someCondition);
	}
}

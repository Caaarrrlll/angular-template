import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "contains",
})
export class ContainsPipe implements PipeTransform {
	transform(items: any[], someCondition: any): boolean {
		if (!items || !someCondition) {
			return false;
		}

		const type = typeof someCondition;
		if (type === "function") {
			return items.some(someCondition);
		} else {
			return items.some((item) => item === someCondition);
		}
	}
}

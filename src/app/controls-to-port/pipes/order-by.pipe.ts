import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "orderBy",
})
export class OrderByPipe implements PipeTransform {
	transform(value: any[], sort: any): any[] {
		const type = typeof sort;
		if (type === "function") {
			const sortedValues = value.sort(sort);
			return sortedValues;
		}
	}
}

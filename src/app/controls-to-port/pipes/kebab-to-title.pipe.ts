import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "kebabToTitle" })
export class KebabToTitlePipe implements PipeTransform {
	constructor() {}
	transform(value: string): string {
		return value.replace("-", " ");
	}
}

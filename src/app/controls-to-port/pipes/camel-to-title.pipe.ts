import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "camelToTitle" })
export class CamelToTitlePipe implements PipeTransform {
	constructor() {}
	transform(text: string) {
		if (!text) return;

		return text.replace(/([A-Z]+)/g, " $1").replace(/^./, (str) => str.toUpperCase());
	}
}

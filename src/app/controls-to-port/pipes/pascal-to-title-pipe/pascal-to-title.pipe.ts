import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "pascalToTitle" })
export class PascalToTitlePipe implements PipeTransform {
	constructor() {}
	transform(text: string) {
		if (!text) return;

		return text.replace(/\B([A-Z]+)/g, " $1").replace(/^./, (str) => str.toUpperCase());
	}
}

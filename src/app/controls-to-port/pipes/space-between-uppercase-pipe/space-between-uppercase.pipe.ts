import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "spaceBetweenUppercase" })
export class SpaceBetweenUppercase implements PipeTransform {
	constructor() {}
	transform(text: string) {
		if (!text) return;

		return text.replace(/([A-Z])([a-z])/g, " $1$2");
	}
}

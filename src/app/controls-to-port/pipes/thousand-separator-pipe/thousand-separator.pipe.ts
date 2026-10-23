import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "thousandSeparator" })
export class ThousandSeparatorPipe implements PipeTransform {
	constructor() {}
	transform(text: string) {
		if (!text) return;

		return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}
}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "trimCharacters",
})
export class TrimCharactersPipe implements PipeTransform {
	transform(text: string, length: number): any {
		if (!text) {
			return "";
		}

		if (!length) {
			return text;
		}

		if (text.length > length) {
			return text.substring(0, length - 1) + "...";
		} else {
			return text;
		}
	}
}

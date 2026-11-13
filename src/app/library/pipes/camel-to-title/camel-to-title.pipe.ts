import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "camelToTitle",
	standalone: true,
})
export class CamelToTitlePipe implements PipeTransform {
	public transform(text: string | null | undefined): string {
		if (!text) {
			return "";
		}

		return text.replace(/([A-Z]+)/g, " $1").replace(/^./, (str) => str.toUpperCase());
	}
}

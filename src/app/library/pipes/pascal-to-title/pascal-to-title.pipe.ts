import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "pascalToTitle",
	standalone: true,
})
export class PascalToTitlePipe implements PipeTransform {
	public transform(text: string | null | undefined): string {
		if (!text) {
			return "";
		}

		return text.replace(/\B([A-Z]+)/g, " $1").replace(/^./, (str) => str.toUpperCase());
	}
}

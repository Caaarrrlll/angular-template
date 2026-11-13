import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "thousandSeparator",
	standalone: true,
})
export class ThousandSeparatorPipe implements PipeTransform {
	public transform(text: string | number | null | undefined): string {
		if (!text) {
			return "";
		}

		return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}
}

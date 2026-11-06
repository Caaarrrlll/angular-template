import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "spaceBetweenUppercase",
	standalone: true,
})
export class SpaceBetweenUppercasePipe implements PipeTransform {
	public transform(text: string | null | undefined): string {
		if (!text) {
			return "";
		}

		return text.replace(/([A-Z])([a-z])/g, " $1$2");
	}
}

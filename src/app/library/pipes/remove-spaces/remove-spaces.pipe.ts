import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "removeSpaces",
	standalone: true,
})
export class RemoveSpacesPipe implements PipeTransform {
	public transform(text: string | null | undefined): string {
		if (!text) {
			return "";
		}

		return text.replace(/[\s,@#$%^&*()/]/g, "").toUpperCase();
	}
}

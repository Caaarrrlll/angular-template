import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "removeSpaces",
})
export class RemoveSpacesPipe implements PipeTransform {
	transform(text: string) {
		if (!text) return;

		return text.replace(/[\s,@#$%^&*()\/]/g, "").toUpperCase();
	}
}

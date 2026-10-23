import { DomSanitizer } from "@angular/platform-browser";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "searchMatch",
})
export class HighlightSearchMatchPipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) {}

	// If a piece of text on the page matches the string value of
	// the seach input then the text that matches is highlighted with css
	transform(value: string, args: any): any {
		if (!args) {
			return value;
		}

		const regex = new RegExp(args, "i");
		const match = value.match(regex);

		if (!match) {
			return value;
		}

		const indexOfMatch = value.indexOf(match[0]);
		const endIndexOfMatch = value.indexOf(match[0][match[0].length - 1], indexOfMatch);

		let addSpaceBefore = false;
		let addSpaceAfter = false;
		// If there is a space before or after the orginal matched text it adds that space back
		if (value[indexOfMatch] === " " || value[indexOfMatch - 1] === " ") {
			addSpaceBefore = true;
		}
		if (value[endIndexOfMatch] === " " || value[endIndexOfMatch + 1] === " ") {
			addSpaceAfter = true;
		}

		const beforeHtml = addSpaceBefore ? "&nbsp;" : "";
		const afterHtml = addSpaceAfter ? "&nbsp;" : "";

		const replacedValue = value.replace(regex, `<span>${beforeHtml}</span><mark>${match[0]}</mark><span>${afterHtml}</span>`);

		return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
	}
}

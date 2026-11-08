import { inject, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeValue } from "@angular/platform-browser";

/**
 * If a piece of text on the page matches the string value of the search input,
 * the text that matches is wrapped in a `<mark>` tag so it can be highlighted
 * with css.
 *
 * @example
 *      {{ paragraph | searchMatch: searchTerm }}
 */
@Pipe({
	name: "searchMatch",
	standalone: true,
})
export class HighlightSearchMatchPipe implements PipeTransform {
	private readonly sanitizer = inject(DomSanitizer);

	public transform(value: string | undefined, args?: string): string | SafeValue {
		if (!args || !value) {
			return value ?? "";
		}

		const regex = new RegExp(args, "i");
		const match = value.match(regex);

		if (!match) {
			return value;
		}

		const indexOfMatch = value.indexOf(match[0]);
		const endIndexOfMatch = value.indexOf(match[0][match[0].length - 1], indexOfMatch);

		// If there is a space before or after the original matched text it adds that space back
		const addSpaceBefore = value[indexOfMatch] === " " || value[indexOfMatch - 1] === " ";
		const addSpaceAfter = value[endIndexOfMatch] === " " || value[endIndexOfMatch + 1] === " ";

		const beforeHtml = addSpaceBefore ? "&nbsp;" : "";
		const afterHtml = addSpaceAfter ? "&nbsp;" : "";

		const replacedValue = value.replace(regex, `<span>${beforeHtml}</span><mark>${match[0]}</mark><span>${afterHtml}</span>`);

		return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
	}
}

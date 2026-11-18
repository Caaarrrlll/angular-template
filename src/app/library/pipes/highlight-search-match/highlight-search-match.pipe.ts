import { inject, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeValue } from "@angular/platform-browser";

const HTML_ESCAPES: Record<string, string> = {
	"&": `&amp;`,
	"<": `&lt;`,
	">": `&gt;`,
	'"': `&quot;`,
	"'": `&#39;`,
};

/**
 * If a piece of text on the page matches the string value of the search input,
 * the text that matches is wrapped in a `<mark>` tag so it can be highlighted
 * with css.
 *
 * The search term is matched literally (case-insensitive, first match only) and every
 * part of the text is HTML-escaped before the `<mark>` is added, so the result is safe
 * to bind with `[innerHTML]` even when the text or the term is user-supplied.
 *
 * @example
 *      <span [innerHTML]="paragraph | searchMatch: searchTerm"></span>
 */
@Pipe({
	name: "searchMatch",
	standalone: true,
})
export class HighlightSearchMatchPipe implements PipeTransform {
	private readonly sanitizer = inject(DomSanitizer);

	public transform(value: string | undefined, args?: string): string | SafeValue {
		// The output is meant for [innerHTML], so text is escaped on every path, not only when there is a match.
		if (!args || !value) {
			return escapeHtml(value ?? ``);
		}

		const index = value.toLowerCase().indexOf(args.toLowerCase());
		if (index === -1) {
			return escapeHtml(value);
		}

		const before = escapeHtml(value.slice(0, index));
		const match = escapeHtml(value.slice(index, index + args.length));
		const after = escapeHtml(value.slice(index + args.length));

		// Keep a space that touches the match visible (e.g. inside flex layouts that collapse edge whitespace).
		const html = `${before.replace(/ $/, `&nbsp;`)}<mark>${match}</mark>${after.replace(/^ /, `&nbsp;`)}`;

		return this.sanitizer.bypassSecurityTrustHtml(html);
	}
}

function escapeHtml(text: string): string {
	return text.replace(/[&<>"']/g, (char: string): string => HTML_ESCAPES[char] ?? char);
}

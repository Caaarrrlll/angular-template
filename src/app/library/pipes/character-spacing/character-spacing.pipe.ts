import { Pipe, PipeTransform } from "@angular/core";

/**
 * Takes in a string like a bank account number or cell phone number and adds
 * blank spacing between the lowest common denominator (between 3 and 6) of the
 * length of the string. If a LCD cannot be found it will default to a spacing
 * of every 3 characters.
 *
 * @example
 *      {{ "502336455040" | characterSpacing }}
 * Outputs `502 336 455 040`.
 */
@Pipe({
	name: "characterSpacing",
	standalone: true,
})
export class CharacterSpacingPipe implements PipeTransform {
	public transform(text: string, startFromFront = false): string | undefined {
		if (!text) {
			return;
		}

		const divideBy = this.getSmallestDivisibleNumber(text.length);
		if (!startFromFront) {
			text = this.reverseString(text);
		}
		text = this.formatWithDivider(text, divideBy);
		if (!startFromFront) {
			text = this.reverseString(text);
		}

		return text;
	}

	private reverseString(text: string): string {
		let newString = "";
		for (let i = text.length - 1; i >= 0; i--) {
			newString += text[i];
		}
		return newString;
	}

	private getSmallestDivisibleNumber(strLength: number): number {
		for (let i = 3; i < 6; i++) {
			if (strLength % i === 0) {
				return i;
			}
		}
		return 3;
	}

	private formatWithDivider(text: string, divider: number): string {
		return text
			.replace(/[^\dA-Z]/g, "")
			.replace(new RegExp(`(.{${divider}})`, "g"), "$1 ")
			.trim();
	}
}

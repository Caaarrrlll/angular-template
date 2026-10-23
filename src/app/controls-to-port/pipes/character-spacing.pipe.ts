import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "characterSpacing" })
export class CharacterSpacingPipe implements PipeTransform {
	constructor() {}

	// This pipe takes in a string like a bank account number or cell phone
	// number and adds blank spacing between a the lowest common dinominator (between 3 and 6) of the length of the string
	// If a LCD cannot be found it will default to a spacing of every 3 characters
	// Input = '502336455040'
	// Output = '502 336 455 040'

	transform(text: string, startFromFront = false) {
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

	private reverseString(text: string) {
		let newString = "";
		for (let i = text.length - 1; i >= 0; i--) {
			newString += text[i];
		}
		return newString;
	}

	private getSmallestDivisibleNumber(strLength: number) {
		for (let i = 3; i < 6; i++) {
			if (strLength % i === 0) {
				return i;
			}
		}
		return 3;
	}

	private formatWithDivider(text: string, divider: number) {
		let str: string;
		switch (divider) {
			case 3:
				str = text
					.replace(/[^\dA-Z]/g, "")
					.replace(/(.{3})/g, "$1 ")
					.trim();
				break;
			case 4:
				str = text
					.replace(/[^\dA-Z]/g, "")
					.replace(/(.{4})/g, "$1 ")
					.trim();
				break;
			case 5:
				str = text
					.replace(/[^\dA-Z]/g, "")
					.replace(/(.{5})/g, "$1 ")
					.trim();
				break;
		}
		return str;
	}
}

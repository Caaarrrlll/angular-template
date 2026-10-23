import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "nameToInitials" })
export class NameToInitialsPipe implements PipeTransform {
	constructor() {}
	transform(value: string) {
		const fullName = value.split(" ");
		var initials = "";
		fullName.map((n) => (initials += n[0]));
		if (initials.length > 2) {
			initials = initials.slice(0, 2);
		}
		return initials.toUpperCase();
	}
}

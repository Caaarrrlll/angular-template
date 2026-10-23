import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "emailToInitials" })
export class EmailToInitialsPipe implements PipeTransform {
	constructor() {}
	transform(value: string) {
		var name = value.slice(0, value.indexOf("@"));
		var initials = name.charAt(0) + name.charAt(name.length - 1);
		return initials.toUpperCase();
	}
}

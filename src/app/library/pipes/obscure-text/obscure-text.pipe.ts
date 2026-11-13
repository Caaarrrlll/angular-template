import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "obscureText",
	standalone: true,
})
export class ObscureTextPipe implements PipeTransform {
	public transform(value: string | null | undefined, keepLast = 4): string {
		if (!value) {
			return "";
		}

		const regExp = new RegExp(`.(?=.{${keepLast}})`, "g");
		return value.replace(regExp, "*");
	}
}

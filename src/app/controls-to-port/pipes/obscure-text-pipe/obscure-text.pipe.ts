import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "obscureText",
})
export class ObscureTextPipe implements PipeTransform {
	transform(value: string, keepLast: number = 4): string {
		if (value) {
			const regExp = new RegExp(`.(?=.{${keepLast}})`, "g");
			return value.replace(regExp, "*");
		}
		return value;
	}
}

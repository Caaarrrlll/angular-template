import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "absolute",
})
export class AbsolutePipe implements PipeTransform {
	transform(value: number): number {
		return value < 0 ? -1 * value : value;
	}
}

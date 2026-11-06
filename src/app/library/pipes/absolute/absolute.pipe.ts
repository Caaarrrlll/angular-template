import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "absolute",
	standalone: true,
})
export class AbsolutePipe implements PipeTransform {
	public transform(value: number): number {
		return value < 0 ? -1 * value : value;
	}
}

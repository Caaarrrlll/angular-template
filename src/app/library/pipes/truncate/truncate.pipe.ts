import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "truncate",
	standalone: true,
})
export class TruncatePipe implements PipeTransform {
	public transform(text: string, size: number, trail = "..."): string {
		return text.length > size ? text.substring(0, size) + trail : text;
	}
}

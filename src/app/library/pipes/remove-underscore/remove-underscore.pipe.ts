import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "removeUnderscore",
	standalone: true,
})
export class RemoveUnderscorePipe implements PipeTransform {
	public transform(value: string | null | undefined): string {
		return value?.replace(/_/g, " ") ?? "";
	}
}

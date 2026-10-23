import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "removeDomain",
})
export class RemoveEmailDomainPipe implements PipeTransform {
	// This pipe takes in a string email address and removes the @ along with the domain from the string
	// Input = pietk@webuycars.co.za
	// Output = pietk

	transform(value: string): string {
		if (!value) {
			return;
		}
		const values = value.split("@");
		return values[0];
	}
}

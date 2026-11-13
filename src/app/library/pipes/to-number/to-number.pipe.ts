import { Pipe, PipeTransform } from "@angular/core";

/**
 * Converts a value to a number; falls back to the original value when the
 * conversion yields a falsy number.
 *
 * @example
 *      {{ "12" | toNumber }}
 */
@Pipe({
	name: "toNumber",
	standalone: true,
})
export class ToNumberPipe implements PipeTransform {
	public transform(value: unknown): unknown {
		return Number(value) ?? value;
	}
}

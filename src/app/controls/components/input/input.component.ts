import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/** Floating-label wrapper around a projected native `<input>`; give that input the same `id` as `inputId`. */
@Component({
	selector: "app-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
	public readonly label = input<string | undefined>();
	/** Id of the projected input the label points at; use a page-unique value (the default keeps the old fixed `search`). */
	public readonly inputId = input<string>(`search`);
}

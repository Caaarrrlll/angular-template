import { ChangeDetectionStrategy, Component, input, InputSignal } from "@angular/core";
import { RouterLink } from "@angular/router";

/** Shared shell for a sandbox family page: back link, title, description and projected demos. */
@Component({
	selector: "app-sandbox-page",
	templateUrl: "./sandbox-page.component.html",
	styleUrls: ["./sandbox-page.component.scss"],
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPageComponent {
	public readonly title: InputSignal<string> = input.required<string>();
	public readonly description: InputSignal<string> = input<string>(``);
}

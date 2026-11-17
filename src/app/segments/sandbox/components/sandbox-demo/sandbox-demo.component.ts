import { ChangeDetectionStrategy, Component, input, InputSignal } from "@angular/core";

/** One demo block inside a sandbox family page, with an optional visible output log. */
@Component({
	selector: "app-sandbox-demo",
	templateUrl: "./sandbox-demo.component.html",
	styleUrls: ["./sandbox-demo.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxDemoComponent {
	public readonly title: InputSignal<string> = input.required<string>();
	public readonly description: InputSignal<string> = input<string>(``);
	/** Output log entries; when undefined the log panel is hidden. */
	public readonly log: InputSignal<string[] | undefined> = input<string[] | undefined>(undefined);
}

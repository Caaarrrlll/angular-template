import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
	selector: "app-loader",
	templateUrl: "./loader.component.html",
	styleUrls: ["./loader.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
	public readonly fontSize = input<number | undefined>();
}

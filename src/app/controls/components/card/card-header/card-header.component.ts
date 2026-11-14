import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
	selector: "app-card-header",
	templateUrl: "./card-header.component.html",
	styleUrls: ["./card-header.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeaderComponent {
	public readonly color = input<string | undefined>();
}

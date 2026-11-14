import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
	selector: "app-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
	public readonly color = input<string | undefined>();
	public readonly showSidebar = input<boolean>(false);
	public readonly marginRight = input<boolean>(false);
	public readonly selected = input<boolean>(false);
	public readonly fillHeight = input<boolean>(false);
}

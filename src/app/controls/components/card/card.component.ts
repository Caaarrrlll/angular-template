import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
	selector: "app-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
	@Input() public color?: string;
	@Input() public showSidebar: boolean = false;
	@Input() public marginRight: boolean = false;
	@Input() public selected: boolean = false;
	@Input() public fillHeight: boolean = false;
}

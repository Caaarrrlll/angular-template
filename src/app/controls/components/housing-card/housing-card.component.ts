import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "app-housing-card",
	templateUrl: "./housing-card.component.html",
	styleUrls: ["./housing-card.component.scss"],
	imports: [MatCardModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HousingCardComponent {
	public readonly title = input.required<string>();
	public readonly height = input.required<string>();
	public readonly contentHeight = computed((): string => `${String(parseInt(this.height(), 10) - 50)}px`);
}

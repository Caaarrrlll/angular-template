import { AfterContentInit, Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "app-housing-card",
	templateUrl: "./housing-card.component.html",
	styleUrls: ["./housing-card.component.scss"],
	imports: [MatCardModule],
})
export class HousingCardComponent implements AfterContentInit {
	@Input({ required: true }) public title!: string;
	@Input({ required: true }) public height!: string;

	public contentHeight: string = "";

	public ngAfterContentInit(): void {
		this.contentHeight = parseInt(this.height, 10) - 50 + "px";
	}
}

import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
	selector: "app-landing",
	templateUrl: "./landing.component.html",
	styleUrls: ["./landing.component.scss"],
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: true,
	imports: [CommonModule],
})
export class LandingComponent {}

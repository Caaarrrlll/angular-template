import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-landing",
	templateUrl: "./landing.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}

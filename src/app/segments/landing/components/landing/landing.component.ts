import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-landing",
	templateUrl: "./landing.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- template-only page component: intentionally empty
export class LandingComponent {}

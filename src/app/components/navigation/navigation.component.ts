import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Component({
	selector: "app-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.scss"],
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: false,
})
export class NavigationComponent {
	isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
		map((result) => result.matches),
		shareReplay(),
	);

	constructor(private breakpointObserver: BreakpointObserver) {}
}

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { environment } from "../../../../environments/environment";

@Component({
	selector: "app-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.scss"],
	standalone: true,
	imports: [AsyncPipe, MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, RouterLink],
})
export class NavigationComponent {
	private readonly breakpointObserver = inject(BreakpointObserver);

	protected readonly showSandbox: boolean = environment.environmentName !== "production";

	isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
		map((result) => result.matches),
		shareReplay(),
	);
}

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "@shared/components/navigation/navigation.component";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	imports: [RouterOutlet, NavigationComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

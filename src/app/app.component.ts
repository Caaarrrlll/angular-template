import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "./controls/components/navigation/navigation.component";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	standalone: true,
	imports: [RouterOutlet, NavigationComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	title = "angular-template";
}

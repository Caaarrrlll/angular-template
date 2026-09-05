import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "./components/navigation/navigation.component";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: true,
	imports: [RouterOutlet, NavigationComponent],
})
export class AppComponent {
	title = "angular-template";
}

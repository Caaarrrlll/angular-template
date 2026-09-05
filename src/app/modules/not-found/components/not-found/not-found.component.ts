import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-not-found",
	templateUrl: "./not-found.component.html",
	styleUrls: ["./not-found.component.scss"],
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: true,
	imports: [CommonModule, MatButtonModule, RouterLink],
})
export class NotFoundComponent {}

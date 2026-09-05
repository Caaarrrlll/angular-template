import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
	selector: "app-contact",
	templateUrl: "./contact.component.html",
	styleUrls: ["./contact.component.scss"],
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: true,
	imports: [CommonModule],
})
export class ContactComponent {}

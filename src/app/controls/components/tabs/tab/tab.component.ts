import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
	selector: "app-tab",
	templateUrl: "./tab.component.html",
	standalone: true,
	imports: [CommonModule],
})
export class TabComponent {
	@Input({ required: true }) public title!: string;
	@Input() public active = false;
	@Input() public completed = false;
	@Input() public isConfig = false;
	@Input() public stepControl?: FormGroup;
}

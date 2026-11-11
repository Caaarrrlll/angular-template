import { ChangeDetectionStrategy, Component, Input, SkipSelf, ViewEncapsulation } from "@angular/core";
import { ControlContainer } from "@angular/forms";
import { ClickElsewhereDirective } from "@shared/directives/click-elsewhere.directive";

@Component({
	selector: "app-select",
	templateUrl: "./select.component.html",
	styleUrls: ["./select.component.scss"],
	imports: [ClickElsewhereDirective],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	viewProviders: [
		{
			provide: ControlContainer,
			useFactory: (container: ControlContainer): ControlContainer => container,
			deps: [[new SkipSelf(), ControlContainer]],
		},
	],
})
export class SelectComponent {
	@Input() public placeholder: string = "Select Option";

	public active: boolean = false;

	public toggleDropdown(): void {
		this.active = !this.active;
	}

	public closeDropdown(): void {
		if (this.active) {
			this.active = false;
		}
	}
}

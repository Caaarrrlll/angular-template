import { Directive, HostListener, inject, Input } from "@angular/core";
import { TabsComponent } from "@shared/components/tabs/tabs.component";

@Directive({
	selector: "button[custNextTabButton]",
	standalone: false,
})
export class TabNextButtonDirective {
	private readonly tabsComponent = inject(TabsComponent);

	@Input() required: boolean = false;

	@HostListener("click", ["$event"])
	onNextClick() {
		const tabs = this.tabsComponent.tabs.toArray();
		const selectedIndex = tabs.map((t) => t.active).indexOf(true);

		if (this.required == false) {
			tabs[selectedIndex].completed = true;
		}

		if (tabs[selectedIndex].stepControl) {
			const form = tabs[selectedIndex].stepControl;
			Object.keys(form.controls).forEach((field) => {
				const control = form.get(field);
				control?.markAsTouched({ onlySelf: true });
			});
		}
		if (tabs[selectedIndex].completed || tabs[selectedIndex].isConfig) {
			tabs[selectedIndex].active = false;
			if (!tabs[selectedIndex + 1]) {
				return;
			} else {
				tabs[selectedIndex + 1].active = true;
			}
		}
	}
}

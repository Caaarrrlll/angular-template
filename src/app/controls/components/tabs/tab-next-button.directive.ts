import { Directive, input, inject } from "@angular/core";
import { TabsComponent } from "./tabs.component";

@Directive({
	selector: "button[appNextTabButton]",
	host: {
		"(click)": "onNextClick()",
	},
})
export class TabNextButtonDirective {
	private readonly tabsComponent = inject(TabsComponent);

	public readonly required = input<boolean>(false);

	onNextClick(): void {
		const tabs = this.tabsComponent.tabs.toArray();
		const selectedIndex = this.tabsComponent.activeIndex();
		if (selectedIndex < 0) {
			return;
		}
		const current = tabs[selectedIndex];

		if (!this.required()) {
			current.completed.set(true);
		}

		const form = current.stepControl();
		if (form) {
			Object.keys(form.controls).forEach((field) => {
				const control = form.get(field);
				control?.markAsTouched({ onlySelf: true });
			});
		}
		if (current.completed() || current.isConfig()) {
			// goTo() ignores out-of-range targets, so Next on the last step stays put (step is still marked completed).
			this.tabsComponent.goTo(selectedIndex + 1);
		}
	}
}

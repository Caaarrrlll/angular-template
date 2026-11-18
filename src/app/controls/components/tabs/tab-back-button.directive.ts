import { Directive, inject } from "@angular/core";
import { TabsComponent } from "./tabs.component";

@Directive({
	selector: "button[appBackTabButton]",
	host: {
		"(click)": "onBackClick()",
	},
})
export class TabBackButtonDirective {
	private readonly tabsComponent = inject(TabsComponent);

	onBackClick(): void {
		// goTo() ignores out-of-range targets, so Back on the first step stays put.
		this.tabsComponent.goTo(this.tabsComponent.activeIndex() - 1);
	}
}

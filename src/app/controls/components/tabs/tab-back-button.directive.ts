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
		const tabs = this.tabsComponent.tabs.toArray();
		const selectedIndex = tabs.map((tab) => tab.active()).indexOf(true);
		tabs[selectedIndex].active.set(false);
		if (!tabs[selectedIndex - 1]) {
			return;
		} else {
			tabs[selectedIndex - 1].active.set(true);
		}
	}
}

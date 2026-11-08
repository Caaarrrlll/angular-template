import { Directive, HostListener, inject } from "@angular/core";
import { TabsComponent } from "./tabs.component";

@Directive({
	selector: "button[custBackTabButton]",
	standalone: true,
})
export class TabBackButtonDirective {
	private readonly tabsComponent = inject(TabsComponent);

	@HostListener("click")
	onBackClick(): void {
		const tabs = this.tabsComponent.tabs.toArray();
		const selectedIndex = tabs.map((tab) => tab.active).indexOf(true);
		tabs[selectedIndex].active = false;
		if (!tabs[selectedIndex - 1]) {
			return;
		} else {
			tabs[selectedIndex - 1].active = true;
		}
	}
}

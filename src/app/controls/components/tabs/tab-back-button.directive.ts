import { Directive, HostListener, inject } from "@angular/core";
import { TabsComponent } from "@shared/components/tabs/tabs.component";

@Directive({
	selector: "button[custBackTabButton]",
	standalone: false,
})
export class TabBackButtonDirective {
	private readonly tabsComponent = inject(TabsComponent);

	@HostListener("click", ["$event"])
	onBackClick() {
		const tabs = this.tabsComponent.tabs.toArray();
		const selectedIndex = tabs.map((t) => t.active).indexOf(true);
		tabs[selectedIndex].active = false;
		if (!tabs[selectedIndex - 1]) {
			return;
		} else {
			tabs[selectedIndex - 1].active = true;
		}
	}
}

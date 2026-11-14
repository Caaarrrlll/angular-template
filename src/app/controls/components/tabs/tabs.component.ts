import { AfterContentInit, Component, ContentChildren, QueryList, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TabComponent } from "./tab/tab.component";

@Component({
	selector: "app-tabs",
	templateUrl: "./tabs.component.html",
	styleUrls: ["./tabs.component.scss"],
	imports: [CommonModule, MatIconModule],
})
export class TabsComponent implements AfterContentInit {
	@ContentChildren(TabComponent, { descendants: true }) public tabs!: QueryList<TabComponent>;
	public readonly linear = input<boolean>(false);
	public readonly tabSelectedEvent = output<number>();

	public ngAfterContentInit(): void {
		const activeTabs = this.tabs.filter((tab) => tab.active());
		if (activeTabs.length === 0) {
			this.selectTab(this.tabs.first);
		}
	}

	public selectTab(tab: TabComponent): void {
		const tabs = this.tabs.toArray();
		const selectedIndex = tabs.map((t) => t.title()).indexOf(tab.title());
		this.tabSelectedEvent.emit(selectedIndex);
		if (this.linear()) {
			if (selectedIndex > 0) {
				if (tabs[selectedIndex - 1].completed() === false) {
					return;
				}
				for (const t of tabs) {
					t.active.set(false);
				}
				tabs[selectedIndex].active.set(true);
				return;
			}
			for (const t of tabs) {
				t.active.set(false);
			}
			tabs[0].active.set(true);
			return;
		}
		for (const t of tabs) {
			t.active.set(false);
		}
		tab.active.set(true);
	}

	public nextTab(): void {
		const tabs = this.tabs.toArray();
		const selectedIndex = tabs.map((t) => t.active()).indexOf(true);

		if (tabs[selectedIndex].stepControl()) {
			const form = tabs[selectedIndex].stepControl();
			Object.keys(form!.controls).forEach((field) => {
				const control = form!.get(field);
				control?.markAsTouched({ onlySelf: true });
			});
		}

		if (tabs[selectedIndex].completed()) {
			tabs[selectedIndex].active.set(false);
			if (!tabs[selectedIndex + 1]) {
				return;
			} else {
				tabs[selectedIndex + 1].active.set(true);
			}
		}
	}

	public resetTabs(): void {
		const tabs = this.tabs.toArray();
		for (const t of tabs) {
			t.active.set(false);
		}
		tabs[0].active.set(true);
	}
}

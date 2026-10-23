import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-tabs",
	templateUrl: "./tabs.component.html",
	styleUrls: ["./tabs.component.scss"],
	standalone: true,
	imports: [CommonModule, MatIconModule],
})
export class TabsComponent implements AfterContentInit {
	@ContentChildren(TabComponent, { descendants: true }) tabs: QueryList<TabComponent>;
	@Input() linear = false;
	@Output() tabSelectedEvent = new EventEmitter<number>();

	ngAfterContentInit() {
		const activeTabs = this.tabs.filter((tab) => tab.active);
		if (activeTabs.length === 0) {
			this.selectTab(this.tabs.first);
		}
	}

	selectTab(tab: TabComponent) {
		const tabs = this.tabs.toArray();
		// const selectedIndex = tabs.map((t) => t.active).indexOf(true);
		const selectedIndex = tabs.map((t) => t.title).indexOf(tab.title);
		this.tabSelectedEvent.emit(selectedIndex);
		if (this.linear) {
			if (selectedIndex > 0) {
				// tabs[selectedIndex].active = true;
				if (tabs[selectedIndex - 1].completed === false) {
					return;
				}
				for (const t of tabs) {
					t.active = false;
				}
				tabs[selectedIndex].active = true;
				return;
			}
			for (const t of tabs) {
				t.active = false;
			}
			tabs[0].active = true;
			return;
		}
		for (const t of tabs) {
			t.active = false;
		}
		tab.active = true;
	}

	public nextTab() {
		const tabs = this.tabs.toArray();
		const selectedIndex = tabs.map((t) => t.active).indexOf(true);

		if (tabs[selectedIndex].stepControl) {
			const form = tabs[selectedIndex].stepControl;
			Object.keys(form.controls).forEach((field) => {
				const control = form.get(field);
				control.markAsTouched({ onlySelf: true });
			});
		}

		if (tabs[selectedIndex].completed) {
			tabs[selectedIndex].active = false;
			if (!tabs[selectedIndex + 1]) {
				return;
			} else {
				tabs[selectedIndex + 1].active = true;
			}
		}
	}

	resetTabs() {
		const tabs = this.tabs.toArray();
		for (const t of tabs) {
			t.active = false;
		}
		tabs[0].active = true;
	}
}

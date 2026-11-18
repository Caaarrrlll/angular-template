import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList, input, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TabComponent } from "./tab/tab.component";

@Component({
	selector: "app-tabs",
	templateUrl: "./tabs.component.html",
	styleUrls: ["./tabs.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
				if (!tabs[selectedIndex - 1].completed()) {
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
		const selectedIndex = this.activeIndex();
		if (selectedIndex < 0) {
			return;
		}
		const current: TabComponent = tabs[selectedIndex];

		const form = current.stepControl();
		if (form) {
			Object.keys(form.controls).forEach((field) => {
				const control = form.get(field);
				control?.markAsTouched({ onlySelf: true });
			});
		}

		if (current.completed()) {
			this.goTo(selectedIndex + 1);
		}
	}

	/** Index of the active step, or -1 when none is active. */
	public activeIndex(): number {
		return this.tabs.toArray().findIndex((tab: TabComponent): boolean => tab.active());
	}

	/**
	 * Activates the step at `index`. Out-of-range targets are ignored, so Back on the first step and Next on the
	 * last step keep the current step (AUD-17: the current step used to be deactivated first, blanking the wizard).
	 */
	public goTo(index: number): boolean {
		const tabs = this.tabs.toArray();
		// Explicit range check (not `.at()`, which would wrap -1 to the last step).
		if (index < 0 || index >= tabs.length) {
			return false;
		}
		for (const t of tabs) {
			t.active.set(false);
		}
		tabs[index].active.set(true);
		return true;
	}

	/** Back to the first step and clear every step's `completed` flag (AUD-17: completion used to survive a reset). */
	public resetTabs(): void {
		for (const t of this.tabs.toArray()) {
			t.completed.set(false);
		}
		this.goTo(0);
	}
}

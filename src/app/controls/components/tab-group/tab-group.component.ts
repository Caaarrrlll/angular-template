import { Component, WritableSignal, computed, effect, input, output, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { CustTab, CustTabConfig } from "./tab-group.interface";

@Component({
	selector: "app-tab-group",
	templateUrl: "./tab-group.component.html",
	styleUrls: ["./tab-group.component.scss"],
	imports: [MatTabsModule, MatIconModule],
})
export class TabGroupComponent {
	public readonly activeTab = input<number | undefined>();
	public readonly tabList = input.required<CustTabConfig>();
	public readonly tabClick = output<unknown>();

	public hideContent: WritableSignal<boolean> = signal(false);
	public tabToUse = signal(0);

	public readonly buttonSpace: number = 50;
	public readonly offset: number[] = [1, 1, 12, 18, 24, 32, 42, 48, 54, 68, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 162];

	public readonly matTabGroupConfig = computed((): Record<string, string> => {
		const tabList: CustTabConfig = this.tabList();
		const config: Record<string, string> = {
			"--mat-tab-radius": tabList.tabRadius ?? (tabList.tabType === "horizontal" ? "8px 8px 0px 0px" : "8px 0px 0px 8px"),
			"--tabwidth": tabList.tabwidth ?? "200px",
			"--mat-tab-min-width": tabList.matTabMinWidth ?? "200px",
			"--underline-color": tabList.tabType === "horizontal" ? "#EF6C00" : "#fff",
			"--mat-tab-header-background-color": tabList.matTabHeaderBackgroundColor ?? "#fff",
			"--mat-tab-header-right-background-color": tabList.matTabHeaderRightBackgroundColor ?? (tabList.tabType === "horizontal" ? "#fff" : "#293640"),
			"--mat-tab-header-right-width": "2px",
			"--tab-label-background-color": tabList.tabLabelBackgroundColor ?? "#fff",
			"--tab-label-color": tabList.tabLabelColor ?? "#000",
			"--tab-label-hover-color": tabList.tabLabelHoverColor ?? "#F2F2F2",
			"--mat-tab-label-text-align": tabList.matTabLabelTextAlign ?? "center",
			"--mat-tab-label-bottom-padding": tabList.matTabLabelBottomPadding ?? "0px",
			"--mat-tab-lable-default-background-color": tabList.matTabLableDefaultBackgroundColor ?? "#fff",
		};

		tabList.tab.forEach((tab: CustTab, count: number): void => {
			config[`--margin${count + 1}`] = "10px";
			if (tabList.tabType === "vertical" && count > 0 && tabList.tab[count - 1].isProcess !== tab.isProcess) {
				config[`--margin${count}`] = "30px";
			}
		});

		return config;
	});

	constructor() {
		effect(() => {
			if (this.hideContent()) {
				this.hideContent.set(false);
			}
		});

		effect(() => {
			const activeTab: number | undefined = this.activeTab();
			this.tabToUse.set(activeTab ?? 0);
			this.hideContent.set(true);
		});
	}

	public tabButtonClick(event: MatTabChangeEvent): void {
		this.tabClick.emit(event.index);
	}
}

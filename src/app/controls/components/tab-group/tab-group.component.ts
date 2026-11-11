import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, WritableSignal, effect, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { CustTab, CustTabConfig } from "./tab-group.interface";

@Component({
	selector: "app-tab-group",
	templateUrl: "./tab-group.component.html",
	styleUrls: ["./tab-group.component.scss"],
	imports: [MatTabsModule, MatIconModule],
})
export class TabGroupComponent implements OnChanges, AfterContentInit {
	@Input() public activeTab?: number;
	@Input({ required: true }) public tabList!: CustTabConfig;
	@Input() public tabUpdate?: number;
	@Output() public tabClick: EventEmitter<unknown> = new EventEmitter<unknown>();

	public hideContent: WritableSignal<boolean> = signal(false);
	public tabToUse: number = 0;
	public matTabGroupConfig: Record<string, string> = {};

	public readonly buttonSpace: number = 50;
	public readonly offset: number[] = [1, 1, 12, 18, 24, 32, 42, 48, 54, 68, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 162];

	constructor() {
		effect(() => {
			if (this.hideContent()) {
				this.hideContent.set(false);
			}
		});
	}

	public ngAfterContentInit(): void {
		this.buildTabGroupConfig();
		this.tabToUse = this.activeTab ?? 0;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["activeTab"]) {
			this.tabToUse = changes["activeTab"].currentValue;
			this.hideContent.set(true);
		}

		if (changes["tabUpdate"]) {
			this.buildTabGroupConfig();
		}
	}

	public tabButtonClick(event: MatTabChangeEvent): void {
		this.tabClick.emit(event.index);
	}

	private buildTabGroupConfig(): void {
		this.matTabGroupConfig = {
			"--mat-tab-radius": this.tabList.tabRadius ?? (this.tabList.tabType === "horizontal" ? "8px 8px 0px 0px" : "8px 0px 0px 8px"),
			"--tabwidth": this.tabList.tabwidth ?? "200px",
			"--mat-tab-min-width": this.tabList.matTabMinWidth ?? "200px",
			"--underline-color": this.tabList.tabType === "horizontal" ? "#EF6C00" : "#fff",
		};

		this.setMatLabels();
		this.setMatTabHeader();
		this.addMargins();
	}

	private setMatTabHeader(): void {
		this.matTabGroupConfig["--mat-tab-header-background-color"] = this.tabList.matTabHeaderBackgroundColor ?? "#fff";
		this.matTabGroupConfig["--mat-tab-header-right-background-color"] = this.tabList.matTabHeaderRightBackgroundColor ?? (this.tabList.tabType === "horizontal" ? "#fff" : "#293640");
		this.matTabGroupConfig["--mat-tab-header-right-width"] = "2px";
	}

	private setMatLabels(): void {
		this.matTabGroupConfig["--tab-label-background-color"] = this.tabList.tabLabelBackgroundColor ?? "#fff";
		this.matTabGroupConfig["--tab-label-color"] = this.tabList.tabLabelColor ?? "#000";
		this.matTabGroupConfig["--tab-label-hover-color"] = this.tabList.tabLabelHoverColor ?? "#F2F2F2";
		this.matTabGroupConfig["--mat-tab-label-text-align"] = this.tabList.matTabLabelTextAlign ?? "center";
		this.matTabGroupConfig["--mat-tab-label-bottom-padding"] = this.tabList.matTabLabelBottomPadding ?? "0px";
		this.matTabGroupConfig["--mat-tab-lable-default-background-color"] = this.tabList.matTabLableDefaultBackgroundColor ?? "#fff";
	}

	private addMargins(): void {
		this.tabList.tab.forEach((tab: CustTab, count: number): void => {
			this.matTabGroupConfig[`--margin${count + 1}`] = "10px";
			if (this.tabList.tabType === "vertical" && count > 0 && this.tabList.tab[count - 1].isProcess !== tab.isProcess) {
				this.matTabGroupConfig[`--margin${count}`] = "30px";
			}
		});
	}
}

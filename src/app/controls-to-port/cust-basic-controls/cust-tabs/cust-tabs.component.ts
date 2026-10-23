import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { delay, of } from "rxjs";
import { _CustTabInterface } from "./cust-tabs.interface";

@Component({
	selector: "cust-tabs-v2",
	templateUrl: "./cust-tabs.component.html",
	styleUrls: ["./cust-tabs.component.scss"],
})
export class CustTabsComponent implements OnChanges, AfterContentInit {
	@Input() title: string;
	@Input() activeTab: number;
	@Input() tabList: _CustTabInterface;
	@Input() tabUpdate?: number;
	@Output() tabClick: EventEmitter<unknown> = new EventEmitter<unknown>();
	hideContent: boolean = false;
	buttonSpace: number = 50;
	offset: number[] = [1, 1, 12, 18, 24, 32, 42, 48, 54, 68, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 162];
	matTabGroupConfig: unknown;
	tabToUse: number = 0;

	constructor(public MatChipsModule: MatChipsModule) {}

	ngAfterContentInit(): void {
		this.initMatTabGroupConfig();
		this.addMargins();
		this.tabToUse = this.activeTab;
	}

	initMatTabGroupConfig(): void {
		this.matTabGroupConfig = {
			"--mat-tab-radius": this.tabList.tabRadius ? this.tabList.tabRadius : this.tabList.tabType == "horizontal" ? "8px 8px 0px 0px" : "8px 0px 0px 8px",
			"--tabwidth": this.tabList.tabwidth ? this.tabList.tabwidth : "200px",
			"--mat-tab-min-width": this.tabList.matTabMinWidth ? this.tabList.matTabMinWidth : "200px",
			"--underline-color": this.tabList.tabType == "horizontal" ? "#EF6C00" : "#fff",
		};

		this.setMatLabels();
		this.setMatTabHeader();
	}

	setMatTabHeader(): void {
		this.matTabGroupConfig["--mat-tab-header-background-color"] = this.tabList.matTabHeaderBackgroundColor ? this.tabList.matTabHeaderBackgroundColor : "#fff";
		this.matTabGroupConfig["--mat-tab-header-right-background-color"] = this.tabList.matTabHeaderRightBackgroundColor
			? this.tabList.matTabHeaderRightBackgroundColor
			: this.tabList.tabType == "horizontal"
			? "#fff"
			: "#293640";
		this.matTabGroupConfig["--mat-tab-header-right-width"] = "2px";
	}

	setMatLabels(): void {
		this.matTabGroupConfig["--tab-label-background-color"] = this.tabList.tabLabelBackgroundColor ? this.tabList.tabLabelBackgroundColor : "#fff";
		this.matTabGroupConfig["--tab-label-color"] = this.tabList.tabLabelColor ? this.tabList.tabLabelColor : "#000";
		this.matTabGroupConfig["--tab-label-hover-color"] = this.tabList.tabLabelHoverColor ? this.tabList.tabLabelHoverColor : "#F2F2F2";
		this.matTabGroupConfig["--mat-tab-label-text-align"] = this.tabList.matTabLabelTextAlign ? this.tabList.matTabLabelTextAlign : "center";
		this.matTabGroupConfig["--mat-tab-label-bottom-padding"] = this.tabList.matTabLabelBottomPadding ? this.tabList.matTabLabelBottomPadding : "0px";
		this.matTabGroupConfig["--mat-tab-lable-default-background-color"] = this.tabList.matTabLableDefaultBackgroundColor
			? this.tabList.matTabLableDefaultBackgroundColor
			: "#fff";
	}

	addMargins(): void {
		let count: number = 0;
		this.tabList.tab.map((tab) => {
			this.matTabGroupConfig["--margin" + (count + 1).toString()] = "10px";
			if (this.tabList.tabType == "vertical" && count > 0) {
				if (this.tabList.tab[count - 1].isProcess != tab.isProcess) {
					this.matTabGroupConfig["--margin" + count.toString()] = "30px";
				}
			}
			count++;
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["activeTab"]) {
			this.tabToUse = changes["activeTab"].currentValue;
			this.hideContent = true;
			of([])
				.pipe(delay(100))
				.subscribe(() => {
					this.hideContent = false;
				});
		}

		if (changes["tabUpdate"]) {
			this.ngAfterContentInit();
		}
	}

	tabButtonClick(event: Event): void {
		this.tabClick.emit(event["index"]);
	}
}

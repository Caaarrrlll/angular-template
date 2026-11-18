import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, Signal, TemplateRef, ViewEncapsulation, WritableSignal, computed, contentChildren, input, linkedSignal, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { TabGroupContentDirective } from "./tab-group-content.directive";
import { CustTab, CustTabConfig } from "./tab-group.interface";

@Component({
	selector: "app-tab-group",
	templateUrl: "./tab-group.component.html",
	styleUrls: ["./tab-group.component.scss"],
	imports: [MatTabsModule, MatIconModule, NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	// The stylesheet has to reach Material's tab internals (vertical layout, label shape). Instead of ::ng-deep
	// (capped by the standing policy) every rule is scoped under `app-tab-group` and own classes use a `tab-group__` prefix.
	encapsulation: ViewEncapsulation.None,
})
export class TabGroupComponent {
	public readonly activeTab = input<number | undefined>();
	public readonly tabList = input.required<CustTabConfig>();
	public readonly tabClick = output<unknown>();

	/** Selected tab: reset from `activeTab`, then follows clicks (AUD-16: content used to follow the input only). */
	public readonly tabToUse: WritableSignal<number> = linkedSignal((): number => this.activeTab() ?? 0);

	/** Per-tab content templates, keyed by `CustTab.classSelect`. */
	private readonly contentTemplates = contentChildren(TabGroupContentDirective);
	public readonly templatesByKey: Signal<Map<string, TemplateRef<unknown>>> = computed(
		(): Map<string, TemplateRef<unknown>> =>
			new Map(this.contentTemplates().map((content: TabGroupContentDirective): [string, TemplateRef<unknown>] => [content.key(), content.templateRef])),
	);

	/** CSS variables for the values the consumer supplied; defaults live in the stylesheet (token-backed fallbacks). */
	public readonly matTabGroupConfig = computed((): Record<string, string> => {
		const tabList: CustTabConfig = this.tabList();
		const config: Record<string, string> = {};
		const set = (name: string, value: string | undefined): void => {
			if (value) {
				config[name] = value;
			}
		};

		set(`--tab-radius`, tabList.tabRadius);
		set(`--tab-width`, tabList.tabwidth);
		set(`--tab-min-width`, tabList.matTabMinWidth);
		set(`--tab-label-color`, tabList.tabLabelColor);
		set(`--tab-label-background-color`, tabList.tabLabelBackgroundColor);
		set(`--tab-label-default-background-color`, tabList.matTabLableDefaultBackgroundColor);
		set(`--tab-label-hover-color`, tabList.tabLabelHoverColor);
		set(`--tab-label-text-align`, tabList.matTabLabelTextAlign);
		set(`--tab-label-bottom-padding`, tabList.matTabLabelBottomPadding);
		set(`--tab-header-background-color`, tabList.matTabHeaderBackgroundColor);
		set(`--tab-header-right-background-color`, tabList.matTabHeaderRightBackgroundColor);
		set(`--mat-tab-label-text-size`, tabList.fontSize);

		tabList.tab.forEach((tab: CustTab, count: number): void => {
			if (tabList.tabType === `vertical` && count > 0 && tabList.tab[count - 1].isProcess !== tab.isProcess) {
				// Wider gap after the last process step, with a divider line drawn in it (nth-child is 1-based).
				config[`--tab-margin${String(count)}`] = `30px`;
				config[`--tab-divider${String(count + 1)}`] = `block`;
			}
		});

		return config;
	});

	public tabButtonClick(event: MatTabChangeEvent): void {
		this.tabClick.emit(event.index);
	}
}

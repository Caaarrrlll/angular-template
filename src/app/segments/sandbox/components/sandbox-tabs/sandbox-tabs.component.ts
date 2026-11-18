import { ChangeDetectionStrategy, Component, computed, Signal, signal, viewChild, WritableSignal } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { TabGroupComponent } from "@shared/components/tab-group/tab-group.component";
import { TabGroupContentDirective } from "@shared/components/tab-group/tab-group-content.directive";
import { CustTabConfig } from "@shared/components/tab-group/tab-group.interface";
import { TabComponent } from "@shared/components/tabs/tab/tab.component";
import { TabBackButtonDirective } from "@shared/components/tabs/tab-back-button.directive";
import { TabNextButtonDirective } from "@shared/components/tabs/tab-next-button.directive";
import { TabsComponent } from "@shared/components/tabs/tabs.component";

@Component({
	selector: "app-sandbox-tabs",
	templateUrl: "./sandbox-tabs.component.html",
	styleUrls: ["./sandbox-tabs.component.scss"],
	imports: [SandboxPageComponent, SandboxDemoComponent, TabGroupComponent, TabGroupContentDirective, TabsComponent, TabComponent, TabBackButtonDirective, TabNextButtonDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxTabsComponent {
	public readonly horizontalLog = new SandboxEventLog();
	public readonly verticalLog = new SandboxEventLog();
	public readonly wizardLog = new SandboxEventLog();

	public readonly horizontalTabs: CustTabConfig = {
		tabType: `horizontal`,
		tab: [
			{ tabName: `Overview`, index: 0, classSelect: `overview`, icon: `dashboard` },
			{ tabName: `Details`, index: 1, classSelect: `details`, icon: `info` },
			{ tabName: `History`, index: 2, classSelect: `history` },
		],
	};

	/** Process steps stay disabled until the previous step is completed (isProcess + canProgress). */
	public readonly completedSteps: WritableSignal<number> = signal<number>(0);
	public readonly verticalActive: WritableSignal<number> = signal<number>(0);

	public readonly verticalTabs: Signal<CustTabConfig> = computed((): CustTabConfig => ({
		tabType: `vertical`,
		tab: [
			{ tabName: `Applicant`, index: 0, classSelect: `applicant`, isProcess: true, canProgress: true },
			{ tabName: `Documents`, index: 1, classSelect: `documents`, isProcess: true, canProgress: this.completedSteps() >= 1 },
			{ tabName: `Review`, index: 2, classSelect: `review`, isProcess: true, canProgress: this.completedSteps() >= 2 },
			{ tabName: `Notes`, index: 3, classSelect: `notes`, icon: `notes` },
		],
	}));

	public readonly linear: WritableSignal<boolean> = signal<boolean>(true);
	public readonly agreed: WritableSignal<boolean> = signal<boolean>(false);

	private readonly wizard: Signal<TabsComponent> = viewChild.required(TabsComponent);

	public onHorizontalTabClick(index: unknown): void {
		this.horizontalLog.add(`tabClick: ${String(index)}`);
	}

	public onVerticalTabClick(index: unknown): void {
		this.verticalActive.set(Number(index));
		this.verticalLog.add(`tabClick: ${String(index)}`);
	}

	public completeStep(): void {
		this.completedSteps.update((steps: number): number => Math.min(steps + 1, 2));
		this.verticalLog.add(`step ${String(this.completedSteps())} completed`);
	}

	public resetSteps(): void {
		this.completedSteps.set(0);
		this.verticalActive.set(0);
	}

	public onWizardTabSelected(index: number): void {
		this.wizardLog.add(`tabSelectedEvent: ${String(index)}`);
	}

	public finishWizard(): void {
		this.wizardLog.add(`finished - resetTabs()`);
		this.agreed.set(false);
		this.wizard().resetTabs();
	}
}

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { ChipStatusComponent } from "@shared/components/chip-status/chip-status.component";
import { ChipsComponent } from "@shared/components/chips/chips.component";
import { KeyValueComponent } from "@shared/components/key-value/key-value/key-value.component";
import { KeyValueV2Component } from "@shared/components/key-value/key-value-v2/key-value-v2.component";
import { KeyValueV3Component } from "@shared/components/key-value/key-value-v3/key-value-v3.component";
import { CustChipInput, CustChipReturn, CustInputReturn } from "@shared/models/cust-basic-controls";
import { EmailToInitialsPipe } from "@shared/pipes/email-to-initials/email-to-initials.pipe";
import { FormatNullTextPipe } from "@shared/pipes/format-null/format-null.pipe";
import { NameToInitialsPipe } from "@shared/pipes/name-to-initials/name-to-initials.pipe";
import { OrdinalPipe } from "@shared/pipes/ordinal/ordinal.pipe";
import { TimeElapsedFormatPipe } from "@shared/pipes/time-elapsed/time-elapsed.pipe";
import { TruncatePipe } from "@shared/pipes/truncate/truncate.pipe";

interface _SandboxProfile {
	fullName: string;
	email: string;
	middleName: string | null;
	branchRank: number;
	bio: string;
	lastLogin: string;
}

interface _SandboxChipStatusSample {
	text: string;
	type: string;
}

@Component({
	selector: "app-sandbox-data-display",
	templateUrl: "./sandbox-data-display.component.html",
	styleUrls: ["./sandbox-data-display.component.scss"],
	imports: [
		SandboxPageComponent,
		SandboxDemoComponent,
		KeyValueComponent,
		KeyValueV2Component,
		KeyValueV3Component,
		ChipsComponent,
		ChipStatusComponent,
		FormatNullTextPipe,
		TruncatePipe,
		OrdinalPipe,
		NameToInitialsPipe,
		EmailToInitialsPipe,
		TimeElapsedFormatPipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxDataDisplayComponent {
	public readonly profile: _SandboxProfile = {
		fullName: `Thandi Grace Mokoena`,
		email: `thandi.mokoena@example.com`,
		middleName: null,
		branchRank: 3,
		bio: `Senior account manager covering the Pretoria East region, responsible for key retail clients and onboarding.`,
		lastLogin: `2026-01-15T09:30:00`,
	};

	public readonly keyValueLog = new SandboxEventLog();
	public readonly keyValueV2Log = new SandboxEventLog();
	public readonly keyValueV3Log = new SandboxEventLog();
	public readonly chipsLog = new SandboxEventLog();

	/** chips mutates `isToggle` and `mouseOver` on these objects, so they are plain mutable records. */
	public readonly filterChips: CustChipInput[] = [
		{ icon: `inbox`, display: `Open`, value: `open`, count: 12, disabled: false, mouseOver: false },
		{ icon: `schedule`, display: `Overdue`, value: `overdue`, count: 128, disabled: false, mouseOver: false, refresh: true },
		{ icon: `check_circle`, display: `Closed`, value: `closed`, count: 0, disabled: false, mouseOver: false, showZero: true, isToggle: false },
		{ icon: ``, display: `Mine only`, value: `mine`, count: 0, disabled: false, mouseOver: false, isToggle: false },
		{ icon: `block`, display: `Archived (disabled)`, value: `archived`, count: 3, disabled: true, mouseOver: false },
		{ icon: ``, display: `Hidden chip`, value: `hidden`, count: 0, disabled: false, mouseOver: false, hidden: true },
	];

	public readonly statusSamples: _SandboxChipStatusSample[] = [
		{ text: `Default`, type: `Default` },
		{ text: `Action`, type: `Action` },
		{ text: `Informative`, type: `Informative` },
		{ text: `Negative`, type: `Negative` },
		{ text: `Inactive`, type: `Inactive` },
		{ text: `In progress`, type: `Progress` },
		{ text: `New`, type: `New` },
		{ text: `Approved`, type: `Approved` },
		{ text: `Resolved`, type: `Resolved` },
		{ text: `Unknown type falls back`, type: `NotARealType` },
	];

	public onKeyValueEdit(field: string): void {
		this.keyValueLog.add(`edit: ${field}`);
	}

	public onKeyValueV2(output: string, field: string): void {
		this.keyValueV2Log.add(`${output}: ${field}`);
	}

	public onKeyValueV3(output: string, field: string): void {
		this.keyValueV3Log.add(`${output}: ${field}`);
	}

	public onChipChanged(event: CustChipReturn | CustInputReturn): void {
		const action: string = `action` in event ? event.action : `input`;
		this.chipsLog.add(`inputChanged: ${String(event.value)} (${action})`);
	}
}

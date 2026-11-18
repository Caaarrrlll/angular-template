import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { ButtonComponent } from "@shared/components/button/button/button.component";
import { FabButtonComponent } from "@shared/components/button/fab-button/fab-button.component";
import { ButtonToggleComponent } from "@shared/components/button-toggle/button-toggle.component";
import { ButtonToggleInput, ButtonToggleResponse } from "@shared/components/button-toggle/button-toggle.interface";
import { CustButtonIconSide, CustButtonInput, CustButtonType, CustInputReturn } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-sandbox-buttons",
	templateUrl: "./sandbox-buttons.component.html",
	styleUrls: ["./sandbox-buttons.component.scss"],
	imports: [SandboxPageComponent, SandboxDemoComponent, ButtonComponent, ButtonToggleComponent, FabButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxButtonsComponent {
	public readonly buttonLog = new SandboxEventLog();
	public readonly toggleLog = new SandboxEventLog();
	public readonly fabLog = new SandboxEventLog();

	public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
	public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
	public readonly tableSize: WritableSignal<boolean> = signal<boolean>(false);

	/** One button per CustButtonType variant, reacting to the state toggles above them. */
	public readonly variantButtons: Signal<CustButtonInput[]> = computed((): CustButtonInput[] =>
		Object.values(CustButtonType)
			.filter((type: CustButtonType): boolean => type !== CustButtonType.icon)
			.map((type: CustButtonType): CustButtonInput => ({
				type: type,
				display: type,
				value: type,
				tooltip: `${type} button`,
				disabled: this.disabled() || type === CustButtonType.disabled,
				loading: this.loading(),
				isTableButton: this.tableSize(),
			})),
	);

	public readonly iconButtons: Signal<CustButtonInput[]> = computed((): CustButtonInput[] => [
		{
			type: CustButtonType.primary,
			icon: `save`,
			iconSide: CustButtonIconSide.left,
			display: `Save`,
			value: `save`,
			tooltip: `Icon on the left`,
			disabled: this.disabled(),
			loading: this.loading(),
			isTableButton: this.tableSize(),
		},
		{
			type: CustButtonType.secondary,
			icon: `arrow_forward`,
			iconSide: CustButtonIconSide.right,
			display: `Continue`,
			value: `continue`,
			tooltip: `Icon on the right`,
			disabled: this.disabled(),
			loading: this.loading(),
			isTableButton: this.tableSize(),
		},
		{
			type: CustButtonType.tertiary,
			display: `Fixed width`,
			value: `fixed-width`,
			tooltip: `width: 240px`,
			width: `240px`,
			disabled: this.disabled(),
			loading: this.loading(),
			isTableButton: this.tableSize(),
		},
		{
			type: CustButtonType.icon,
			icon: `delete`,
			display: ``,
			value: `icon-only`,
			tooltip: `Icon-only button (empty display)`,
			disabled: this.disabled(),
			loading: this.loading(),
		},
	]);

	public readonly tooLongButton: CustButtonInput = {
		type: CustButtonType.primary,
		display: `This label is far too long for a button`,
		value: `too-long`,
		tooltip: ``,
		disabled: false,
	};

	public readonly singleToggle: ButtonToggleInput = {
		label: `Single select`,
		value: `week`,
		inputList: [
			{ display: `Day`, value: `day` },
			{ display: `Week`, value: `week` },
			{ display: `Month`, value: `month` },
		],
	};

	public readonly multiToggle: ButtonToggleInput = {
		label: `Multi select`,
		multiSelect: true,
		valueList: [`email`, `sms`],
		inputList: [
			{ display: `Email`, value: `email` },
			{ display: `SMS`, value: `sms` },
			{ display: `Push`, value: `push` },
		],
	};

	public readonly readOnlyToggle: ButtonToggleInput = {
		label: `Read only`,
		value: `on`,
		isReadOnly: true,
		data: [
			{ display: `On`, value: `on` },
			{ display: `Off`, value: `off` },
		],
	};

	public readonly operatorToggle: ButtonToggleInput = {
		label: `equalToSelected (disables "and")`,
		value: `or`,
		inputList: [
			{ display: `And`, value: `and` },
			{ display: `Or`, value: `or` },
		],
	};

	public readonly fabIcons: string[] = [`help`, `add`, `chat`];
	public readonly fabIcon: WritableSignal<string> = signal<string>(`add`);

	public onButtonClick(result: CustInputReturn): void {
		this.buttonLog.add(`buttonClick: ${result.value}`);
	}

	public onToggleChanged(name: string, result: ButtonToggleResponse): void {
		const value: string = Array.isArray(result.value) ? `[${result.value.join(`, `)}]` : result.value;
		this.toggleLog.add(`${name} inputChanged: ${value}`);
	}

	public onFabClick(name: string): void {
		this.fabLog.add(`${name} emitClick`);
	}
}

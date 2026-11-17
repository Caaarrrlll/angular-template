import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { _SandboxContact, SandboxCardsDataService } from "@segments/sandbox/services/sandbox-cards-data.service";
import { CardComponent } from "@shared/components/card/card.component";
import { CardHeaderComponent } from "@shared/components/card/card-header/card-header.component";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderMenuInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustFooterChips,
	_CustTablePropertiesConfig,
	_CustTablePropertiesExtConfig,
	_DataProcessResponse,
} from "@shared/components/card-table/cust-card-table.interface";
import { _TableTypes } from "@shared/components/card-table/cust-table.enum";
import { HousingCardComponent } from "@shared/components/housing-card/housing-card.component";
import { _InfoCardParentDataContext, InfoCardComponent } from "@shared/components/info-card/info-card.component";
import { _InfoCardButtonClick } from "@shared/components/info-card/info-card.models";
import { _ListCardParentButtonContext, _ListCardParentDataContext, ListCardComponent } from "@shared/components/list-card/list-card.component";
import { _ButtonTypes, _StatusChip } from "@shared/components/list-card/list-card.enum";
import { _CardListButtons, _ListCardButtonClick } from "@shared/components/list-card/list-card.interface";
import { EmailToInitialsPipe } from "@shared/pipes/email-to-initials/email-to-initials.pipe";
import { NameToInitialsPipe } from "@shared/pipes/name-to-initials/name-to-initials.pipe";
import { OrdinalPipe } from "@shared/pipes/ordinal/ordinal.pipe";
import { TimeElapsedFormatPipe } from "@shared/pipes/time-elapsed/time-elapsed.pipe";
import { TruncatePipe } from "@shared/pipes/truncate/truncate.pipe";

interface _SandboxCardOption {
	label: string;
	color: string;
}

@Component({
	selector: "app-sandbox-cards",
	templateUrl: "./sandbox-cards.component.html",
	styleUrls: ["./sandbox-cards.component.scss"],
	imports: [
		SandboxPageComponent,
		SandboxDemoComponent,
		CardComponent,
		CardHeaderComponent,
		HousingCardComponent,
		InfoCardComponent,
		ListCardComponent,
		NameToInitialsPipe,
		EmailToInitialsPipe,
		TimeElapsedFormatPipe,
		TruncatePipe,
		OrdinalPipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxCardsComponent {
	private readonly cardsData: SandboxCardsDataService = inject(SandboxCardsDataService);

	// ---- card / card-header ----
	public readonly sidebarCards: _SandboxCardOption[] = [
		{ label: `Overdue`, color: `red` },
		{ label: `Healthy`, color: `green` },
		{ label: `Attention`, color: `orange` },
		{ label: `Neutral`, color: `white` },
	];
	public readonly headerColors: string[] = [`primary-gradient`, `red`, `green`, `orange`, `gray`, `white`];
	public readonly selectedCard: WritableSignal<number> = signal<number>(0);

	// ---- housing-card ----
	public readonly contacts: _SandboxContact[] = this.cardsData.contacts;

	// ---- info-card ----
	public readonly accountData: Record<string, unknown> = this.cardsData.accountData;
	public readonly accountHeader: _CustCardHeaderTableInterface[] = this.cardsData.accountHeader;
	public readonly accountTable: _CustCardTableInterface[] = this.cardsData.accountTable;
	public readonly accountNotesHeader: _CustCardHeaderTableInterface[] = this.cardsData.accountHeader.slice(0, 2);
	public readonly accountNotesTable: _CustCardTableInterface[] = this.cardsData.accountNotesTable;
	public readonly accountMenu: _CustCardHeaderMenuInterface = this.cardsData.accountMenu;
	public readonly accountEditMenu: _CustCardHeaderMenuInterface = this.cardsData.accountEditMenu;
	public readonly accountFooter: _CustFooterChips = this.cardsData.accountFooter;
	public readonly accountErrorHeader: _CustCardHeaderTableInterface[] = this.cardsData.accountErrorHeader;
	public readonly accountProperties: _CustTablePropertiesExtConfig = this.cardsData.accountProperties();
	public readonly accountRestrictedProperties: _CustTablePropertiesExtConfig = this.cardsData.accountProperties();
	public readonly accountErrorProperties: _CustTablePropertiesExtConfig = this.cardsData.notesProperties();
	public readonly notesProperties: _CustTablePropertiesExtConfig = this.cardsData.notesProperties();
	/** Claims are passed through to `parentDataProcess`; the statement button is only produced with `account.statement`. */
	public readonly fullClaims: string[] = [`account.statement`];
	public readonly infoCardLog = new SandboxEventLog();

	// ---- list-card ----
	public readonly leadData: Record<string, unknown> = this.cardsData.leadData;
	public readonly leadHeader: _CustCardHeaderTableInterface[] = this.cardsData.leadHeader;
	public readonly leadTable: _CustCardTableInterface[] = this.cardsData.leadTable;
	public readonly leadProperties: _CustTablePropertiesConfig[] = this.cardsData.leadProperties;
	public readonly leadButtons: _CustCardButtonTableInterface[] = this.cardsData.leadButtons;
	public readonly leadViewButton: _CustCardButtonTableInterface[] = this.cardsData.leadButtons.slice(2);
	/** Changing `spinner` tells list-card the pending action finished, which clears every button's loading state. */
	public readonly spinner: WritableSignal<number> = signal<number>(0);
	public readonly listCardLog = new SandboxEventLog();

	/**
	 * info-card resolves `Parent` header/table entries through this callback (the control's API requires a function input).
	 * It returns a `_DataProcessResponse` whose `type` decides how the value renders.
	 */
	public readonly accountParentProcess = (context: _InfoCardParentDataContext): _DataProcessResponse | undefined => {
		const config = context.config as _CustCardTableInterface;

		switch (config.field) {
			case `priority`:
				return { response: `${String(context.data[`priority`])} priority`.toUpperCase(), type: `chipsStatus`, action: _StatusChip.Negative };
			case `stage`:
				return { response: String(context.data[`stage`]), type: `chipsStatus`, action: _StatusChip.Informative };
			case `documents`:
				return {
					response: ``,
					type: _TableTypes.DisplayList,
					displayList: [{ ficaUploadedDocName: `ID document.pdf` }, { ficaUploadedDocName: `Payslip January.pdf` }],
				};
			case `statement`:
				return context.claims.includes(`account.statement`)
					? { response: ``, type: `textCombined`, buttonAction: `sendStatement` }
					: { response: `No permission`, type: _TableTypes.Text };
			default:
				return undefined;
		}
	};

	/** list-card resolves `Parent` table entries through this callback. */
	public readonly leadParentProcess = (context: _ListCardParentDataContext): _DataProcessResponse | undefined => {
		const config = context.config as _CustCardTableInterface;

		switch (config.field) {
			case `assignedTo`:
				return { response: String(context.data[`assignedTo`]), type: `iconWithDisplay`, iconName: `person`, iconColour: `#17aa57` };
			case `finance`:
				return { response: `Pre-approved`, type: `chipsStatus`, action: _StatusChip.Informative };
			default:
				return undefined;
		}
	};

	/** list-card adds these buttons (with an optional task) to its final column; `taskHeading` entries are not rendered. */
	public readonly leadButtonProcess = (context: _ListCardParentButtonContext): _CardListButtons => ({
		taskName: `Follow-up call`,
		buttons: [
			{ value: `Follow-up call`, type: `taskHeading` },
			{
				value: context.data[`taskAccepted`] ? `Call now` : `Accept task`,
				type: `button`,
				buttonClick: `acceptTask`,
				buttonType: _ButtonTypes.primary,
			},
		],
	});

	public selectCard(index: number): void {
		this.selectedCard.set(index);
	}

	public onInfoCardButton(event: _InfoCardButtonClick): void {
		this.infoCardLog.add(`buttonClick: ${event.action} (account ${JSON.stringify(event.data[`accountNumber`] ?? `none`)})`);
	}

	public onInfoCardMenu(action: string): void {
		this.infoCardLog.add(`menuClickEvent: ${action}`);
	}

	public onListCardButton(event: _ListCardButtonClick): void {
		this.listCardLog.add(`buttonClick: ${event.action.buttonClick ?? ``} (${String(event.data[`reference`])})`);
	}

	public finishPendingActions(): void {
		this.spinner.update((value: number): number => value + 1);
		this.listCardLog.add(`spinner -> ${String(this.spinner())} (loading cleared)`);
	}
}

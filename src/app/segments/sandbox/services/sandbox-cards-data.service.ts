import { Service } from "@angular/core";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderMenuInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustFooterChips,
	_CustTablePropertiesConfig,
	_CustTablePropertiesExtConfig,
} from "@shared/components/card-table/cust-card-table.interface";
import { _TableTypes } from "@shared/components/card-table/cust-table.enum";
import { _ButtonTypes, _HeaderAlignment, _HeaderTypes } from "@shared/components/list-card/list-card.enum";

export interface _SandboxContact {
	name: string;
	email: string;
	role: string;
	lastActive: string;
}

/**
 * Deterministic mock data and configs for the cards sandbox page.
 * All data here is invented for the demos (names, email addresses on example.com, lead/product codes, branches, amounts); none comes from real records.
 */
@Service()
export class SandboxCardsDataService {
	public readonly contacts: _SandboxContact[] = [
		{ name: `Thandi Mokoena`, email: `thandi.mokoena@example.com`, role: `Account manager`, lastActive: `2026-01-15T09:30:00` },
		{ name: `Sipho Dlamini`, email: `sipho@example.com`, role: `Sales consultant`, lastActive: `2026-01-12T14:05:00` },
		{ name: `Lerato Khumalo`, email: `lerato.k@example.com`, role: `Finance specialist with a deliberately long role title`, lastActive: `2025-12-20T08:00:00` },
		{ name: `Johan van der Merwe`, email: `johan.vdm@example.com`, role: `Branch manager`, lastActive: `2025-11-02T16:45:00` },
		{ name: `Ayesha Patel`, email: `ayesha.patel@example.com`, role: `Support agent`, lastActive: `2025-10-28T11:15:00` },
	];

	// ---- info-card ----

	/** A customer account record; info-card reads fields by name from the config below. */
	public readonly accountData: Record<string, unknown> = {
		accountNumber: `ACC-10482`,
		customerName: `Thandi Mokoena`,
		status: `In Progress`,
		priority: `high`,
		stage: `Awaiting documents`,
		contact: {
			email: `thandi.mokoena@example.com`,
			phone: `+27 82 555 0142`,
		},
		createdOn: `2026-01-15T09:30:00`,
		balance: `12500.50`,
		verified: true,
		debitOrder: false,
		branch: `Pretoria East`,
		agentName: `Sipho Dlamini`,
		notes: `Customer requested a call back after 14:00. Proof of address still outstanding; follow up before month end.`,
	};

	/** Header row: bold label, clickable name, value with text prefix, sub-field with icon, parent-processed chip, status chip. */
	public readonly accountHeader: _CustCardHeaderTableInterface[] = [
		{ display: `Account`, field: ``, type: `boldText`, textColor: `` },
		{ display: ``, field: `customerName`, textColor: ``, clickAction: `openCustomer` },
		{ display: ``, field: `accountNumber`, textPre: `No.`, textColor: `` },
		{ display: ``, field: `contact`, fieldSub: `email`, icon: `mail`, textColor: `` },
		{ display: ``, field: `priority`, type: `Parent`, textColor: `` },
		{ display: ``, field: `status`, type: _HeaderTypes.status, postText: `createdOn`, postLabel: `Created`, textColor: `` },
	];

	/** Column layout: `column` groups rows into columns; `editAction` becomes the buttonClick action. */
	public readonly accountTable: _CustCardTableInterface[] = [
		{ display: `Account`, field: `accountNumber`, type: _TableTypes.Text, column: 1 },
		{ display: `Email`, field: `contact`, fieldSub: `email`, type: _TableTypes.mailText, column: 1 },
		{ display: `Phone`, field: `contact`, fieldSub: `phone`, type: _TableTypes.phoneText, column: 1 },
		{ display: `Created`, field: `createdOn`, type: _TableTypes.Date, column: 1 },
		{ display: `Balance`, field: `balance`, type: _TableTypes.money, column: 2 },
		{ display: `Verified`, field: `verified`, type: _TableTypes.Boolean, column: 2, editAction: `toggleVerified` },
		{ display: `Debit order`, field: `debitOrder`, type: _TableTypes.Boolean, column: 2 },
		{ display: `Branch`, field: `branch`, type: _TableTypes.TextWithEdit, column: 2, editAction: `editBranch` },
		{ display: `Agent`, field: `agentName`, type: _TableTypes.TextClick, column: 2, editAction: `openAgent` },
		{ display: `Stage`, field: `stage`, type: _TableTypes.Parent, column: 3 },
		{ display: `Documents`, field: `documents`, type: _TableTypes.Parent, column: 3 },
		{ display: `Statement`, field: `statement`, type: _TableTypes.Parent, column: 3 },
	];

	public readonly accountNotesTable: _CustCardTableInterface[] = [{ display: `Notes`, field: `notes`, type: _TableTypes.Paragraph, column: 1 }];

	public readonly accountMenu: _CustCardHeaderMenuInterface = {
		icon: `more_vert`,
		id: `sandbox-info-card-menu`,
		items: [
			{ display: `View history`, action: `history` },
			{ display: `Export PDF`, action: `export` },
			{ display: `Close account`, action: `close` },
		],
	};

	/** A menu with `action` renders a single edit icon button that emits buttonClick instead of a dropdown. */
	public readonly accountEditMenu: _CustCardHeaderMenuInterface = {
		icon: `edit`,
		id: `sandbox-info-card-edit`,
		action: `editNotes`,
		items: [],
	};

	public readonly accountFooter: _CustFooterChips = {
		label: `Products:`,
		chipList: [
			{ display: `Cheque`, action: `cheque` },
			{ display: `Savings`, action: `savings` },
			{ display: `Credit card`, action: `creditCard` },
		],
	};

	/** Used when `data` is undefined: the first header entry is shown with an `errorActionButton`. */
	public readonly accountErrorHeader: _CustCardHeaderTableInterface[] = [{ display: `Account could not be loaded`, field: ``, textColor: `#d32f2f`, errorActionButton: `Retry` }];

	public accountProperties(): _CustTablePropertiesExtConfig {
		// Returned fresh per call so each demo card owns its config object.
		return { width: [`34%`, `36%`, `30%`], height: `130px` };
	}

	public notesProperties(): _CustTablePropertiesExtConfig {
		return { width: [`100%`], height: `60px` };
	}

	// ---- list-card ----

	public readonly leadData: Record<string, unknown> = {
		leadCode: `LD-2041`,
		type: `sale`,
		customerName: `Sipho Dlamini`,
		status: `New`,
		createdOn: `2026-01-15T09:30:00`,
		product: { productCode: `PR-1006`, name: `Standing Desk` },
		branch: `Pretoria East`,
		amount: `389900`,
		assignedTo: `Lerato Khumalo`,
		taskAccepted: false,
	};

	public readonly leadHeader: _CustCardHeaderTableInterface[] = [
		{ display: ``, field: `leadCode`, type: _HeaderTypes.display, textColor: `` },
		{ display: ``, field: `product`, fieldSub: `name`, textPre: `customerName`, textColor: `` },
		{ display: ``, field: `status`, type: _HeaderTypes.status, postText: `createdOn`, postLabel: `Created`, alignment: _HeaderAlignment.end, textColor: `` },
	];

	public readonly leadTable: _CustCardTableInterface[] = [
		{ display: `Customer`, field: `customerName`, type: _TableTypes.Text, column: 1 },
		{ display: `Type`, field: `type`, type: _TableTypes.Text, column: 1 },
		{ display: `Product`, field: `product`, fieldSub: `productCode`, type: _TableTypes.Text, column: 1 },
		{ display: `Branch`, field: `branch`, type: _TableTypes.store, column: 1 },
		{ display: `Amount`, field: `amount`, type: _TableTypes.money, column: 2 },
		{ display: `Created`, field: `createdOn`, type: _TableTypes.DateTime, column: 2 },
		{ display: `Assigned`, field: `assignedTo`, type: _TableTypes.Parent, column: 2 },
		{ display: `Finance`, field: `finance`, type: _TableTypes.Parent, column: 2 },
	];

	public readonly leadProperties: _CustTablePropertiesConfig[] = [{ width: `40%` }, { width: `40%` }];

	public readonly leadButtons: _CustCardButtonTableInterface[] = [
		{ value: `Accept`, type: ``, buttonClick: `accept`, buttonType: _ButtonTypes.primary },
		{ value: `Reassign`, type: ``, buttonClick: `reassign`, buttonType: _ButtonTypes.secondary },
		{ value: `View`, type: ``, buttonClick: `view`, buttonType: _ButtonTypes.tertiary },
	];
}

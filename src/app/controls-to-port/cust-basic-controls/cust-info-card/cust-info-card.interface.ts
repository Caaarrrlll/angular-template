import { _HeaderAlignment, _StatusChip } from "../cust-list-card/cust-list-card.enum";

export interface _CardCol {
	label?: string;
	value: string;
	type: string;
	valueColor?: string;
	extendedColour?: string;
	extendedText?: string;
	buttonClick?: string;
	maskHide?: boolean;
	coloredBlock?: string;
	iconName?: string;
	iconTooltip?: string;
	leadEscalated?: boolean;
	buttonType?: string;
	taskName?: string;
	whatsappMessage?: string;
}

export interface _CardRow {
	item: col[];
	colSCSS: string;
	pulse?: boolean;
	width?: string;
}

export interface _CardListButtons {
	taskName: string;
	buttons: col[];
}

export interface col {
	label?: string;
	value: string;
	type: string;
	valueColor?: string;
	extendedColour?: string;
	extendedText?: string;
	buttonClick?: string;
	maskHide?: boolean;
	coloredBlock?: string;
	iconName?: string;
	iconTooltip?: string;
	leadEscalated?: boolean;
	buttonType?: string;
	taskName?: string;
}

///////////////////////////////////All the below is used by the sales card to be phased out/////////////////////////////////////
interface row {
	item: col[];
	colSCSS: string;
	pulse?: boolean;
	width?: string;
}

export interface expandList {
	time: string;
	event: string;
	eventColor: string;
	title: string;
	description: string;
	contact: string;
	address: string;
	createdBy: string;
	bckColor: string;
	leadStatus: string;
	leadStatusColor: string;
	finalOffer: string;
}

export interface headerStatusInterface {
	text: string;
	type: _StatusChip;
}

export interface headerInterface {
	text: string;
	alignment: _HeaderAlignment;
	fontSize?: string;
	icon?: string;
	textColor?: string;
	textExtended?: string;
	textPre?: string;
}

export class cardObj {
	cols: col[] = [];
	rows: row[] = [];
	headers: headerInterface[] = [];
	expandList: expandList[];
	expandButtons: string[] = [];
	whatsappMessage: string;
	headerStatus: headerStatusInterface;

	constructor() {
		this.rows = [];
		this.headerStatus = {
			text: "",
			type: _StatusChip.Informative,
		};
	}

	addItem(col: col): void {
		this.cols.push(col);
	}

	addCol(css: string, pulse: boolean = false, width?: string): void {
		this.rows.push({
			item: JSON.parse(JSON.stringify(this.cols)),
			colSCSS: css,
			pulse: pulse,
			width: width,
		});
		this.cols.splice(0, this.cols.length);
	}

	addExpandedRow(time: string, event: string, eventColor: string, title: string, description: string, contact: string, address: string, createdBy: string): void {
		if (this.expandList == null) {
			this.expandList = new Array({
				time: time,
				event: event,
				eventColor: eventColor,
				title: title,
				description: description,
				contact: contact,
				address: address,
				createdBy: createdBy,
				bckColor: "inherit",
				leadStatus: "",
				leadStatusColor: "",
				finalOffer: "",
			});
			return;
		}

		this.expandList.push({
			time: time,
			event: event,
			eventColor: eventColor,
			title: title,
			description: description,
			contact: contact,
			address: address,
			createdBy: createdBy,
			bckColor: "inherit",
			leadStatus: "",
			leadStatusColor: "",
			finalOffer: "",
		});
	}

	addColExtended(css: string): void {
		this.rows.push({
			item: JSON.parse(JSON.stringify(this.cols)),
			colSCSS: css,
		});
		this.cols.splice(0, this.cols.length);
	}

	addExpandButtons(button: string): void {
		this.expandButtons.push(button);
	}

	clearExpandButtons(): void {
		this.expandButtons.splice(0, this.expandButtons.length);
	}

	getItems(): row[] {
		return this.rows;
	}
}

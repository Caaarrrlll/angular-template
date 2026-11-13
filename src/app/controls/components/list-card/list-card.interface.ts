import { _ImageIcon } from "@shared/components/card-table/cust-card-table.interface";

export interface _CardCol {
	label?: string;
	value: string;
	type?: string;
	valueColor?: string;
	extendedColour?: string;
	extendedText?: string;
	buttonClick?: string;
	maskHide?: boolean;
	coloredBlock?: string;
	iconName?: string;
	iconTooltip?: string;
	iconColour?: string;
	leadEscalated?: boolean;
	buttonType?: string;
	taskName?: string;
	loading?: boolean;
	imageIcons?: _ImageIcon[];
	list?: unknown[];
	url?: string;
}

export interface _CardRow {
	item: _CardCol[];
	colSCSS: string;
	pulse?: boolean;
	width?: string;
}

export interface _CardListButtons {
	taskName: string;
	buttons: _CardCol[];
}

export interface _ListCardButtonClick {
	action: _CardCol;
	data: Record<string, any>;
}

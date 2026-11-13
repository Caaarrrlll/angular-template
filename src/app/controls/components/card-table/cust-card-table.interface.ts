import { _HeaderAlignment } from "@shared/components/list-card/list-card.enum";
import { _TableTypes } from "./cust-table.enum";

export interface _ImageIcon {
	path: string;
	opacity: number;
}

export interface _CustTableWrapperInterface {
	cardTable: _CustCardTableInterface[];
	cardHeaders: _CustCardHeaderTableInterface[];
	cardTableProperties: _CustTablePropertiesConfig[];
	cardButtonTable: _CustCardButtonTableInterface[];
}

export interface _CustCardTableInterface {
	display: string;
	field: string;
	fieldSub?: string;
	type?: _TableTypes;
	column: number;
	editAction?: string;
}

export interface _CustFooterChips {
	label: string;
	chipList: _CustFooterChipItems[];
}

export interface _CustFooterChipItems {
	display: string;
	action: string;
}

export interface _CustCardHeaderTableInterface {
	display: string;
	field: string;
	fieldSub?: string;
	alignment?: _HeaderAlignment;
	textColor: string;
	textPre?: string;
	type?: string;
	postLable?: string;
	postText?: string;
	icon?: string;
	errorActionButton?: string;
	clickAction?: string;
}

export interface _CustInfoCardHeaderTableInterface {
	display: string;
	field: string;
	fieldSub?: string;
	alignment?: string;
	textColor: string;
	textPre?: string;
	type?: string;
	postLable?: string;
	postText?: string;
	icon?: string;
	errorActionButton?: string;
	clickAction?: string;
}

export interface _CustCardHeaderDataInterface {
	alignment: string;
	text: string;
	textPre?: string;
	type: string;
	statusType?: string;
	textColor?: string;
	postText?: string;
	postLable?: string;
	clickAction?: string;
	length?: number;
	icon?: string;
	fontSize?: string;
	textExtended?: string;
}

export interface _CustCardButtonTableInterface {
	value: string;
	type: string;
	buttonClick: string;
	buttonType: string;
}

export interface _CustTablePropertiesConfig {
	width: string;
	height?: string;
}

export interface _CustTablePropertiesExtConfig {
	width: string[];
	height: string;
	heightAuto?: boolean;
}

export interface _DataProcessResponse {
	response: string;
	type?: string;
	whatsAppMessage?: string;
	alignment?: string;
	url?: string;
	vin?: string;
	width?: string;
	displayList?: unknown[];
	buttonAction?: string;
	iconName?: string;
	iconColour?: string;
	imageIcons?: _ImageIcon[];
	label?: string;
	textPre?: string;
	postText?: string;
	postLable?: string;
	length?: number;
	action?: string;
	errorAction?: string;
	editAction?: string;
}

export interface _CustCardHeaderMenuInterface {
	icon: string;
	id: string;
	action?: string;
	items: _CustCardHeaderMenuItemsInterface[];
}

export interface _CustCardHeaderMenuItemsInterface {
	display: string;
	action: string;
}

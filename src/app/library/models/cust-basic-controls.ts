import { FormControl, ValidatorFn } from "@angular/forms";

export interface _CustInputReturn {
	value: string;
	error: boolean;
	errorDescription: string;
	event?: Event;
}

export interface _CustInputResponse {
	value: string[];
	error: boolean;
	errorDescription: string;
}

export interface _ToggleOption {
	display: string;
	value: unknown;
}

export interface _InputSelectOption {
	display: string;
	value: unknown;
}

export interface _CustInputGeneral {
	label: string;
	value?: string;
	valueList?: string[];
	inputList?: _InputSelectOption[];
	isReadOnly?: boolean;
	placeholder?: string;
	minlength?: number;
	multiSelect?: boolean;
}

export interface _CustChipInput {
	icon: string;
	display: string;
	value: unknown;
	count: number;
	disabled: boolean;
	mouseOver: boolean;
	showZero?: boolean;
	isToggle?: boolean;
	hidden?: boolean;
	refresh?: boolean;
}

export interface _CustChipReturn {
	value: unknown;
	action: string;
	event: Event | null;
}

export interface _CustButtonInput {
	type: string;
	icon?: string;
	tooltip: string;
	iconSide?: string;
	display: string;
	value: string;
	disabled: boolean;
	width?: string;
	isTableButton?: boolean;
	loading?: boolean;
}

export interface _CustButtonInputType {
	icon: string;
	tooltip: string;
	iconSide?: string;
	display: string;
	value: string;
	disabled: boolean;
	width?: string;
	loading?: boolean;
	parameters?: string[];
}

export interface _CustButtonMenuItem {
	text: string;
	disabled?: boolean;
}

export interface _CustInputAdvance {
	inputControl: FormControl;
	validations: ValidatorFn[];
	errors: { name: string; message: string }[];
	clear?: boolean;
	maxLength?: number;
}

export interface _CustCheckboxInput {
	display: string;
	activated: boolean;
	value: string;
}

export enum _CustButtonType {
	primary = "Primary",
	secondary = "Secondary",
	tertiary = "Tertiary",
	text = "Text",
	disabled = "Disabled",
	icon = "icon",
}

export enum _CustButtonIconSide {
	left = "left",
	right = "right",
}

import { FormControl, ValidatorFn } from "@angular/forms";

export interface CustInputReturn {
	value: string;
	error: boolean;
	errorDescription: string;
	event?: Event;
}

export interface CustInputResponse {
	value: string[];
	error: boolean;
	errorDescription: string;
}

export interface ToggleOption {
	display: string;
	value: unknown;
}

export interface InputSelectOption {
	display: string;
	value: unknown;
}

export interface CustInputGeneral {
	label: string;
	value?: string;
	valueList?: string[];
	inputList?: InputSelectOption[];
	isReadOnly?: boolean;
	placeholder?: string;
	minlength?: number;
	multiSelect?: boolean;
}

export interface CustChipInput {
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

export interface CustChipReturn {
	value: unknown;
	action: string;
	event: Event | null;
}

export interface CustButtonInput {
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

export interface CustButtonInputType {
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

export interface CustInputAdvance {
	inputControl: FormControl;
	validations: ValidatorFn[];
	errors: { name: string; message: string }[];
	clear?: boolean;
	maxlen?: number;
}

export interface CustCheckboxInput {
	display: string;
	activated: boolean;
	value: string;
}

export enum CustButtonType {
	primary = "Primary",
	secondary = "Secondary",
	tertiary = "Tertiary",
	text = "Text",
	disabled = "Disabled",
	icon = "icon",
}

export enum CustButtonIconSide {
	left = "left",
	right = "right",
}

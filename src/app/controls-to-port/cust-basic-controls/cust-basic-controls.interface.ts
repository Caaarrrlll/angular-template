import { FormControl, Validators } from "@angular/forms";
export interface _CustInputReturn {
	value: string;
	error: boolean;
	errorDescription: string;
	event?: Event;
}

export interface custInputResponse {
	value: string[];
	error: boolean;
	errorDescription: string;
}

export interface _toggleOptions {
	display: string;
	value: any;
}

export interface _inputSelectOptions {
	display: string;
	value: any;
}

export interface _custInputGeneral {
	label: string;
	value?: string;
	valueList?: Array<string>;
	inputList?: Array<_inputSelectOptions>;
	isReadOnly?: boolean;
	placeholder?: string;
	minlength?: number;
	multiSelect?: boolean;
}

export interface _CustChipInput {
	icon: string;
	display: string;
	value: any;
	count: string;
	disabled: boolean;
	mouseOver: boolean;
	showZero?: boolean;
	isToggle?: boolean;
	hidden?: boolean;
	refresh?: boolean;
}

export interface _CustChipReturn {
	value: string;
	action: string;
	event: Event;
}

export interface _CustButtonInput {
	type: string;
	icon: string;
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

export interface _CustInputAdvance {
	inputControl: FormControl;
	validations: Validators[];
	errors: { name: string; message: string }[];
	clear?: boolean;
	maxlen?: number;
}

export interface _CustCheckboxInput {
	display: string;
	activated: boolean;
	value: string;
}

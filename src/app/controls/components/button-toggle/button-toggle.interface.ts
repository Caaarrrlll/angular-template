export interface _ButtonToggleOption {
	display: string;
	value: string;
}

export interface _ButtonToggleInput {
	label?: string;
	value?: string | string[];
	valueList?: string[];
	inputList?: _ButtonToggleOption[];
	data?: _ButtonToggleOption[];
	isReadOnly?: boolean;
	multiSelect?: boolean;
}

export interface _ButtonToggleResponse {
	value: string | string[];
	error: boolean;
	errorDescription: string;
}

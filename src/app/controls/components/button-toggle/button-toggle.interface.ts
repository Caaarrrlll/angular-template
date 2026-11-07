export interface ButtonToggleOption {
	display: string;
	value: string;
}

export interface ButtonToggleInput {
	label?: string;
	value?: string | string[];
	valueList?: string[];
	inputList?: ButtonToggleOption[];
	data?: ButtonToggleOption[];
	isReadOnly?: boolean;
	multiSelect?: boolean;
}

export interface ButtonToggleResponse {
	value: string | string[];
	error: boolean;
	errorDescription: string;
}

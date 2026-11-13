export type DialogWindowControlType =
	| "Image"
	| "Slider"
	| "BtnGroup"
	| "DropDown"
	| "TextArea"
	| "Input"
	| "CurrencyShortHand"
	| "MultiSelect"
	| "SingleDate"
	| "DateTime"
	| "Checkbox"
	| "radio"
	| "approval";

export type DialogWindowValidator = "phone" | "email" | "nospace";

export interface _DialogWindowOption {
	display?: string;
	displayText?: string;
	label?: string;
	text?: string;
	value: unknown;
	selected?: boolean;
}

export interface _DialogWindowControl {
	type: DialogWindowControlType;
	formName: string;
	value?: unknown;
	label?: string;
	placeholder?: string;
	instructionText?: string;
	imgUrl?: string;
	required?: boolean;
	validators?: DialogWindowValidator;
	validationDep?: string;
	disabled?: boolean;
	valueType?: string;
	valuePrimitive?: boolean;
	minValue?: number;
	maxValue?: number;
	increment?: number;
	disabledBefore?: Date;
	data?: _DialogWindowOption[];
}

export class DialogSetup {
	public controls?: _DialogWindowControl[];
	public instructionText?: string;
	public additionalText?: string;
	public optionSelected?: string;
	public backButtonText: string;
	public submitButtonText: string;
	public hideBackButton: boolean;
	public hideSubmitButton: boolean;

	constructor({
		controls = [],
		instructionText,
		additionalText,
		optionSelected,
		backButtonText = "BACK",
		submitButtonText = "SUBMIT",
		hideBackButton = false,
		hideSubmitButton = false,
	}: {
		controls?: _DialogWindowControl[];
		instructionText?: string;
		additionalText?: string;
		optionSelected?: string;
		backButtonText?: string;
		submitButtonText?: string;
		hideBackButton?: boolean;
		hideSubmitButton?: boolean;
	}) {
		this.controls = controls;
		this.instructionText = instructionText;
		this.additionalText = additionalText;
		this.optionSelected = optionSelected;
		this.backButtonText = backButtonText;
		this.submitButtonText = submitButtonText;
		this.hideBackButton = hideBackButton;
		this.hideSubmitButton = hideSubmitButton;
	}
}

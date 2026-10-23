export interface _ControlInterface {
	type: FormType;
	instructionText?: string;
	value?: string;
	formName?: string;
	disabled?: boolean;
	hintText?: string;
	validationDep?: string;
}

export class DynamicDialogSetup {
	public controls?: (
		| TextArea
		| DialogInput
		| CurrencyShortHand
		| DropDown
		| CUSTButtonGroup
		| ButtonGroup
		| SingleDate
		| RangeDate
		| DateTime
		| Slider
		| CheckBox
		| RadioButton
		| Approval
		| Address
		| Upload
		| Numeric
	)[];
	public instructionText?: string;
	public backButtonText?: string;
	public hideBackButton?: boolean;
	public hideSubmitButton?: boolean;
	public submitButtonText?: string;
	public imageUrl?: string;
	public title: string;
	public simple?: boolean;

	constructor({
		controls = [],
		instructionText,
		backButtonText = "BACK",
		hideBackButton = false,
		hideSubmitButton = false,
		submitButtonText = "SUBMIT",
		imageUrl,
		title,
		simple = true,
	}: {
		controls?: (
			| TextArea
			| DialogInput
			| CurrencyShortHand
			| DropDown
			| CUSTButtonGroup
			| ButtonGroup
			| SingleDate
			| RangeDate
			| DateTime
			| Slider
			| CheckBox
			| RadioButton
			| Approval
			| Address
			| Upload
			| Numeric
		)[];
		instructionText?: string;
		backButtonText?: string;
		hideBackButton?: boolean;
		hideSubmitButton?: boolean;
		submitButtonText?: string;
		imageUrl?: string;
		title: string;
		simple?: boolean;
	}) {
		this.controls = controls;
		this.instructionText = instructionText;
		this.backButtonText = backButtonText;
		this.hideBackButton = hideBackButton;
		this.hideSubmitButton = hideSubmitButton;
		this.submitButtonText = submitButtonText;
		this.imageUrl = imageUrl;
		this.title = title;
		this.simple = simple;
	}
}

export class GenericControl {
	public type: FormType;
	public instructionText?: string;
	public value?: any;
	public formName?: string;
	public disabled?: boolean;
	public hintText?: string;
	public validators?: _ErrorValidation[];
	public validationDep?: string;

	constructor({
		type,
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		type: FormType;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		this.type = type;
		this.instructionText = instructionText;
		this.value = value;
		this.formName = formName;
		this.disabled = disabled;
		this.hintText = hintText;
		this.validators = validators;
		this.validationDep = validationDep;
	}
}

export class TextArea extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public inputType?: string;

	constructor({
		label,
		placeholder,
		inputType = "text",
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		inputType?: string;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.TextArea,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.inputType = inputType;
	}
}

export class DialogInput extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public inputType?: string;
	public autoComplete?: boolean;

	constructor({
		label,
		placeholder,
		inputType,
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
		autoComplete,
	}: {
		label?: string;
		placeholder?: string;
		inputType?: string;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
		autoComplete?: boolean;
	}) {
		super({
			type: FormType.Input,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.inputType = inputType;
		this.autoComplete = autoComplete;
	}
}

export class CurrencyShortHand extends GenericControl {
	public label: string;
	public placeholder?: string;

	constructor({
		label,
		placeholder,
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		label: string;
		placeholder?: string;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.CurrencyShortHand,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
	}
}

export class DropDown extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public multiple?: boolean;
	public data: _FormData[];

	constructor({
		label,
		placeholder,
		multiple = false,
		data = [],
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		multiple?: boolean;
		data: _FormData[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.DropDown,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.multiple = multiple;
		this.data = data;
	}
}

export class DropDownGroups extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public multiple?: boolean;
	public groups: {
		groupName: string;
		data: _FormData[];
	}[];

	constructor({
		label,
		placeholder,
		multiple = false,
		groups = [],
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		multiple?: boolean;
		groups: {
			groupName: string;
			data: _FormData[];
		}[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.DropDownGroup,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.multiple = multiple;
		this.groups = groups;
	}
}

export class ButtonGroup extends GenericControl {
	public data?: _FormData[];
	public label?: string;
	public valueList?: string[];
	public multiSelect?: boolean;
	public inputList?: _ButtonGroupInput[];
	public isReadOnly?: boolean;

	constructor({
		data = [],
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
		label,
		valueList,
		multiSelect,
		inputList,
		isReadOnly,
	}: {
		data?: _FormData[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
		label?: string;
		valueList?: string[];
		multiSelect?: boolean;
		inputList?: _ButtonGroupInput[];
		isReadOnly?: boolean;
	}) {
		super({
			type: FormType.ButtonGroup,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.data = data;
		this.label = label;
		this.valueList = valueList;
		this.multiSelect = multiSelect;
		this.inputList = inputList;
		this.isReadOnly = isReadOnly;
	}
}

export class CUSTButtonGroup extends GenericControl {
	public data: _FormData[];

	constructor({
		data = [],
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		data: _FormData[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.CUSTButtonGroup,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.data = data;
	}
}

export class SingleDate extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public disabledBefore?: Date;

	constructor({
		label,
		placeholder,
		disabledBefore,
		instructionText,
		value,
		formName,
		disabled,
		hintText = "MM/DD/YYYY",
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		disabledBefore?: Date;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.SingleDate,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.disabledBefore = disabledBefore;
	}
}

export class SingleDateString extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public disabledBefore?: Date;

	constructor({
		label,
		placeholder,
		disabledBefore,
		instructionText,
		value,
		formName,
		disabled,
		hintText = "YYYY/MM/DD",
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		disabledBefore?: Date;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.SingleDateString,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.disabledBefore = disabledBefore;
	}
}

export class RangeDate extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public disabledBefore?: Date;

	constructor({
		label,
		placeholder,
		disabledBefore,
		instructionText,
		value,
		formName,
		disabled,
		hintText = "MM/DD/YYYY - MM/DD/YYYY",
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		disabledBefore?: Date;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.RangeDate,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.disabledBefore = disabledBefore;
	}
}

export class RangeDateString extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public disabledBefore?: Date;

	constructor({
		label,
		placeholder,
		disabledBefore,
		instructionText,
		value,
		formName,
		disabled,
		hintText = "MM/DD/YYYY - MM/DD/YYYY",
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		disabledBefore?: Date;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.RangeDateString,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.disabledBefore = disabledBefore;
	}
}

export class DateTime extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public disabledBefore?: Date;

	constructor({
		label,
		placeholder,
		disabledBefore,
		instructionText,
		value,
		formName,
		disabled,
		hintText = "MM/DD/YYYY",
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		disabledBefore?: Date;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.DateTime,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.disabledBefore = disabledBefore;
	}
}

export class Slider extends GenericControl {
	public minValue?: number;
	public maxValue?: number;
	public increment?: number;

	constructor({
		minValue = 0,
		maxValue = 100,
		increment = 1,
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		minValue?: number;
		maxValue?: number;
		increment?: number;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.Slider,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.increment = increment;
	}
}

export class CheckBox extends GenericControl {
	public data: _FormData[];
	public multi: boolean;
	public filterable: boolean;

	constructor({
		data,
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
		multi = false,
		filterable = false,
	}: {
		data: _FormData[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
		multi?: boolean;
		filterable?: boolean;
	}) {
		super({
			type: FormType.CheckBox,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.data = data;
		this.multi = multi;
		this.filterable = filterable;
	}
}

export class RadioButton extends GenericControl {
	public data: _FormData[];

	constructor({
		data = [],
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		data: _FormData[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.Radio,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.data = data;
	}
}

export class CheckBoxRange extends GenericControl {
	public data: _FormData[];
	public multi: boolean;
	public filterable: boolean;

	constructor({
		data,
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
		multi = false,
		filterable = false,
	}: {
		data: _FormData[];
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
		multi?: boolean;
		filterable?: boolean;
	}) {
		super({
			type: FormType.CheckBoxRange,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.data = data;
		this.multi = multi;
		this.filterable = filterable;
	}
}

export class Approval extends GenericControl {
	public approveText: string;
	public rejectText: string;
	constructor({ instructionText, formName, approveText, rejectText }: { instructionText?: string; formName?: string; approveText: string; rejectText: string }) {
		super({
			type: FormType.Approval,
			instructionText: instructionText,
			formName: formName,
		});
		this.approveText = approveText;
		this.rejectText = rejectText;
	}
}

export class Address extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public inputType?: string;

	constructor({
		label,
		placeholder,
		inputType = "address",
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
	}: {
		label?: string;
		placeholder?: string;
		inputType?: string;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
	}) {
		super({
			type: FormType.Address,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.inputType = inputType;
	}
}

export class Upload extends GenericControl {
	constructor({ formName, disabled }: { formName?: string; disabled?: boolean }) {
		super({
			formName: formName,
			disabled: disabled,
			type: FormType.Upload,
		});
	}
}

export class Numeric extends GenericControl {
	public label?: string;
	public placeholder?: string;
	public inputType?: string;
	public autoComplete?: boolean;
	public min?: number = 0;
	public max?: number;
	public decimals?: number = 2;

	constructor({
		label,
		placeholder,
		inputType = "number",
		instructionText,
		value,
		formName,
		disabled,
		hintText,
		validators,
		validationDep,
		autoComplete,
		min,
		max,
		decimals,
	}: {
		label?: string;
		placeholder?: string;
		inputType?: string;
		instructionText?: string;
		value?: any;
		formName?: string;
		disabled?: boolean;
		hintText?: string;
		validators?: _ErrorValidation[];
		validationDep?: string;
		autoComplete?: boolean;
		min?: number;
		max?: number;
		decimals?: number;
	}) {
		super({
			type: FormType.Input,
			instructionText: instructionText,
			value: value,
			formName: formName,
			disabled: disabled,
			hintText: hintText,
			validators: validators,
			validationDep: validationDep,
		});
		this.label = label;
		this.placeholder = placeholder;
		this.inputType = inputType;
		this.autoComplete = autoComplete;
		this.min = min;
		this.max = max;
		this.decimals = decimals;
	}
}

//Slide Toggle

export interface _FormData {
	value: any;
	display: string;
}

export interface _ButtonGroupInput {
	value: string;
	display: string;
}

export interface _ErrorValidation {
	validator: ValidatorType;
	value?: any;
	errorMessage: string;
}

export enum ValidatorType {
	min,
	max,
	required,
	requiredTrue,
	email,
	minlength,
	maxlength,
	pattern,
	nullValidator,
	noSpace,
	phone,
}

export enum FormType {
	TextArea,
	Input,
	CurrencyShortHand,
	DropDown,
	DropDownGroup,
	ButtonGroup,
	CUSTButtonGroup,
	SingleDate,
	SingleDateString,
	RangeDate,
	RangeDateString,
	DateTime,
	Slider,
	CheckBox,
	Radio,
	CheckBoxRange,
	Approval,
	Address,
	Upload,
	Number,
}

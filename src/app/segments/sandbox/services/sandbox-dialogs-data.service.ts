import { HttpErrorResponse } from "@angular/common/http";
import { Service } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { _ConfirmationDialogData } from "@shared/components/confirmation-dialog/confirmation-dialog.interface";
import {
	Approval,
	ButtonGroup,
	CheckBox,
	CurrencyShortHand,
	CUSTButtonGroup,
	DateTime,
	DialogInput,
	DropDown,
	DropDownGroups,
	DynamicDialogSetup,
	RadioButton,
	RangeDate,
	Slider,
	SingleDate,
	TextArea,
	Upload,
	ValidatorType,
	_FormData,
} from "@shared/components/dynamic-material-dialog/dynamic-material-dialog-setup.model";
import { DialogSetup } from "@shared/components/dynamic-window/dynamic-window.models";
import { MediaFile } from "@shared/components/media-dialog/media-dialog.models";
import { _CustTableInterface } from "@shared/components/table/cust-table.interface";
import { _TableTypes } from "@shared/components/table/cust-table.enum";
import { Observable, delay, map, of, throwError, timer } from "rxjs";

/** Media keys understood by the sandbox `MEDIA_LOADER` mock. */
export const SANDBOX_MEDIA_KEYS = {
	found: `media-found`,
	slow: `media-slow`,
	missing: `media-missing`,
	failing: `media-failing`,
} as const;

/** Small deterministic 240x150 JPEG (orange-to-blue gradient) used as mock media. */
const SANDBOX_JPEG_BASE64 = `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`;

/**
 * The dynamic-material-dialog builder classes declare `formName?: string`, but `DynamicDialogSetup.controls`
 * requires `_DialogControl` (`formName: string`) — a control-model mismatch recorded in the ROADMAP audit.
 * Every sandbox control sets a name, so this narrows the type and fails loudly if one is missing.
 */
function namedControls<T extends { formName?: string }>(controls: T[]): (T & { formName: string })[] {
	return controls.map((control) => {
		if (!control.formName) {
			throw new Error(`Sandbox dialog control is missing formName`);
		}

		return control as T & { formName: string };
	});
}

export interface _SandboxTableDialogData {
	title: string;
	dataSource: MatTableDataSource<Record<string, unknown>>;
	tableConfig: _CustTableInterface[];
}

/**
 * Mock dialog configurations for the dialogs sandbox page.
 * Setups are returned from factory methods because the dialogs mutate the
 * setup they are opened with (form names, values, validator types).
 */
@Service()
export class SandboxDialogsDataService {
	public readonly confirmationCustom: _ConfirmationDialogData = {
		title: `Delete invoice INV-0042?`,
		description: `This removes the invoice and its line items from the mock ledger. This cannot be undone.`,
	};

	public readonly autoCompleteSource: string[] = [`Alice Botha`, `Alicia Keys`, `Bongani Dlamini`, `Brenda Fassie`, `Carl Naude`, `Candice Swanepoel`, `Thabo Mokoena`];

	/** Mock `MEDIA_LOADER`: resolves, resolves slowly, 404s (no data) or fails, depending on the key. */
	public loadMedia(mediaKey: string): Observable<MediaFile | null> {
		const media: MediaFile = { file: { data: SANDBOX_JPEG_BASE64 } };

		switch (mediaKey) {
			case SANDBOX_MEDIA_KEYS.found:
				return of(media);
			case SANDBOX_MEDIA_KEYS.slow:
				return timer(1500).pipe(map((): MediaFile => media));
			case SANDBOX_MEDIA_KEYS.missing:
				return throwError(() => new HttpErrorResponse({ status: 404, statusText: `Not Found` }));
			default:
				return throwError(() => new HttpErrorResponse({ status: 500, statusText: `Mock server error` }));
		}
	}

	/** Mock sales-executive search used to answer the dynamic dialog's autocomplete (300ms mock latency). */
	public searchSalesExecs(term: string): Observable<string[]> {
		const needle = term.toLowerCase();
		return of(this.autoCompleteSource.filter((name: string): boolean => name.toLowerCase().includes(needle))).pipe(delay(300));
	}

	public tableDialogData(empty: boolean): _SandboxTableDialogData {
		const rows: Record<string, unknown>[] = empty
			? []
			: [
					{ stockNo: `STK-1001`, model: `Hatchback 1.4`, price: 189900, mileage: 45210, view: `` },
					{ stockNo: `STK-1002`, model: `Sedan 2.0`, price: 264500, mileage: 18990, view: `` },
					{ stockNo: `STK-1003`, model: `Bakkie 2.8 D/C`, price: 512000, mileage: 102345, view: `` },
					{ stockNo: `STK-1004`, model: `SUV 1.5T`, price: 389999, mileage: 0, view: `` },
				];

		return {
			title: empty ? `Matching stock (none)` : `Matching stock`,
			dataSource: new MatTableDataSource<Record<string, unknown>>(rows),
			tableConfig: [
				{ display: `Stock no.`, colName: `stockNo`, width: `120px`, type: _TableTypes.Text },
				{ display: `Model`, colName: `model`, width: `200px`, type: _TableTypes.Text },
				{ display: `Price`, colName: `price`, width: `140px`, type: _TableTypes.Currency },
				{ display: `Mileage`, colName: `mileage`, width: `140px`, type: _TableTypes.Odometer },
				{ display: `View`, colName: `view`, width: `80px`, icon: `visibility`, tooltip: `Select this row`, disableDisplay: true },
			],
		};
	}

	// ---- dynamic-material-dialog --------------------------------------------------------------

	/** Button-type: two `ButtonGroup` toggles (single + multi select); closes with the form value on submit. */
	public dmdButtonGroupSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Delivery preferences`,
			instructionText: `Button-type setup: ButtonGroup controls feed the form through app-button-toggle.`,
			controls: namedControls([
				new ButtonGroup({
					formName: `deliveryMethod`,
					label: `Delivery method`,
					value: `courier`,
					data: [
						{ value: `courier`, display: `Courier` },
						{ value: `collect`, display: `Collect` },
						{ value: `post`, display: `Post` },
					],
				}),
				new ButtonGroup({
					formName: `notifyBy`,
					label: `Notify by`,
					multiSelect: true,
					value: [`email`],
					data: [
						{ value: `email`, display: `Email` },
						{ value: `sms`, display: `SMS` },
						{ value: `push`, display: `Push` },
					],
				}),
			]),
		});
	}

	/** Button-type: `Approval` control; closes with `"Approve"` / `"Reject"`. Approve stays disabled until the required comment is filled. */
	public dmdApprovalSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Approve discount request`,
			instructionText: `Approval control: Approve is disabled while the form is invalid (comment is required).`,
			hideSubmitButton: true,
			hideBackButton: true,
			controls: namedControls([
				new TextArea({
					formName: `comment`,
					label: `Comment`,
					placeholder: `Reason for the decision`,
					validators: [{ validator: ValidatorType.required, errorMessage: `A comment is required` }],
				}),
				new Approval({ formName: `approval`, approveText: `Approve`, rejectText: `Reject` }),
			]),
		});
	}

	/**
	 * Menu-type: the non-simple (`simple: false`) filter menu. The component relies on
	 * positional controls: [0] first operator, [1] first value, [2] and/or toggle
	 * (`secondOperator`), [3] second operator (`thirdOperator`), [4] second value.
	 * The back button text `Clear` closes with `{ action: "clear" }`.
	 */
	public dmdFilterMenuSetup(): DynamicDialogSetup {
		const operators: _FormData[] = [
			{ value: `eq`, display: `Is equal to` },
			{ value: `gt`, display: `Is greater than` },
			{ value: `gte`, display: `Is greater than or equal to` },
			{ value: `lt`, display: `Is less than` },
			{ value: `lte`, display: `Is less than or equal to` },
		];

		return new DynamicDialogSetup({
			title: `Filter: Price`,
			simple: false,
			backButtonText: `Clear`,
			submitButtonText: `Filter`,
			controls: namedControls([
				new DropDown({ formName: `firstOperator`, label: `Show items with value that`, value: `gt`, data: operators }),
				new DialogInput({ formName: `firstValue`, label: `Value`, inputType: `number` }),
				new CUSTButtonGroup({
					formName: `secondOperator`,
					value: ``,
					data: [
						{ value: `and`, display: `And` },
						{ value: `or`, display: `Or` },
					],
				}),
				new DropDown({ formName: `thirdOperator`, label: `Second condition`, value: `lt`, data: operators.slice(1), disabled: true }),
				new DialogInput({ formName: `secondValue`, label: `Second value`, inputType: `number`, disabled: true }),
			]),
		});
	}

	/** Form-type: text inputs with validators, a dependent validator (`validationDep`) and the service-driven autocomplete input. */
	public dmdTextFormSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Contact details`,
			instructionText: `Form-type setup: text inputs + validators. Email is only required while the phone number is empty (validationDep).`,
			submitButtonText: `Save`,
			controls: namedControls([
				new DialogInput({
					formName: `fullName`,
					label: `Full name`,
					hintText: `2 - 40 characters`,
					validators: [
						{ validator: ValidatorType.required, errorMessage: `Name is required` },
						{ validator: ValidatorType.minlength, value: 2, errorMessage: `At least 2 characters` },
						{ validator: ValidatorType.maxlength, value: 40, errorMessage: `At most 40 characters` },
					],
				}),
				new DialogInput({
					formName: `phone`,
					label: `Mobile number`,
					inputType: `tel`,
					hintText: `10 digits starting with 0`,
					validators: [{ validator: ValidatorType.pattern, value: `0[0-9]{9}`, errorMessage: `Not a valid mobile number` }],
				}),
				new DialogInput({
					formName: `contactEmail`,
					label: `Email`,
					inputType: `email`,
					validationDep: `phone`,
					validators: [
						{ validator: ValidatorType.required, errorMessage: `Email is required when no phone number is given` },
						{ validator: ValidatorType.email, errorMessage: `Not a valid email address` },
					],
				}),
				new DialogInput({
					formName: `age`,
					label: `Age`,
					inputType: `number`,
					validators: [
						{ validator: ValidatorType.min, value: 18, errorMessage: `Must be 18 or older` },
						{ validator: ValidatorType.max, value: 120, errorMessage: `Must be 120 or younger` },
					],
				}),
				new CurrencyShortHand({
					formName: `budget`,
					label: `Budget (thousands)`,
					hintText: `Type 250 for R250 000`,
					validators: [{ validator: ValidatorType.required, errorMessage: `Budget is required` }],
				}),
				new TextArea({
					formName: `notes`,
					label: `Notes`,
					placeholder: `Optional notes`,
					validators: [{ validator: ValidatorType.maxlength, value: 200, errorMessage: `At most 200 characters` }],
				}),
			]),
		});
	}

	/**
	 * Form-type: autocomplete input. Kept in its own setup because the component tracks a single
	 * search input (the first Input typed into wins), so other inputs in the same dialog would hijack it.
	 * Suggestions are pushed by the page through `DynamicDialogService`.
	 */
	public dmdAutoCompleteSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Assign sales executive`,
			instructionText: `Type a few letters (e.g. "al" or "th"); suggestions are supplied through DynamicDialogService.`,
			submitButtonText: `Assign`,
			controls: namedControls([
				new DialogInput({
					formName: `salesExec`,
					label: `Sales executive`,
					autoComplete: true,
					validators: [{ validator: ValidatorType.required, errorMessage: `Sales executive is required` }],
				}),
			]),
		});
	}

	/** Form-type: selection and date controls. Requires a `DateAdapter` in the dialog's injector. */
	public dmdPickerFormSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Book a test drive`,
			instructionText: `Form-type setup: dropdowns, grouped dropdown, radio and date pickers.`,
			submitButtonText: `Book`,
			controls: namedControls([
				new DropDown({
					formName: `branch`,
					label: `Branch`,
					data: [
						{ value: `ct`, display: `Cape Town` },
						{ value: `jhb`, display: `Johannesburg` },
						{ value: `dbn`, display: `Durban` },
					],
					validators: [{ validator: ValidatorType.required, errorMessage: `Pick a branch` }],
				}),
				new DropDown({
					formName: `extras`,
					label: `Extras (multiple)`,
					multiple: true,
					value: [`coffee`],
					data: [
						{ value: `coffee`, display: `Coffee` },
						{ value: `finance`, display: `Finance quote` },
						{ value: `tradeIn`, display: `Trade-in valuation` },
					],
				}),
				new DropDownGroups({
					formName: `vehicle`,
					label: `Vehicle`,
					groups: [
						{
							groupName: `Hatchbacks`,
							data: [
								{ value: `hatch-14`, display: `Hatchback 1.4` },
								{ value: `hatch-16`, display: `Hatchback 1.6` },
							],
						},
						{
							groupName: `SUVs`,
							data: [
								{ value: `suv-15t`, display: `SUV 1.5T` },
								{ value: `suv-20d`, display: `SUV 2.0D` },
							],
						},
					],
					validators: [{ validator: ValidatorType.required, errorMessage: `Pick a vehicle` }],
				}),
				new RadioButton({
					formName: `licence`,
					value: `code8`,
					data: [
						{ value: `code8`, display: `Code 8 (B)` },
						{ value: `code10`, display: `Code 10 (C1)` },
						{ value: `learner`, display: `Learner's only` },
					],
				}),
				new SingleDate({ formName: `preferredDate`, label: `Preferred date`, value: new Date(2026, 0, 15), disabledBefore: new Date(2026, 0, 1) }),
				new RangeDate({ formName: `availability`, label: `Availability window`, value: { start: new Date(2026, 0, 12), end: new Date(2026, 0, 23) } }),
				new DateTime({ formName: `slot`, label: `Slot`, value: new Date(2026, 0, 15, 10, 30) }),
			]),
		});
	}

	/** Form-type: filterable multi checkbox list (more than 5 options turns the search field on). */
	public dmdCheckboxSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Choose colours`,
			instructionText: `CheckBox control (multi, filterable). More than 5 options enables the search box.`,
			submitButtonText: `Apply`,
			controls: namedControls([
				new CheckBox({
					formName: `colours`,
					multi: true,
					filterable: true,
					value: [`red`],
					data: [
						{ value: `red`, display: `Red` },
						{ value: `orange`, display: `Orange` },
						{ value: `yellow`, display: `Yellow` },
						{ value: `green`, display: `Green` },
						{ value: `blue`, display: `Blue` },
						{ value: `indigo`, display: `Indigo` },
						{ value: `violet`, display: `Violet` },
					],
					validators: [{ validator: ValidatorType.required, errorMessage: `Pick at least one colour` }],
				}),
			]),
		});
	}

	/** Regression cases for AUD-06 (Slider/Upload field types) and AUD-08 (noSpace/phone validators, setup not mutated). */
	public dmdSliderUploadSetup(): DynamicDialogSetup {
		return new DynamicDialogSetup({
			title: `Slider, upload + validators`,
			instructionText: `Slider and Upload field types plus the noSpace and phone validator types.`,
			submitButtonText: `Submit`,
			controls: namedControls([
				new Slider({ formName: `deposit`, minValue: 0, maxValue: 50, increment: 5, value: 10 }),
				new DialogInput({
					formName: `username`,
					label: `Username (no spaces)`,
					validators: [{ validator: ValidatorType.noSpace, errorMessage: `Spaces are not allowed` }],
				}),
				new DialogInput({
					formName: `mobile`,
					label: `Mobile (phone validator)`,
					inputType: `tel`,
					validators: [{ validator: ValidatorType.phone, errorMessage: `10 digits starting with 0` }],
				}),
				new Upload({ formName: `attachments` }),
			]),
		});
	}

	// ---- dynamic-window -----------------------------------------------------------------------

	/** dynamic-window form: closes with the form value on submit, `false` on back. */
	public windowFormSetup(): DialogSetup {
		return new DialogSetup({
			instructionText: `Assign a lead`,
			optionSelected: `Lead #L-2026-0115`,
			additionalText: `Pick a sales executive or provide a mobile number.`,
			submitButtonText: `ASSIGN`,
			controls: [
				{ type: `Image`, formName: `banner`, imgUrl: `data:image/jpeg;base64,${SANDBOX_JPEG_BASE64}` },
				{
					type: `DropDown`,
					formName: `salesExec`,
					placeholder: `Sales executive`,
					data: [
						{ display: `Alice Botha`, value: `alice` },
						{ display: `Bongani Dlamini`, value: `bongani` },
						{ display: `Thabo Mokoena`, value: `thabo` },
					],
				},
				{ type: `Input`, formName: `mobile`, placeholder: `Mobile number`, validators: `phone`, validationDep: `salesExec` },
				{
					type: `BtnGroup`,
					formName: `priority`,
					value: `normal`,
					data: [
						{ display: `Low`, value: `low` },
						{ display: `Normal`, value: `normal` },
						{ display: `High`, value: `high` },
					],
				},
				{
					type: `MultiSelect`,
					formName: `tags`,
					placeholder: `Tags`,
					data: [
						{ displayText: `Finance`, value: `finance` },
						{ displayText: `Trade-in`, value: `tradeIn` },
						{ displayText: `Fleet`, value: `fleet` },
					],
				},
				{ type: `CurrencyShortHand`, formName: `budget`, placeholder: `Budget (thousands)`, required: true },
				{ type: `Slider`, formName: `deposit`, minValue: 0, maxValue: 100000, increment: 5000, value: 20000 },
				{ type: `SingleDate`, formName: `followUp`, placeholder: `Follow-up date`, value: new Date(2026, 0, 15), disabledBefore: new Date(2026, 0, 1) },
				{ type: `DateTime`, formName: `meeting`, placeholder: `Meeting`, value: `2026-01-15T10:30` },
				{
					type: `radio`,
					formName: `channel`,
					value: `phone`,
					data: [
						{ text: `phone`, label: `Phone`, value: `phone` },
						{ text: `email`, label: `Email`, value: `email` },
					],
				},
				{ type: `Checkbox`, formName: `urgent`, label: `Mark as urgent` },
				{ type: `TextArea`, formName: `note`, placeholder: `Note` },
			],
		});
	}

	/** dynamic-window approval: closes with `{ approval, comment }`. */
	public windowApprovalSetup(): DialogSetup {
		return new DialogSetup({
			instructionText: `Approve the price override?`,
			optionSelected: `STK-1002 - Sedan 2.0 - R 249 900`,
			hideSubmitButton: true,
			backButtonText: `CANCEL`,
			controls: [
				{ type: `TextArea`, formName: `comment`, placeholder: `Comment`, required: true },
				{ type: `approval`, formName: `approval` },
			],
		});
	}
}

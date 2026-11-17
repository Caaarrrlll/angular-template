import { CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, signal, Signal, WritableSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { InputCurrencyComponent } from "@shared/components/input/input-currency/input-currency.component";
import { InputEmailComponent } from "@shared/components/input/input-email/input-email.component";
import { InputNumberComponent } from "@shared/components/input/input-number/input-number.component";
import { InputPhoneComponent } from "@shared/components/input/input-phone/input-phone.component";
import { InputSelectComponent } from "@shared/components/input/input-select/input-select.component";
import { InputTextComponent } from "@shared/components/input/input-text/input-text.component";
import { InputComponent } from "@shared/components/input/input.component";
import { OptionComponent } from "@shared/components/select/option/option.component";
import { AutoFocusInputDirective } from "@shared/directives/auto-focus-input.directive";
import { CurrencyInputDirective } from "@shared/directives/currency-input.directive";
import { CurrencyMaskDirective } from "@shared/directives/currency-mask.directive";
import { DateTransformDirective } from "@shared/directives/date-transform.directive";
import { MinMaxDecimalDirective } from "@shared/directives/min-max-decimal.directive";
import { MinMaxDirective } from "@shared/directives/min-max.directive";
import { NDigitDecimalNumberDirective } from "@shared/directives/n-digit-decimal-number.directive";
import { NumericInputDirective } from "@shared/directives/numeric-input.directive";
import { CustButtonInputType, CustInputAdvance, CustInputGeneral, CustInputReturn, InputSelectOption } from "@shared/models/cust-basic-controls";

interface _SandboxActionEvent {
	action: string;
	parameters?: string[];
}

interface _SandboxDirectiveControls {
	numeric: FormControl<string | null>;
	minMax: FormControl<number | null>;
	minMaxDecimal: FormControl<string | null>;
	nDigit: FormControl<string | null>;
	currencyInput: FormControl<string | null>;
	currencyMask: FormControl<string | null>;
	dateTransform: FormControl<string | null>;
}

type _SandboxDirectiveValues = Partial<Record<keyof _SandboxDirectiveControls, string | number | null>>;

interface _SandboxDirectiveEntry {
	key: string;
	value: string | number | null | undefined;
}

interface _SandboxOption {
	label: string;
	value: string;
}

/** Sandbox family page: reactive-forms input controls, the select option, and the input directives. */
@Component({
	selector: "app-sandbox-inputs",
	templateUrl: "./sandbox-inputs.component.html",
	styleUrls: ["./sandbox-inputs.component.scss"],
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		SandboxPageComponent,
		SandboxDemoComponent,
		InputComponent,
		InputTextComponent,
		InputNumberComponent,
		InputCurrencyComponent,
		InputEmailComponent,
		InputPhoneComponent,
		InputSelectComponent,
		OptionComponent,
		AutoFocusInputDirective,
		CurrencyInputDirective,
		CurrencyMaskDirective,
		DateTransformDirective,
		MinMaxDirective,
		MinMaxDecimalDirective,
		NDigitDecimalNumberDirective,
		NumericInputDirective,
	],
	// CurrencyPipe is injected by the currencyInput directive; the native date adapter backs the input-text calendar mode.
	providers: [CurrencyPipe, provideNativeDateAdapter()],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxInputsComponent {
	// ---- input-text ----
	public readonly textRequired: CustInputAdvance = {
		inputControl: new FormControl<string | null>(``),
		validations: [Validators.required.bind(Validators), Validators.minLength(3)],
		errors: [
			{ name: `required`, message: `Name is required` },
			{ name: `minlength`, message: `At least 3 characters` },
		],
		clear: true,
		maxlen: 20,
	};
	public readonly textPrefilled: CustInputAdvance = {
		inputControl: new FormControl<string | null>(`Jane Doe`),
		validations: [],
		errors: [],
		clear: true,
	};
	public readonly textReadOnly: CustInputAdvance = {
		inputControl: new FormControl<string | null>(`Read-only value`),
		validations: [],
		errors: [],
		clear: true,
	};
	public readonly textWithAction: CustInputAdvance = {
		inputControl: new FormControl<string | null>(``),
		validations: [],
		errors: [],
	};
	public readonly textCalendar: CustInputAdvance = {
		inputControl: new FormControl<Date | null>(new Date(2026, 0, 15)),
		validations: [],
		errors: [],
	};
	public readonly searchAction: CustButtonInputType = { icon: `search`, tooltip: `Search`, display: `Search`, value: `search`, disabled: false, parameters: [`demo`] };
	public readonly calendarAction: CustButtonInputType = { icon: `calendar_today`, tooltip: `Pick a date`, display: `Calendar`, value: `calendar`, disabled: false };
	public readonly textRequiredValue: Signal<string | null> = toSignal(this.textRequired.inputControl.valueChanges, { initialValue: null });
	public readonly textDisabled: WritableSignal<boolean> = signal<boolean>(false);
	public readonly textLog: SandboxEventLog = new SandboxEventLog();

	// ---- input-number ----
	public readonly numberRanged: CustInputAdvance = {
		inputControl: new FormControl<number | null>(null),
		validations: [Validators.required.bind(Validators), Validators.min(1), Validators.max(100)],
		errors: [
			{ name: `required`, message: `Quantity is required` },
			{ name: `min`, message: `Minimum is 1` },
			{ name: `max`, message: `Maximum is 100` },
		],
		clear: true,
	};
	public readonly numberText: CustInputAdvance = {
		inputControl: new FormControl<string | null>(`42`),
		validations: [],
		errors: [],
		clear: true,
	};
	public readonly numberRangedValue: Signal<number | null> = toSignal(this.numberRanged.inputControl.valueChanges, { initialValue: null });

	// ---- input-currency ----
	public readonly currencyEmpty: CustInputAdvance = {
		inputControl: new FormControl<string | null>(``),
		validations: [Validators.pattern(/^\d+(\.\d{1,2})?$/)],
		errors: [{ name: `pattern`, message: `Use a number with up to 2 decimals` }],
		clear: true,
	};
	public readonly currencyUsd: CustInputAdvance = {
		inputControl: new FormControl<string | null>(`1250.50`),
		validations: [],
		errors: [],
		clear: true,
	};
	public readonly currencyValue: Signal<string | null> = toSignal(this.currencyEmpty.inputControl.valueChanges, { initialValue: null });

	// ---- input-email / input-phone / input-select (CustInputGeneral API) ----
	public readonly emailEmpty: CustInputGeneral = { label: `Email`, placeholder: `name@example.com` };
	public readonly emailPrefilled: CustInputGeneral = { label: `Email (prefilled)`, value: `jane.doe@example.com` };
	public readonly emailReadOnly: CustInputGeneral = { label: `Email (read-only)`, value: `locked@example.com`, isReadOnly: true };
	public readonly phoneTen: CustInputGeneral = { label: `Phone (10 digits)`, placeholder: `0821234567`, minlength: 10 };
	public readonly phoneAny: CustInputGeneral = { label: `Phone (any digits, prefilled)`, value: `0115550000` };
	public readonly selectOptions: InputSelectOption[] = [
		{ display: `Johannesburg`, value: `jhb` },
		{ display: `Cape Town`, value: `cpt` },
		{ display: `Durban`, value: `dbn` },
	];
	public readonly selectEmpty: CustInputGeneral = { label: `City`, inputList: this.selectOptions };
	public readonly selectPrefilled: CustInputGeneral = { label: `City (prefilled)`, inputList: this.selectOptions, value: `cpt` };
	public readonly selectReadOnly: CustInputGeneral = { label: `City (read-only)`, inputList: this.selectOptions, value: `dbn`, isReadOnly: true };
	public readonly generalLog: SandboxEventLog = new SandboxEventLog();

	// ---- select option ----
	public readonly radioOptions: _SandboxOption[] = [
		{ label: `Small`, value: `s` },
		{ label: `Medium`, value: `m` },
		{ label: `Large`, value: `l` },
	];
	public readonly optionLog: SandboxEventLog = new SandboxEventLog();

	// ---- app-input (floating-label wrapper) + autoFocus ----
	public readonly showAutoFocus: WritableSignal<boolean> = signal<boolean>(false);

	// ---- directives ----
	public readonly directiveForm: FormGroup<_SandboxDirectiveControls> = new FormGroup<_SandboxDirectiveControls>({
		numeric: new FormControl<string | null>(``),
		minMax: new FormControl<number | null>(null),
		minMaxDecimal: new FormControl<string | null>(``),
		nDigit: new FormControl<string | null>(``),
		currencyInput: new FormControl<string | null>(`1500`),
		currencyMask: new FormControl<string | null>(``),
		dateTransform: new FormControl<string | null>(`2026-01-15`),
	});
	public readonly directiveValues: Signal<_SandboxDirectiveValues> = toSignal(this.directiveForm.valueChanges, { initialValue: this.directiveForm.getRawValue() });

	public readonly directiveEntries: Signal<_SandboxDirectiveEntry[]> = computed((): _SandboxDirectiveEntry[] =>
		Object.entries(this.directiveValues()).map(([key, value]: [string, string | number | null | undefined]): _SandboxDirectiveEntry => ({ key, value })),
	);

	public onTextAction(event: _SandboxActionEvent): void {
		this.textLog.add(`actionOut: ${event.action}${event.parameters ? ` [${event.parameters.join(`, `)}]` : ``}`);
	}

	public toggleTextDisabled(): void {
		const disabled = !this.textDisabled();
		this.textDisabled.set(disabled);
		if (disabled) {
			this.textPrefilled.inputControl.disable();
		} else {
			this.textPrefilled.inputControl.enable();
		}
	}

	public revealErrors(): void {
		this.textRequired.inputControl.markAsTouched();
		this.numberRanged.inputControl.markAsTouched();
		this.currencyEmpty.inputControl.markAsTouched();
	}

	public onGeneralChanged(source: string, event: CustInputReturn): void {
		this.generalLog.add(`${source} inputChanged: ${JSON.stringify(event)}`);
	}

	public onOptionSelected(source: string, value: unknown): void {
		this.optionLog.add(`${source} selected: ${String(value)}`);
	}

	public toggleAutoFocus(): void {
		this.showAutoFocus.update((shown: boolean): boolean => !shown);
	}
}

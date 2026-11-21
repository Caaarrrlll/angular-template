import { CurrencyPipe, getCurrencySymbol, JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, signal, Signal, WritableSignal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DateRange } from "@angular/material/datepicker";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { _SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { CheckboxGroupComponent } from "@shared/components/checkbox-group/checkbox-group.component";
import { CheckboxComponent } from "@shared/components/checkbox-group/checkbox/checkbox.component";
import { RangeCheckboxGroupComponent } from "@shared/components/range-checkbox-group/range-checkbox-group.component";
import { _RangeCheckboxValue } from "@shared/components/range-checkbox-group/range-checkbox-group.interface";
import { RangeCheckboxComponent } from "@shared/components/range-checkbox-group/range-checkbox/range-checkbox.component";
import { RangeDatePickerComponent } from "@shared/components/range-date-picker/range-date-picker.component";
import { RangeSliderComponent } from "@shared/components/range-slider/range-slider.component";
import { TimeSpanPickerComponent } from "@shared/components/time-span-picker/time-span-picker.component";

interface _SandboxCheckboxOption {
	label: string;
	value: string;
}

interface _SandboxRangeOption {
	label: string;
	value: _RangeCheckboxValue;
}

interface _SandboxSliderValues {
	minValue: number;
	maxValue: number;
}

/** Sandbox family page: checkbox groups, range date picker, time-span picker and range slider. */
@Component({
	selector: "app-sandbox-selection",
	templateUrl: "./sandbox-selection.component.html",
	styleUrls: ["./sandbox-selection.component.scss"],
	imports: [
		JsonPipe,
		ReactiveFormsModule,
		SandboxPageComponent,
		SandboxDemoComponent,
		CheckboxGroupComponent,
		CheckboxComponent,
		RangeCheckboxGroupComponent,
		RangeCheckboxComponent,
		RangeDatePickerComponent,
		TimeSpanPickerComponent,
		RangeSliderComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxSelectionComponent {
	// ---- checkbox-group (ControlValueAccessor) ----
	public readonly fruitOptions: _SandboxCheckboxOption[] = [
		{ label: `Apple`, value: `apple` },
		{ label: `Banana`, value: `banana` },
		{ label: `Cherry`, value: `cherry` },
	];
	public readonly singleControl: FormControl<string[] | null> = new FormControl<string[] | null>([`banana`]);
	public readonly multiControl: FormControl<string[] | null> = new FormControl<string[] | null>([`apple`, `cherry`]);
	public readonly singleValue: Signal<string[] | null> = toSignal(this.singleControl.valueChanges, { initialValue: this.singleControl.value });
	public readonly multiValue: Signal<string[] | null> = toSignal(this.multiControl.valueChanges, { initialValue: this.multiControl.value });
	public readonly checkboxLog: _SandboxEventLog = new _SandboxEventLog();

	// ---- range-checkbox-group (ControlValueAccessor) ----
	public readonly priceOptions: _SandboxRangeOption[] = [
		{ label: `R0 - R1 000`, value: { min: 0, max: 1000 } },
		{ label: `R1 000 - R5 000`, value: { min: 1000, max: 5000 } },
		{ label: `R5 000 - R10 000`, value: { min: 5000, max: 10000 } },
	];
	public readonly rangeSingleControl: FormControl<_RangeCheckboxValue[] | null> = new FormControl<_RangeCheckboxValue[] | null>([]);
	public readonly rangeMultiControl: FormControl<_RangeCheckboxValue[] | null> = new FormControl<_RangeCheckboxValue[] | null>([{ min: 0, max: 1000 }]);
	public readonly rangeSingleValue: Signal<_RangeCheckboxValue[] | null> = toSignal(this.rangeSingleControl.valueChanges, { initialValue: this.rangeSingleControl.value });
	public readonly rangeMultiValue: Signal<_RangeCheckboxValue[] | null> = toSignal(this.rangeMultiControl.valueChanges, { initialValue: this.rangeMultiControl.value });
	public readonly rangeCheckboxLog: _SandboxEventLog = new _SandboxEventLog();

	// ---- range-date-picker ----
	public readonly initialRange: DateRange<Date> = new DateRange<Date>(new Date(2026, 0, 10), new Date(2026, 0, 15));
	public readonly dateRangeLog: _SandboxEventLog = new _SandboxEventLog();

	// ---- time-span-picker (ControlValueAccessor) ----
	public readonly timeSpanControl: FormControl<string | null> = new FormControl<string | null>(`01.02:30:00`);
	public readonly timeSpanValue: Signal<string | null> = toSignal(this.timeSpanControl.valueChanges, { initialValue: this.timeSpanControl.value });
	public readonly timeSpanDisabled: WritableSignal<boolean> = signal<boolean>(false);
	public readonly timeSpanLog: _SandboxEventLog = new _SandboxEventLog();

	// ---- range-slider ----
	public readonly sliderLog: _SandboxEventLog = new _SandboxEventLog();
	/** Slider unit and labels follow the app currency (`DEFAULT_CURRENCY_CODE`), formatted by CurrencyPipe. */
	private readonly currencyPipe = new CurrencyPipe(inject(LOCALE_ID), inject(DEFAULT_CURRENCY_CODE));
	// eslint-disable-next-line @typescript-eslint/no-deprecated -- CurrencyPipe cannot return the symbol alone
	public readonly currencySymbol: string = getCurrencySymbol(inject(DEFAULT_CURRENCY_CODE), `narrow`, inject(LOCALE_ID));
	public readonly formatPrice: (value: number) => string = (value: number): string => this.currencyPipe.transform(value, undefined, `symbol-narrow`, `1.0-0`) ?? String(value);

	public constructor() {
		this.singleControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: string[] | null): void => {
			this.checkboxLog.add(`single valueChanges: ${JSON.stringify(value)}`);
		});
		this.multiControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: string[] | null): void => {
			this.checkboxLog.add(`multi valueChanges: ${JSON.stringify(value)}`);
		});
		this.rangeSingleControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: _RangeCheckboxValue[] | null): void => {
			this.rangeCheckboxLog.add(`single valueChanges: ${JSON.stringify(value)}`);
		});
		this.rangeMultiControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: _RangeCheckboxValue[] | null): void => {
			this.rangeCheckboxLog.add(`multi valueChanges: ${JSON.stringify(value)}`);
		});
		this.timeSpanControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: string | null): void => {
			this.timeSpanLog.add(`control valueChanges: ${String(value)}`);
		});
	}

	public setCheckboxesProgrammatically(): void {
		this.singleControl.setValue([`cherry`]);
		this.multiControl.patchValue([`banana`]);
	}

	public resetCheckboxes(): void {
		this.singleControl.setValue([]);
		this.multiControl.setValue([]);
	}

	public setRangesProgrammatically(): void {
		this.rangeSingleControl.setValue([{ min: 5000, max: 10000 }]);
		this.rangeMultiControl.patchValue([
			{ min: 1000, max: 5000 },
			{ min: 5000, max: 10000 },
		]);
	}

	public onDateRangeChange(range: DateRange<Date> | undefined): void {
		this.dateRangeLog.add(`selectedRangeValueChange: ${range?.start?.toDateString() ?? `null`} -> ${range?.end?.toDateString() ?? `null`}`);
	}

	public setTimeSpanProgrammatically(): void {
		this.timeSpanControl.setValue(`02.12:45:00`);
	}

	public toggleTimeSpanDisabled(): void {
		const disabled = !this.timeSpanDisabled();
		this.timeSpanDisabled.set(disabled);
		if (disabled) {
			this.timeSpanControl.disable();
		} else {
			this.timeSpanControl.enable();
		}
	}

	public onTimeSpanChange(source: string, value: string): void {
		this.timeSpanLog.add(`${source} valueChange: ${value}`);
	}

	public onSliderChange(source: string, values: _SandboxSliderValues): void {
		this.sliderLog.add(`${source} valueChange: ${String(values.minValue)} - ${String(values.maxValue)}`);
	}
}

import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { CountDownComponent } from "@shared/components/count-down/count-down.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { NumericUpDownComponent } from "@shared/components/numeric-up-down/numeric-up-down.component";
import { SlideToggleComponent } from "@shared/components/slide-toggle/slide-toggle.component";
import { CustInputGeneral, CustInputReturn } from "@shared/models/cust-basic-controls";
import { PercentagePipe } from "@shared/pipes/percentage/percentage.pipe";
import { ThousandSeparatorPipe } from "@shared/pipes/thousand-separator/thousand-separator.pipe";

interface _CurrencySample {
	label: string;
	amount: string | number;
	currencyCode: string;
	digitsInfo: string;
}

interface _CountDownPreset {
	label: string;
	seconds: number;
}

@Component({
	selector: "app-sandbox-small-controls",
	templateUrl: "./sandbox-small-controls.component.html",
	styleUrls: ["./sandbox-small-controls.component.scss"],
	imports: [
		SandboxPageComponent,
		SandboxDemoComponent,
		LoaderComponent,
		CurrencyComponent,
		SlideToggleComponent,
		NumericUpDownComponent,
		CountDownComponent,
		ThousandSeparatorPipe,
		PercentagePipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxSmallControlsComponent {
	public readonly slideToggleLog = new SandboxEventLog();
	public readonly numericLog = new SandboxEventLog();
	public readonly countDownLog = new SandboxEventLog();

	public readonly loaderSizes: (number | undefined)[] = [undefined, 16, 32, 48];

	public readonly defaultCurrencyAmount: number = 1234567;

	public readonly currencySamples: _CurrencySample[] = [
		{ label: `USD, 1.2-2`, amount: 1234567.891, currencyCode: `USD`, digitsInfo: `1.2-2` },
		{ label: `EUR, string amount`, amount: `98765.4`, currencyCode: `EUR`, digitsInfo: `1.1-1` },
		{ label: `ZAR, 1.2-2, zero`, amount: 0, currencyCode: `ZAR`, digitsInfo: `1.2-2` },
	];

	public readonly slideToggleOff: CustInputGeneral = { label: `Notifications (off)` };
	public readonly slideToggleOn: CustInputGeneral = { label: `Dark mode (on)`, value: `true` };

	public readonly quantityStep: number = 5;
	public readonly quantityMax: number = 100;
	public readonly quantity: WritableSignal<number> = signal<number>(25);

	/** numeric-up-down only exposes a callback input, so the demo passes one that writes the signal. */
	public readonly setQuantity = (value: number): void => {
		this.quantity.set(value);
		this.numericLog.add(`upDownCallback: ${String(value)}`);
	};

	public readonly countDownPresets: _CountDownPreset[] = [
		{ label: `15 seconds`, seconds: 15 },
		{ label: `90 seconds`, seconds: 90 },
		{ label: `1 hour`, seconds: 3600 },
		{ label: `2 days`, seconds: 172800 },
	];

	public readonly countDownSeconds: WritableSignal<number> = signal<number>(90);

	public onSlideToggleChanged(name: string, result: CustInputReturn): void {
		this.slideToggleLog.add(`${name} inputChanged: ${result.value}`);
	}

	public onTimeRemaining(name: string, seconds: number): void {
		// one entry every 5 seconds (and at zero) keeps the log readable
		if (seconds % 5 === 0) {
			this.countDownLog.add(`${name} timeRemaining: ${String(seconds)}`);
		}
	}
}

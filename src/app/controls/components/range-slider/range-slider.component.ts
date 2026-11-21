import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";

interface _RangeSliderValues {
	minValue: number;
	maxValue: number;
}

@Component({
	selector: "app-range-slider",
	templateUrl: "./range-slider.component.html",
	styleUrls: ["./range-slider.component.scss"],
	imports: [MatSliderModule, MatFormFieldModule, MatInputModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeSliderComponent implements OnInit {
	@Input() public disabled = false;
	@Input() public color: ThemePalette = "primary";
	@Input() public unit?: string;
	@Input() public min = 0;
	@Input() public max = 100;
	/** Initial lower value; defaults to `min`. */
	@Input() public minValue?: number;
	/** Initial upper value; defaults to `max`. */
	@Input() public maxValue?: number;
	@Input() public step = 10;
	@Input() public displayWith: (value: number) => string = (value: number): string => String(value);
	@Input() public prefix?: boolean;
	@Input() public suffix?: boolean;
	@Output() public valueChange: EventEmitter<_RangeSliderValues> = new EventEmitter<_RangeSliderValues>();

	public values: _RangeSliderValues = { minValue: 0, maxValue: 100 };

	// Built here, not in a field initialiser: inputs are not set yet when the class is constructed (AUD-11).
	public ngOnInit(): void {
		this.reset();
	}

	public minUpdated(value: number): void {
		this.applyMin(value);
		this.valueChange.emit({ ...this.values });
	}

	public maxUpdated(value: number): void {
		this.applyMax(value);
		this.valueChange.emit({ ...this.values });
	}

	public minInputUpdated(input: HTMLInputElement): void {
		this.applyMin(Number(input.value));
		this.valueChange.emit({ ...this.values });
	}

	public maxInputUpdated(input: HTMLInputElement): void {
		this.applyMax(Number(input.value));
		this.valueChange.emit({ ...this.values });
	}

	public reset(): void {
		this.values = {
			minValue: this.minValue ?? this.min,
			maxValue: this.maxValue ?? this.max,
		};
	}

	private applyMin(value: number): void {
		if (value >= this.values.maxValue) {
			this.values.minValue = this.values.maxValue - 1;
		} else if (value < this.min) {
			this.values.minValue = this.min;
		} else {
			this.values.minValue = value;
		}
	}

	private applyMax(value: number): void {
		if (value <= this.values.minValue) {
			this.values.maxValue = this.values.minValue + 1;
		} else if (value > this.max) {
			this.values.maxValue = this.max;
		} else {
			this.values.maxValue = value;
		}
	}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSliderModule } from "@angular/material/slider";

interface RangeSliderValues {
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
export class RangeSliderComponent {
	@Input() public disabled: boolean = false;
	@Input() public color: ThemePalette = "primary";
	@Input() public unit?: string;
	@Input() public min: number = 0;
	@Input() public max: number = 100;
	@Input() public minValue: number = this.min;
	@Input() public maxValue: number = this.max;
	@Input() public step: number = 10;
	@Input() public displayWith: (value: number) => string = (value: number): string => String(value);
	@Input() public prefix?: boolean;
	@Input() public suffix?: boolean;
	@Output() public valueChange: EventEmitter<RangeSliderValues> = new EventEmitter<RangeSliderValues>();

	public values: RangeSliderValues = { minValue: this.minValue, maxValue: this.maxValue };

	public minUpdated(value: number): void {
		this.applyMin(value);
		this.valueChange.emit(this.values);
	}

	public maxUpdated(value: number): void {
		this.applyMax(value);
		this.valueChange.emit(this.values);
	}

	public minInputUpdated(input: HTMLInputElement): void {
		this.applyMin(Number(input.value));
		this.valueChange.emit(this.values);
	}

	public maxInputUpdated(input: HTMLInputElement): void {
		this.applyMax(Number(input.value));
		this.valueChange.emit(this.values);
	}

	public reset(): void {
		this.values = {
			minValue: this.minValue,
			maxValue: this.maxValue,
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

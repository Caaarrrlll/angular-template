import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";

interface RangeSliderValues {
	minValue: number;
	maxValue: number;
}

@Component({
	selector: "app-range-slider",
	templateUrl: "./range-slider.component.html",
	styleUrls: ["./range-slider.component.scss"],
})
export class RangeSliderComponent implements OnInit, OnDestroy {
	@Input() disabled = false;
	@Input() color = "primary";
	@Input() unit;
	@Input() min = 0;
	@Input() max = 100;
	@Input() minValue = this.min;
	@Input() maxValue = this.max;
	@Input() step = 10;
	@Input() displayWith;
	@Input() vertical = false;
	@Input() suffix;
	@Input() prefix;
	@Output() valueChange: EventEmitter<RangeSliderValues> = new EventEmitter();
	values: RangeSliderValues;
	destroy$ = new Subject();

	constructor(private changeDetector: ChangeDetectorRef) {}

	ngOnInit() {
		this.values = {
			minValue: this.minValue,
			maxValue: this.maxValue,
		};
	}

	isValidMin(event) {
		this.values.minValue = event.target.value;
		this.changeDetector.detectChanges();
		if (event.target.value >= this.min && event.target.value <= this.values.maxValue) {
			this.values.minValue = event.target.value;
		} else if (event.target.value < this.min) {
			this.values.minValue = this.min;
		} else if (event.target.value > this.values.maxValue) {
			this.values.minValue = this.values.maxValue - 1;
		}
		this.changeDetector.detectChanges();
	}

	isValidMax(event) {
		this.values.maxValue = event.target.value;
		this.changeDetector.detectChanges();
		if (event.target.value >= this.values.minValue && event.target.value <= this.max) {
			this.values.maxValue = event.target.value;
		} else if (event.target.value < this.values.minValue) {
			this.values.maxValue = this.values.minValue + 1;
		} else if (event.target.value > this.max) {
			this.values.maxValue = this.max;
		}
		this.changeDetector.detectChanges();
	}

	minUpdated(event) {
		if (!(event.value < this.values.maxValue)) {
			this.values.minValue = this.values.maxValue - 1;
		} else {
			this.isValidMin({
				target: { value: +event.value },
			});
		}
		this.valueChange.emit(this.values);
	}

	maxUpdated(event) {
		if (!(event.value > this.values.minValue)) {
			this.values.maxValue = this.values.minValue + 1;
		} else {
			this.isValidMax({
				target: { value: +event.value },
			});
		}
		this.valueChange.emit(this.values);
	}

	minInputUpdated(event) {
		if (!(event.target.value < this.values.maxValue)) {
			this.values.minValue = this.values.maxValue - 1;
		} else {
			this.isValidMin({
				target: { value: +event.target.value },
			});
		}
		this.valueChange.emit(this.values);
	}

	maxInputUpdated(event) {
		if (!(event.target.value > this.values.minValue)) {
			this.values.maxValue = this.values.minValue + 1;
		} else {
			this.isValidMax({
				target: { value: +event.target.value },
			});
		}
		this.valueChange.emit(this.values);
	}

	reset() {
		this.values = {
			minValue: this.minValue,
			maxValue: this.maxValue,
		};
	}

	ngOnDestroy() {
		this.destroy$.next(null);
		this.destroy$.complete();
	}
}

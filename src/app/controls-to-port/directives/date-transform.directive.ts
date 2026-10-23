import { DatePipe } from "@angular/common";
import { AfterViewInit, Directive, ElementRef, HostListener, Input, NgModule } from "@angular/core";

@Directive({
	selector: "[dateTransform]",
	providers: [DatePipe],
})
export class DateTransformDirective implements AfterViewInit {
	@Input() dateTransform: string = "";
	constructor(private _elementRef: ElementRef, private _datePipe: DatePipe) {}

	ngAfterViewInit(): void {
		this._elementRef.nativeElement.value = this._datePipe.transform(this._elementRef.nativeElement.value, this.dateTransform);
	}

	@HostListener("ngModelChange") change(): void {
		if (Number.isNaN(Date.parse(this._elementRef.nativeElement.value))) return;
		this._elementRef.nativeElement.value = this._datePipe.transform(this._elementRef.nativeElement.value, this.dateTransform);
	}
}

@NgModule({
	imports: [],
	declarations: [DateTransformDirective],
	exports: [DateTransformDirective],
})
export class DateTransformDirectiveModule {}

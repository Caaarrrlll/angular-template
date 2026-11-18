import { DatePipe } from "@angular/common";
import { AfterViewInit, Directive, ElementRef, HostListener, Input, inject } from "@angular/core";

@Directive({
	selector: "[appDateTransform]",
	providers: [DatePipe],
})
export class DateTransformDirective implements AfterViewInit {
	@Input() appDateTransform = "";
	private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	private readonly datePipe = inject(DatePipe);

	ngAfterViewInit(): void {
		this.elementRef.nativeElement.value = this.datePipe.transform(this.elementRef.nativeElement.value, this.appDateTransform) ?? "";
	}

	@HostListener("ngModelChange") change(): void {
		if (Number.isNaN(Date.parse(this.elementRef.nativeElement.value))) return;
		this.elementRef.nativeElement.value = this.datePipe.transform(this.elementRef.nativeElement.value, this.appDateTransform) ?? "";
	}
}

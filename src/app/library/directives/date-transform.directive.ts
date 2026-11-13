import { DatePipe } from "@angular/common";
import { AfterViewInit, Directive, ElementRef, HostListener, Input, inject } from "@angular/core";

@Directive({
	selector: "[dateTransform]",
	providers: [DatePipe],
	standalone: true,
})
export class DateTransformDirective implements AfterViewInit {
	@Input() dateTransform: string = "";
	private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	private readonly datePipe = inject(DatePipe);

	ngAfterViewInit(): void {
		this.elementRef.nativeElement.value = this.datePipe.transform(this.elementRef.nativeElement.value, this.dateTransform) ?? "";
	}

	@HostListener("ngModelChange") change(): void {
		if (Number.isNaN(Date.parse(this.elementRef.nativeElement.value))) return;
		this.elementRef.nativeElement.value = this.datePipe.transform(this.elementRef.nativeElement.value, this.dateTransform) ?? "";
	}
}

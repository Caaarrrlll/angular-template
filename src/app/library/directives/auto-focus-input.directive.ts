import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
	selector: "[autoFocus]",
	standalone: true,
})
export class AutoFocusInputDirective implements AfterViewInit {
	private readonly elementRef = inject(ElementRef);

	ngAfterViewInit(): void {
		this.elementRef.nativeElement.focus();
	}
}

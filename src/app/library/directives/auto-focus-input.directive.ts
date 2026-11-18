import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
	selector: "[appAutoFocus]",
	standalone: true,
})
export class AutoFocusInputDirective implements AfterViewInit {
	private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	ngAfterViewInit(): void {
		this.elementRef.nativeElement.focus();
	}
}

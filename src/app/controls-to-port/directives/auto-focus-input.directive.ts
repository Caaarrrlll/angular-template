import { AfterViewInit, Directive, ElementRef, NgModule } from "@angular/core";

@Directive({
	selector: "[autoFocus]",
})
export class AutoFocusInputDirective implements AfterViewInit {
	private inputElement: HTMLElement;

	constructor(private elementRef: ElementRef) {
		this.inputElement = this.elementRef.nativeElement;
	}

	ngAfterViewInit() {
		this.inputElement.focus();
	}
}

@NgModule({
	imports: [],
	declarations: [AutoFocusInputDirective],
	exports: [AutoFocusInputDirective],
})
export class AutoFocusInputDirectiveModule {}

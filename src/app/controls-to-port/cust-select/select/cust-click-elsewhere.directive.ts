import { Directive, Output, EventEmitter, ElementRef, HostListener } from "@angular/core";

@Directive({
	selector: "[appCustClickElsewhere]",
})
export class CustClickElsewhereDirective {
	@Output() clickElsewhere = new EventEmitter<MouseEvent>();

	constructor(private elementRef: ElementRef) {}

	@HostListener("document:click", ["$event"])
	public onDocumentClick(event: MouseEvent): void {
		const targetElement = event.target as HTMLElement;

		// Check if the click was outside the element
		if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
			this.clickElsewhere.emit(event);
		}
	}
}

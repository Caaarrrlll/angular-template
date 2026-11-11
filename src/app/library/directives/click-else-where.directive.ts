import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from "@angular/core";

@Directive({
	selector: "[appClickElsewhere]",
	standalone: true,
})
export class ClickElseWhereDirective {
	@Output() public clickElsewhere: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	@HostListener("document:click", ["$event"])
	public onDocumentClick(event: MouseEvent): void {
		const targetElement: HTMLElement | null = event.target as HTMLElement | null;
		if (targetElement !== null && !this.elementRef.nativeElement.contains(targetElement)) {
			this.clickElsewhere.emit(event);
		}
	}
}

import { Clipboard } from "@angular/cdk/clipboard";
import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, inject } from "@angular/core";
import { SnackbarService } from "@shared/services/snackbar.service";

@Directive({
	selector: "[copyText]",
	standalone: true,
})
export class CopyTextDirective implements AfterViewInit, OnChanges {
	// IF USING IN A GRID OR COMPONENT WHERE CHANGE DETECTION MIGHT BE
	// AN ISSUE BIND TO THE INPUT INSTEAD OF USING --> this.element.textContent
	// THIS WILL MAKE SURE THE MOST UP TO DATE VALUE IS USED
	@Input() copyText = "";
	private readonly clipboard = inject(Clipboard);
	private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly snackbar = inject(SnackbarService);
	private readonly renderer = inject(Renderer2);

	private readonly element = this.elementRef.nativeElement;
	private copyIcon: HTMLElement | undefined;
	private text = "";

	constructor() {
		this.renderer.addClass(this.element, "copyAndPasteElement");
	}

	ngAfterViewInit(): void {
		this.updateText();
		this.createIconAndApplyCSSClasses();
	}

	ngOnChanges(): void {
		this.updateText();
	}

	private updateText(): void {
		this.text = this.copyText ? this.copyText : (this.element.textContent ?? "");
		this.renderer.setAttribute(this.element, "title", 'Click to copy "' + this.text + '"');
	}

	createIconAndApplyCSSClasses() {
		this.copyIcon = this.renderer.createElement("mat-icon");
		this.renderer.appendChild(this.copyIcon, this.renderer.createText("content_copy"));
		this.renderer.addClass(this.copyIcon, "mat-icon");
		this.renderer.addClass(this.copyIcon, "material-icons");
		this.renderer.addClass(this.copyIcon, "copyAndPasteIcon");
		this.renderer.appendChild(this.element, this.copyIcon);
	}

	@HostListener("click", ["$event"]) onClick(event: MouseEvent): void {
		if (this.text) {
			this.clipboard.copy(this.text);
			this.snackbar.open('Copied "' + this.text + '" to the clipboard', "success", 1500);
		} else {
			this.snackbar.open("No text to copy!");
		}
	}

	@HostListener("mouseenter") onMouseEnter() {
		if (this.copyIcon) this.renderer.addClass(this.copyIcon, "copyAndPasteIconActive");
	}

	@HostListener("mouseleave") onMouseLeave() {
		if (this.copyIcon) this.renderer.removeClass(this.copyIcon, "copyAndPasteIconActive");
	}
}

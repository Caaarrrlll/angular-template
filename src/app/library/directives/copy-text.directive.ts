import { Clipboard, ClipboardModule } from "@angular/cdk/clipboard";
import { AfterViewInit, Directive, ElementRef, HostListener, Input, NgModule, OnChanges, Renderer2 } from "@angular/core";
import { SnackbarService } from "@services/snackbar.service";

@Directive({
	selector: "[copyText]",
})
export class CopyTextDirective implements AfterViewInit, OnChanges {
	// IF USING IN A GRID OR COMPONENT WHERE CHANGE DETECTION MIGHT BE
	// AN ISSUE BIND TO THE INPUT INSTEAD OF USING --> this.element.textContent
	// THIS WILL MAKE SURE THE MOST UP TO DATE VALUE IS USED
	@Input() copyText: string;
	private element: any;
	private copyIcon: any;
	private text: string;

	constructor(private clipboard: Clipboard, private elementRef: ElementRef, private snackbar: SnackbarService, private renderer: Renderer2) {
		this.element = this.elementRef.nativeElement;
		this.renderer.addClass(this.element, "copyAndPasteElement");
	}

	ngAfterViewInit(): void {
		this.text = this.copyText ? this.copyText : this.element.textContent;
		this.renderer.setAttribute(this.element, "title", 'Click to copy "' + this.text + '"');
		this.createIconAndApplyCSSClasses();
	}

	ngOnChanges() {
		this.text = this.copyText ? this.copyText : this.element.textContent;
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
		this.renderer.addClass(this.copyIcon, "copyAndPasteIconActive");
	}

	@HostListener("mouseleave") onMouseLeave() {
		this.renderer.removeClass(this.copyIcon, "copyAndPasteIconActive");
	}
}

@NgModule({
	imports: [ClipboardModule],
	declarations: [CopyTextDirective],
	exports: [CopyTextDirective],
})
export class CopyTextDirectiveModule {}

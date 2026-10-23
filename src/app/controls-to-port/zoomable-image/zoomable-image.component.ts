import { AfterContentInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, Renderer2, SecurityContext, ViewChild } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
	selector: "app-zoomable-image",
	templateUrl: "./zoomable-image.component.html",
	styleUrls: ["./zoomable-image.component.scss"],
})
export class ZoomableImageComponent implements AfterContentInit, OnDestroy {
	@Input() src: string;
	@Input() allowZoom = true;
	@Input() count: string;

	@Output() onClick = new EventEmitter();

	@Output() next = new EventEmitter();
	@Output() prev = new EventEmitter();

	cx: number;
	cy: number;
	backgroundImage: SafeStyle;
	backgroundSize: string;
	backgroundPosition: string;
	lensLeft: string;
	lensTop: string;
	resultLeft: string;
	resultTop: string;
	magnification = 1;
	showZoomLens = false;
	showLightbox = false;

	private eventListeners: (() => void)[] = [];

	@ViewChild("zoomContainer", { static: true }) zoomContainer!: ElementRef;
	@ViewChild("image") image!: ElementRef;
	@ViewChild("result") result!: ElementRef;
	@ViewChild("lens") lens!: ElementRef;

	@HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(event: KeyboardEvent) {
		this.showLightbox = false;
	}

	@HostListener("document:keydown.ArrowRight", ["$event"]) onRightKeydownHandler(event: KeyboardEvent) {
		this.next.emit();
	}

	@HostListener("document:keydown.ArrowLeft", ["$event"]) onLeftKeydownHandler(event: KeyboardEvent) {
		this.prev.emit();
	}

	constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {}

	ngAfterContentInit(): void {
		if (this.allowZoom) {
			this.eventListeners.push(this.renderer.listen(this.zoomContainer.nativeElement, "mousewheel", (event) => this.onMouseWheel(event)));
			this.eventListeners.push(this.renderer.listen(this.zoomContainer.nativeElement, "DOMMouseScroll", (event) => this.onMouseWheel(event)));
			this.eventListeners.push(this.renderer.listen(this.zoomContainer.nativeElement, "onmousewheel", (event) => this.onMouseWheel(event)));
		}
	}

	initZoom() {
		if (this.showZoomLens) {
			this.showZoomLens = false;
		} else {
			this.showZoomLens = true;
			setTimeout(() => this.imageZoom(), 0);
		}
	}

	onMouseWheel(event): void {
		const direction = Math.max(Math.min(event.wheelDelta || -event.detail, 1), -1);
		if (direction > 0) {
			// up
			this.magnification += 0.3;
		} else {
			// down
			if (this.magnification === 0 || this.magnification <= 0.3) {
				this.magnification = 0;
			} else {
				this.magnification -= 0.3;
			}
		}

		this.imageZoom();
		this.moveLens(event);
	}

	imageZoom(): void {
		this.cx = (this.result.nativeElement.offsetWidth / this.lens.nativeElement.offsetWidth) * this.magnification;
		this.cy = (this.result.nativeElement.offsetHeight / this.lens.nativeElement.offsetHeight) * this.magnification;
		this.backgroundSize = this.image.nativeElement.width * this.cx + "px " + this.image.nativeElement.height * this.cy + "px";
		this.backgroundImage = this.sanitizer.bypassSecurityTrustStyle("url('" + this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.src) + "')");
	}

	moveLens(e): void {
		var pos, x, y;
		e.preventDefault();

		/* Get the cursor's x and y positions: */
		pos = this.getCursorPos(e);

		/* Calculate the position of the lens: */
		x = pos.x - this.lens.nativeElement.offsetWidth / 2;
		y = pos.y - this.lens.nativeElement.offsetHeight / 2;

		/* Calculate the position of the result view: */

		/* Prevent the lens from being positioned outside the image: */
		if (x > this.image.nativeElement.width - this.lens.nativeElement.offsetWidth) {
			x = this.image.nativeElement.width - this.lens.nativeElement.offsetWidth;
		}
		if (x < 0) {
			x = 0;
		}
		if (y > this.image.nativeElement.height - this.lens.nativeElement.offsetHeight) {
			y = this.image.nativeElement.height - this.lens.nativeElement.offsetHeight;
		}
		if (y < 0) {
			y = 0;
		}

		/* Set the position of the lens: */
		this.lensLeft = x + "px";
		this.lensTop = y + "px";

		/* Set the position of the result view: */
		this.resultLeft = pos.x + "px";
		this.resultTop = pos.y + "px";

		/* Display what the lens "sees": */
		this.backgroundPosition = "-" + x * this.cx + "px -" + y * this.cy + "px";
	}

	getCursorPos(e): any {
		var a,
			x = 0,
			y = 0;
		e = e;

		/* Get the x and y positions of the image: */
		a = this.image.nativeElement.getBoundingClientRect();

		/* Calculate the cursor's x and y coordinates, relative to the image: */
		x = e.pageX - a.left;
		y = e.pageY - a.top;

		/* Consider any page scrolling: */
		x = x - window.scrollX;
		y = y - window.scrollY;

		return { x: x, y: y };
	}

	ngOnDestroy(): void {
		this.eventListeners.forEach((destroyFn) => destroyFn());
	}
}

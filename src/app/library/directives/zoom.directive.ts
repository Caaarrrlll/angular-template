import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, inject } from "@angular/core";

/**
 * Cursor-following magnifier. The host is the image; the magnifier element is passed in through `zoomBox`
 * (usually a template reference), so several instances on one page never find each other's elements.
 */
@Directive({
	selector: "img[appCursorFollowZoom]",
})
export class ZoomDirective implements OnChanges, OnDestroy {
	@Input() appCursorFollowZoom = false;
	@Input() zoomBox: HTMLElement | undefined;
	@Input() height = 300;
	@Input() width = 400;
	@Input() zoom = 2;
	private cursorListener: (() => void) | undefined;
	private mouseWheelListener: (() => void) | undefined;

	private readonly renderer = inject(Renderer2);
	private readonly image: HTMLImageElement = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

	ngOnChanges(): void {
		this.removeZoomBox();
		if (this.appCursorFollowZoom) {
			this.cursorListener = this.renderer.listen(this.image, `mousemove`, this.positionZoomBox);
			this.mouseWheelListener = this.renderer.listen(this.image, `wheel`, this.changeZoomLevel);
		}
	}

	ngOnDestroy(): void {
		this.removeZoomBox();
	}

	private positionZoomBox = (e: MouseEvent): void => {
		if (this.appCursorFollowZoom && this.zoomBox) {
			this.renderer.addClass(this.zoomBox, "galleryZoomBoxVisible");
			this.zoomBox.style.width = `${String(this.width)}px`;
			this.zoomBox.style.height = `${String(this.height)}px`;
			this.zoomBox.style.left = `${String(e.x - this.width / 2)}px`;
			this.zoomBox.style.top = `${String(e.y - this.height / 2)}px`;
			this.zoomBox.style.backgroundSize = `${String(this.image.width * this.zoom)}px ${String(this.image.height * this.zoom)}px`;
			const width = this.zoomBox.offsetWidth / 2;
			const height = this.zoomBox.offsetHeight / 2;
			const imageRect: DOMRect = this.image.getBoundingClientRect();
			let x: number = e.x - imageRect.left;
			let y: number = e.y - imageRect.top;
			if (x > this.image.width - width / this.zoom) {
				x = this.image.width - width / this.zoom;
			}
			if (x < width / this.zoom) {
				x = width / this.zoom;
			}
			if (y > this.image.height - height / this.zoom) {
				y = this.image.height - height / this.zoom;
			}
			if (y < height / this.zoom) {
				y = height / this.zoom;
			}
			this.zoomBox.style.backgroundPosition = `-${String(x * this.zoom - width)}px -${String(y * this.zoom - height)}px`;
		} else {
			this.removeZoomBox();
		}
	};

	private removeZoomBox = (): void => {
		if (this.zoomBox) {
			this.renderer.removeClass(this.zoomBox, "galleryZoomBoxVisible");
		}
		this.cursorListener?.();
		this.mouseWheelListener?.();
		this.cursorListener = undefined;
		this.mouseWheelListener = undefined;
	};

	private changeZoomLevel = (e: WheelEvent): void => {
		if (e.deltaY > 0) {
			if (this.zoom > 1.25) {
				this.zoom = this.zoom - 0.25;
			} else {
				this.zoom = 1.25;
			}
		} else {
			if (this.zoom < 5) {
				this.zoom = this.zoom + 0.25;
			} else {
				this.zoom = 5;
			}
		}
		this.positionZoomBox(e);
	};
}

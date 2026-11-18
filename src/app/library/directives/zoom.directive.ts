import { AfterViewInit, Directive, Input, OnChanges, Renderer2, inject } from "@angular/core";

@Directive({
	selector: "[appCursorFollowZoom]",
	standalone: true,
})
export class ZoomDirective implements AfterViewInit, OnChanges {
	@Input() appCursorFollowZoom = false;
	@Input() imageID = "mainGalleryImage";
	@Input() height = 300;
	@Input() width = 400;
	@Input() zoom = 2;
	private zoomBox: HTMLElement | null = null;
	private image: HTMLImageElement | undefined;
	private cursorListner: (() => void) | undefined;
	private mouseWheelListner: (() => void) | undefined;

	private readonly renderer = inject(Renderer2);

	ngOnChanges(): void {
		this.removeZoomBox();
		if (this.appCursorFollowZoom && this.image) {
			this.cursorListner = this.renderer.listen(this.image, "mousemove", this.positionZoomBox);
			this.mouseWheelListner = this.renderer.listen(this.image, "mousewheel", this.changeZoomLevel);
		}
	}

	ngAfterViewInit(): void {
		this.zoomBox = this.renderer.selectRootElement("#galleryZoomBox") as HTMLElement | null;
		this.image = this.renderer.selectRootElement("#" + this.imageID) as HTMLImageElement | undefined;
		if (this.appCursorFollowZoom && this.image) {
			this.cursorListner = this.renderer.listen(this.image, "mousemove", this.positionZoomBox);
			this.mouseWheelListner = this.renderer.listen(this.image, "mousewheel", this.changeZoomLevel);
		}
	}

	private positionZoomBox = (e: MouseEvent): void => {
		if (this.appCursorFollowZoom && this.zoomBox && this.image) {
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
		if (this.cursorListner && this.mouseWheelListner) {
			this.cursorListner();
			this.mouseWheelListner();
		}
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

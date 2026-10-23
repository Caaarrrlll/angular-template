import { AfterViewInit, Directive, Input, NgModule, OnChanges, Renderer2 } from "@angular/core";

@Directive({
	selector: "[cursorFollowZoom]",
})
export class ZoomDirective implements AfterViewInit, OnChanges {
	@Input() cursorFollowZoom = false;
	@Input() imageID = "mainGalleryImage";
	@Input() height = 300;
	@Input() width = 400;
	@Input() zoom = 2;
	private zoomBox: any;
	private image: HTMLImageElement;
	private cursorListner: any;
	private mouseWheelListner: any;

	constructor(private renderer: Renderer2) {}

	ngOnChanges(): void {
		if (!this.cursorFollowZoom) {
			this.removeZoomBox();
		} else {
			this.cursorListner = this.renderer.listen(this.image, "mousemove", this.positionZoomBox);
			this.mouseWheelListner = this.renderer.listen(this.image, "mousewheel", this.changeZoomLevel);
		}
	}

	ngAfterViewInit() {
		this.zoomBox = this.renderer.selectRootElement("#galleryZoomBox");
		this.image = this.renderer.selectRootElement("#" + this.imageID) as HTMLImageElement;
		if (this.cursorFollowZoom) {
			this.cursorListner = this.renderer.listen(this.image, "mousemove", this.positionZoomBox);
			this.mouseWheelListner = this.renderer.listen(this.image, "mousewheel", this.changeZoomLevel);
		}
	}

	private positionZoomBox = (e: MouseEvent) => {
		if (this.cursorFollowZoom && this.zoomBox) {
			this.renderer.addClass(this.zoomBox, "galleryZoomBoxVisible");
			this.zoomBox.style.width = this.width + "px";
			this.zoomBox.style.height = this.height + "px";
			this.zoomBox.style.left = e.x - this.width / 2 + "px";
			this.zoomBox.style.top = e.y - this.height / 2 + "px";
			this.zoomBox.style.backgroundSize = this.image.width * this.zoom + "px " + this.image.height * this.zoom + "px";
			const width = this.zoomBox.offsetWidth / 2;
			const height = this.zoomBox.offsetHeight / 2;
			const cursorPosition = this.getCursorPosition(e);
			let x = cursorPosition.x;
			let y = cursorPosition.y;
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
			this.zoomBox.style.backgroundPosition = "-" + (x * this.zoom - width) + "px -" + (y * this.zoom - height) + "px";
		} else {
			this.removeZoomBox();
		}
	};

	private removeZoomBox = () => {
		if (this.zoomBox) {
			this.renderer.removeClass(this.zoomBox, "galleryZoomBoxVisible");
		}
		if (this.cursorListner && this.mouseWheelListner) {
			this.cursorListner();
			this.mouseWheelListner();
		}
	};

	private getCursorPosition = (e) => {
		const x = e.x - this.image.getBoundingClientRect().left;
		const y = e.y - this.image.getBoundingClientRect().top;
		return { x, y };
	};

	private changeZoomLevel = (e: any) => {
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

@NgModule({
	declarations: [ZoomDirective],
	exports: [ZoomDirective],
})
export class ZoomDirectiveModule {}

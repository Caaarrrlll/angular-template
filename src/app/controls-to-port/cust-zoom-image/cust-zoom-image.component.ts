import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from "@angular/core";

@Component({
	selector: "cust-zoom-image",
	templateUrl: "./cust-zoom-image.component.html",
	styleUrls: ["./cust-zoom-image.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class CustZoomImageComponent {
	@Input() img: string = "";
	isZoomed: boolean = false;
	pos = { top: 0, left: 0, x: 0, y: 0 };

	@ViewChild("container") "container": ElementRef;
	@ViewChild("imgView") "imgView": ElementRef;
	onClick() {
		this.isZoomed = !this.isZoomed;
		if (this.isZoomed) {
			this.container.nativeElement.style.overflow = "auto";
			this.container.nativeElement.style.display = "initial";
			this.imgView.nativeElement.style.width = "200%";
			this.imgView.nativeElement.style.height = "200%";
			this.imgView.nativeElement.style["max-width"] = "initial";
			this.imgView.nativeElement.style["max-height"] = "initial";
			this.imgView.nativeElement.style.cursor = "zoom-out";
		} else {
			this.container.nativeElement.style.overflow = "auto";
			this.container.nativeElement.style.display = "flex";

			this.imgView.nativeElement.style.width = "initial";
			this.imgView.nativeElement.style.height = "initial";
			this.imgView.nativeElement.style["max-width"] = "100%";
			this.imgView.nativeElement.style["max-height"] = "100%";
			this.imgView.nativeElement.style.cursor = "zoom-in";
		}
	}

	onLeave() {
		this.container.nativeElement.style.overflow = "auto";
		this.imgView.nativeElement.style.transform = "scale(1)";
		this.imgView.nativeElement.style.cursor = "zoom-in";
	}
}

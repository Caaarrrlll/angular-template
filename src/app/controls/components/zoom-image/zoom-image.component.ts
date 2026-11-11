import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
	selector: "app-zoom-image",
	templateUrl: "./zoom-image.component.html",
	styleUrls: ["./zoom-image.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomImageComponent {
	@Input() public img: string = "";

	public isZoomed: boolean = false;

	@ViewChild("container") private container?: ElementRef<HTMLDivElement>;
	@ViewChild("imgView") private imgView?: ElementRef<HTMLImageElement>;

	public onClick(): void {
		this.isZoomed = !this.isZoomed;
		if (this.container === undefined || this.imgView === undefined) {
			return;
		}
		const container: HTMLDivElement = this.container.nativeElement;
		const imgView: HTMLImageElement = this.imgView.nativeElement;

		container.style.overflow = "auto";
		if (this.isZoomed) {
			container.style.display = "initial";
			imgView.style.width = "200%";
			imgView.style.height = "200%";
			imgView.style.maxWidth = "initial";
			imgView.style.maxHeight = "initial";
			imgView.style.cursor = "zoom-out";
		} else {
			container.style.display = "flex";
			imgView.style.width = "initial";
			imgView.style.height = "initial";
			imgView.style.maxWidth = "100%";
			imgView.style.maxHeight = "100%";
			imgView.style.cursor = "zoom-in";
		}
	}

	public onLeave(): void {
		if (this.container === undefined || this.imgView === undefined) {
			return;
		}
		this.container.nativeElement.style.overflow = "auto";
		this.imgView.nativeElement.style.transform = "scale(1)";
		this.imgView.nativeElement.style.cursor = "zoom-in";
	}
}

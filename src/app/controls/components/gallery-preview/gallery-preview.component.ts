import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { GalleryPreviewImage } from "./gallery-preview.interface";

@Component({
	selector: "app-gallery-preview",
	templateUrl: "./gallery-preview.component.html",
	styleUrls: ["./gallery-preview.component.scss"],
	imports: [MatRippleModule, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPreviewComponent implements OnChanges {
	@Input({ required: true }) public images!: GalleryPreviewImage[];
	@Output() public imageSelected: EventEmitter<number> = new EventEmitter<number>();
	@Input() public totalWidth: number = 0;
	@Input() public imageWidth: number = 160;
	@Input() public imageHeight: number = 90;
	@Input() public activeImageIndex: number = 0;
	@Input() public onlyShowPreview: boolean = false;
	@Input() public orangeIcons: boolean = false;

	public maxWidth: number = 0;
	public visibleImages: number = 0;
	public firstVisibleIndex: number = 0;
	public lastVisibleIndex: number = 0;
	public lastIndexOfArray: number = 0;

	private readonly widthOfNavButtons: number = 120;
	private prevActiveIndex: number = 0;

	public ngOnChanges(changes: SimpleChanges): void {
		this.prevActiveIndex = changes["activeImageIndex"]?.previousValue ?? changes["activeImageIndex"]?.currentValue ?? 0;
		this.maxWidth = this.totalWidth - this.widthOfNavButtons;
		this.lastIndexOfArray = this.images.length - 1;
		this.calcVisibleImages();
	}

	public prev(): void {
		if (this.firstVisibleIndex > 0) {
			this.firstVisibleIndex--;
			this.setVisibleIndexes();
		}
	}

	public next(): void {
		if (this.lastVisibleIndex < this.lastIndexOfArray) {
			this.firstVisibleIndex++;
			this.setVisibleIndexes();
		}
	}

	public selectImage(index: number): void {
		this.imageSelected.emit(index);
	}

	public horizontalScroll(event: WheelEvent): void {
		event.preventDefault();
		if (event.deltaY > 0) {
			this.next();
		} else if (event.deltaY < 0) {
			this.prev();
		}
	}

	private calcVisibleImages(): void {
		const prevVisible: number = this.visibleImages;
		const visible: number = Math.floor(this.maxWidth / this.imageWidth);
		this.visibleImages = visible > 0 ? visible : 1;
		if (prevVisible !== this.visibleImages || this.prevActiveIndex !== this.activeImageIndex) {
			this.setVisibleIndexes(true);
		}
	}

	private setVisibleIndexes(keepActiveIndexVisible: boolean = false): void {
		this.hideAllImages();
		if (keepActiveIndexVisible) {
			this.firstVisibleIndex = this.activeImageIndex;
		}
		this.lastVisibleIndex = this.firstVisibleIndex + (this.visibleImages - 1);
		if (this.lastVisibleIndex > this.lastIndexOfArray) {
			this.lastVisibleIndex = this.lastIndexOfArray;
		}
		if (this.firstVisibleIndex > this.lastVisibleIndex - (this.visibleImages - 1)) {
			this.firstVisibleIndex = this.lastVisibleIndex - (this.visibleImages - 1);
			if (this.firstVisibleIndex < 0) {
				this.firstVisibleIndex = 0;
			}
		}
		this.showAllVisibleIndex();
	}

	private showAllVisibleIndex(): void {
		for (let index: number = this.firstVisibleIndex; index <= this.lastVisibleIndex; index++) {
			if (this.images[index]) {
				this.images[index].visible = "block";
			}
		}
	}

	private hideAllImages(): void {
		this.images.forEach((image: GalleryPreviewImage): void => {
			image.visible = "none";
		});
	}
}

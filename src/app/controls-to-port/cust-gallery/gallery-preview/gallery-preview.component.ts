import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { PreviewImage } from "../gallery.models";

@Component({
	selector: "cust-gallery-preview",
	templateUrl: "./gallery-preview.component.html",
	styleUrls: ["./gallery-preview.component.scss"],
})
export class GalleryPreviewComponent implements OnChanges, OnDestroy {
	@Input() images: PreviewImage[];
	@Output() imageSelected = new EventEmitter<number>();
	@Input() totalWidth = 0;
	@Input() imageWidth = 160;
	@Input() imageHeight = 90;
	@Input() activeImageIndex = 0;
	@Input() onlyShowPreview = false;
	@Input() orangeIcons = false;

	maxWidth = 0;
	widthOfNavButtons = 120;
	visibleImages = 0;
	prevActiveIndex = 0;
	firstVisibleIndex = 0;
	lastVisibleIndex = 0;
	lastIndexOfArray = 0;
	destroy$ = new Subject();

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.images) {
			this.prevActiveIndex = changes.activeImageIndex?.previousValue ? changes.activeImageIndex?.previousValue : changes.activeImageIndex?.currentValue;
			this.maxWidth = this.totalWidth - this.widthOfNavButtons;
			this.lastIndexOfArray = this.images.length - 1;
			this.calcVisibleImages();
		}
	}

	prev() {
		if (this.firstVisibleIndex > 0) {
			this.firstVisibleIndex--;
			this.setVisibleIndexes();
		}
	}

	next() {
		if (this.lastVisibleIndex < this.lastIndexOfArray) {
			this.firstVisibleIndex++;
			this.setVisibleIndexes();
		}
	}

	selectImage(index: number) {
		this.imageSelected.emit(index);
	}

	private calcVisibleImages() {
		const prevVisible = this.visibleImages;
		const visible = Math.floor(this.maxWidth / this.imageWidth);
		this.visibleImages = visible > 0 ? visible : 1;
		if (prevVisible !== this.visibleImages || this.prevActiveIndex !== this.activeImageIndex) {
			this.setVisibleIndexes(true);
		}
	}

	private setVisibleIndexes(keepActiveIndexVisible = false) {
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

	private showAllVisibleIndex() {
		for (let x = this.firstVisibleIndex; x <= this.lastVisibleIndex; x++) {
			if (this.images[x]) {
				this.images[x].visible = "block";
			}
		}
	}

	private hideAllImages() {
		this.images.forEach((e) => {
			e.visible = "none";
		});
	}

	horizontalScroll(event: any) {
		event.preventDefault();
		if (event.deltaY > 0) {
			this.next();
		} else if (0 > event.deltaY) {
			this.prev();
		}
	}

	ngOnDestroy() {
		this.destroy$.next(null);
		this.destroy$.complete();
	}
}

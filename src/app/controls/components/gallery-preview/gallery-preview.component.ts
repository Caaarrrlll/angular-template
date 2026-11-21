import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { _GalleryPreviewImage } from "./gallery-preview.interface";

@Component({
	selector: "app-gallery-preview",
	templateUrl: "./gallery-preview.component.html",
	styleUrls: ["./gallery-preview.component.scss"],
	imports: [MatRippleModule, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPreviewComponent {
	private static readonly widthOfNavButtons: number = 120;

	public readonly images = input.required<_GalleryPreviewImage[]>();
	public readonly imageSelected = output<number>();
	public readonly totalWidth = input<number>(0);
	public readonly imageWidth = input<number>(160);
	public readonly imageHeight = input<number>(90);
	public readonly activeImageIndex = input<number>(0);
	public readonly onlyShowPreview = input<boolean>(false);
	public readonly orangeIcons = input<boolean>(false);

	public readonly firstVisibleIndex = signal(0);

	public readonly maxWidth = computed((): number => this.totalWidth() - GalleryPreviewComponent.widthOfNavButtons);
	public readonly lastIndexOfArray = computed((): number => this.images().length - 1);
	public readonly visibleImages = computed((): number => Math.max(Math.floor(this.maxWidth() / this.imageWidth()), 1));
	public readonly lastVisibleIndex = computed((): number => Math.min(this.firstVisibleIndex() + this.visibleImages() - 1, this.lastIndexOfArray()));

	private prevActiveIndex = 0;
	private prevVisibleImages = 0;

	constructor() {
		effect(() => {
			// mirrors the old ngOnChanges: re-center the window on the active image when the
			// active index changes or the visible-window size changes
			const activeIndex: number = this.activeImageIndex();
			const visibleCount: number = this.visibleImages();
			const keepActiveVisible: boolean = visibleCount !== this.prevVisibleImages || this.prevActiveIndex !== activeIndex;
			this.prevActiveIndex = activeIndex;
			this.prevVisibleImages = visibleCount;
			if (!keepActiveVisible) {
				return;
			}
			untracked(() => {
				this.centerOnActive(activeIndex);
			});
		});
	}

	public prev(): void {
		if (this.firstVisibleIndex() > 0) {
			this.firstVisibleIndex.set(this.firstVisibleIndex() - 1);
		}
	}

	public next(): void {
		if (this.lastVisibleIndex() < this.lastIndexOfArray()) {
			this.firstVisibleIndex.set(this.firstVisibleIndex() + 1);
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

	public isImageVisible(index: number): boolean {
		return index >= this.firstVisibleIndex() && index <= this.lastVisibleIndex();
	}

	private centerOnActive(activeIndex: number): void {
		this.firstVisibleIndex.set(activeIndex);
		if (this.firstVisibleIndex() > this.lastVisibleIndex() - (this.visibleImages() - 1)) {
			this.firstVisibleIndex.set(Math.max(this.lastVisibleIndex() - (this.visibleImages() - 1), 0));
		}
	}
}

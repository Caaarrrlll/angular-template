import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, Input, OnChanges, OnInit, ViewChild, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { Subject, debounceTime } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { GalleryPreviewComponent } from "@shared/components/gallery-preview/gallery-preview.component";
import { ZoomDirective } from "@shared/directives/zoom.directive";
import { _Image } from "./gallery.models";

// Inline placeholder so the control does not depend on a file in src/assets (empty by design in the template).
// The SVG avoids quotes and parentheses so the URL is also safe inside the zoom box's CSS `url(...)`.
const imageNotFoundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="#eeeeee"/><text x="160" y="105" font-family="sans-serif" font-size="16" fill="#888888" text-anchor="middle">Image not found</text></svg>`;
const imageNotFoundUrl = `data:image/svg+xml,${encodeURIComponent(imageNotFoundSvg)}`;

@Component({
	selector: "app-gallery",
	templateUrl: "./gallery.component.html",
	styleUrls: ["./gallery.component.scss"],
	imports: [MatRippleModule, MatIconModule, ZoomDirective, GalleryPreviewComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		"(window:resize)": "onResize()",
		"(document:fullscreenchange)": "onFullscreenChange()",
	},
})
export class GalleryComponent implements OnChanges, OnInit {
	@Input() public images?: _Image[];

	// ------- optional defaults that don't often need to be changed ------ //
	@Input() public autoplay = true;
	@Input() public autoplayDelay = 1750; // 1.75 seconds
	@Input() public showAutoplay = true;
	@Input() public border = true;
	@Input() public showFullscreen = true;
	@Input() public showGalleryPreview = true;
	@Input() public galleryWidth: "fillWidth" | "matchImageWidth" = "fillWidth";
	@Input() public loopOver = true;
	@Input() public imageZoom = false;
	@Input() public onlyShowPreview = false;
	@Input() public orangeIcons = true;
	@Input() public galleryPreviewImageMaxWidth = 160; // the pixel value as a number
	// true - loop over the array and reset to zero with navigation clicks
	// false - loop over the array and end on last index with navigation clicks
	@Input() public imageSize: "contain" | "cover" = "contain"; // Both options will maintain aspect ratio
	// Contain - fill the width as much as possible (not 100%) without cutting off any of the image
	// Cover - set the width to 100% of the parent - can result in pieces of the image getting cut off

	@ViewChild("fullScreen") public fullScreenContainer?: ElementRef<HTMLElement>;
	@ViewChild("galleryContainer") public galleryContainer?: ElementRef<HTMLElement>;
	@ViewChild("pagerScrollContainer") public pagerScrollContainer?: ElementRef<HTMLElement>;

	public currentIndex = 0;
	public arrLength = 0;
	public autoplayGo = false;
	public fullscreenOpen = false;

	public get currentImage(): _Image | undefined {
		return this.images?.[this.currentIndex];
	}

	public get currentImageUrl(): string {
		return this.currentImage?.url ?? imageNotFoundUrl;
	}

	public get galleryContainerWidth(): number {
		return this.galleryContainer?.nativeElement.clientWidth ?? 0;
	}

	private pagerScrollContainerLeftScroll = 0;
	private readonly autoplayEvent = new Subject<void>();
	private readonly destroyRef = inject(DestroyRef);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public ngOnChanges(): void {
		this.reset();
	}

	public ngOnInit(): void {
		this.autoplayEvent.pipe(debounceTime(this.autoplayDelay), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
			if (this.autoplayGo) {
				this.next();
				// The debounced tick runs outside any template event, so OnPush needs an explicit mark.
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	private reset(): void {
		if (this.images) {
			this.currentIndex = 0;
			this.arrLength = this.images.length;
			if (this.autoplay && this.showAutoplay) {
				this.startAutoplay();
			} else {
				// cannot set to autoplay if the autoplay-play-pause button is hidden
				this.stopAutoplay();
			}
		}
	}

	public next(): void {
		if (!this.images) {
			return;
		}

		if (this.currentIndex < this.arrLength - 1) {
			this.currentIndex = this.currentIndex + 1;
		} else if (this.currentIndex === this.arrLength - 1 && this.loopOver) {
			this.currentIndex = 0;
		} else {
			this.currentIndex = this.arrLength - 1;
		}
		this.autoplayEvent.next();
	}

	public prev(): void {
		if (!this.images) {
			return;
		}

		if (this.currentIndex > 0) {
			this.currentIndex = this.currentIndex - 1;
		} else if (this.currentIndex === 0 && this.loopOver) {
			this.currentIndex = this.arrLength - 1;
		} else {
			this.currentIndex = 0;
		}
		this.autoplayEvent.next();
	}

	public navigateToIndex(index: number): void {
		this.currentIndex = index;
		if (this.autoplayGo) {
			this.autoplayEvent.next();
		}
	}

	public toggleAutoplay(): void {
		if (this.autoplayGo) {
			this.stopAutoplay();
		} else {
			this.startAutoplay();
		}
	}

	private startAutoplay(): void {
		this.autoplayGo = true;
		this.autoplayEvent.next();
	}

	private stopAutoplay(): void {
		this.autoplayGo = false;
	}

	public toggleZoomBox(): void {
		this.imageZoom = !this.imageZoom;
	}

	public toggleFullScreen(): void {
		if (this.fullscreenOpen) {
			void document.exitFullscreen();
		} else {
			void this.fullScreenContainer?.nativeElement.requestFullscreen();
		}
	}

	public horizontalScroll(event: WheelEvent): void {
		if (!this.imageZoom && this.fullscreenOpen) {
			event.preventDefault();
			if (event.deltaY > 0) {
				this.next();
			} else if (event.deltaY < 0) {
				this.prev();
			}
		}
	}

	public pagerHorizontalScroll(event: WheelEvent): void {
		if (!this.pagerScrollContainer) {
			return;
		}
		event.preventDefault();
		const maxScrollLeft = this.pagerScrollContainer.nativeElement.scrollWidth - this.pagerScrollContainer.nativeElement.clientWidth;
		// needs a variable to track the scroll position to prevent stutter when scrolling fast (pagerScrollContainerLeftScroll)
		this.pagerScrollContainerLeftScroll = this.clamp(this.pagerScrollContainerLeftScroll + event.deltaY, 0, maxScrollLeft);
		this.pagerScrollContainer.nativeElement.scrollTo({ left: this.pagerScrollContainerLeftScroll, behavior: "smooth" });
	}

	public onImageLoad(): void {
		// the template binds (load) purely to trigger change detection so the width getter refreshes
	}

	public onResize(): void {
		// host event used only to trigger change detection so the width getter refreshes
	}

	public onFullscreenChange(): void {
		// Only this gallery's own container counts; another gallery (or element) going fullscreen must not affect it.
		const container: HTMLElement | undefined = this.fullScreenContainer?.nativeElement;
		this.fullscreenOpen = container !== undefined && document.fullscreenElement === container;
	}

	/** Keyboard shortcuts, bound on the gallery container so they only act while focus is inside this gallery. */
	public onKeyDown(event: KeyboardEvent): void {
		if (event.key === `ArrowRight`) {
			event.preventDefault();
			this.next();
		} else if (event.key === `ArrowLeft`) {
			event.preventDefault();
			this.prev();
		} else if (event.key === ` ` && event.target === event.currentTarget && this.showAutoplay && this.arrLength > 1) {
			// Space only when the container itself is focused: on an inner button it must keep its native "click" meaning.
			event.preventDefault();
			this.toggleAutoplay();
		}
	}

	private clamp(value: number, min: number, max: number): number {
		// keeps value between min and max
		return Math.min(Math.max(value, min), max);
	}
}

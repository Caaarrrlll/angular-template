import { Component, ElementRef, Input, OnChanges, OnDestroy, Renderer2, ViewChild } from "@angular/core";
import { _DeconstructedFlatView } from "@apis/evaluation/models/evaluation-flat-view.interface";
import { Observable, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { Image } from "../gallery.models";

@Component({
	selector: "cust-gallery",
	templateUrl: "./gallery.component.html",
	styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnChanges, OnDestroy {
	@Input() images: Image[];
	@Input() stockNumber: string = "";
	@Input() flatView: boolean = false;
	@Input() flatViewCompare: Array<Observable<_DeconstructedFlatView>> = null;

	// ------- optional defaults that don't often need to be changed ------ //
	@Input() autoplay = true;
	@Input() autoplayDelay = 1750; // 1.75 seconds
	@Input() showAutoplay = true;
	@Input() border = true;
	@Input() showFullscreen = true;
	@Input() showGalleryPreview = true;
	@Input() galleryWidth: "fillWidth" | "matchImageWidth" = "fillWidth";
	@Input() loopOver = true;
	@Input() imageZoom = false;
	@Input() onlyShowPreview = false;
	@Input() orangeIcons = true;
	@Input() galleryPreviewImageMaxWidth = 160; // the pixel value as a number
	// true - loop over the array and reset to zero with navigation clicks
	// false - loop over the array and end on last index with navigation clicks
	@Input() imageSize: "contain" | "cover" = "contain"; // Both options will maintain aspect ratio
	// Contain - fill the width as much as possible (not 100%) without cutting off any of the image
	// Cover - set the width to 100% of the parent - can result in pieces of the image getting cut off

	@ViewChild("galleryContainer") galleryContainer: ElementRef;
	galleryContainerWidth = 0;
	autoplayIcon: "pause" | "play_arrow";
	autoplayGo: boolean;
	autoplayEvent: Subject<any> = new Subject();
	autoplayDestroy: Subject<any> = new Subject();
	currentIndex = 0;
	arrLength = 0;
	currentImage: Image = {
		url: "../../../../assets/images/image_not_found.png",
	};
	fullscreenOpen = false;

	widthChangeUnlistner: any;
	keyDownUnlistner: any;
	fullscreenUnlistner: any;
	webkitFullscreenUnlistner: any;
	mozFullscreenUnlistner: any;
	msFullscreenUnlistner: any;

	@ViewChild("pagerScrollContainer") pagerScrollContainer: ElementRef;
	pagerScrollContainerLeftScroll = 0;

	constructor(private renderer: Renderer2) {
		this.initEventListeners();
	}

	ngOnChanges(): void {
		this.reset();
	}

	private reset() {
		if (this.images) {
			this.currentImage = this.images[0];
			this.arrLength = this.images.length;
			if (this.autoplay && this.showAutoplay) {
				this.startAutoplay();
			} else {
				// cannot set to autoplay if the autoplay-play-pause button is hidden
				this.stopAutoplay();
			}
		}
	}

	next() {
		if (this.stockNumber && this.flatView && this.currentIndex == 0) {
			this.startAutoplay();
			this.flatView = !this.flatView;
			if (this.images[0].url !== "../../../../assets/images/image_not_found.png") {
				this.images.unshift({ url: "../../../../assets/images/image_not_found.png" });
				this.arrLength = this.arrLength + 1;
			}
			this.currentIndex = this.currentIndex + 1;
			this.currentImage = this.images[this.currentIndex];
			this.autoplayEvent.next(null);
			return;
		}

		if (this.stockNumber && !this.flatView && this.arrLength - 1 === this.currentIndex) {
			this.flatView = !this.flatView;
			this.currentIndex = 0;
			this.currentImage = this.images[this.currentIndex];
			this.autoplayEvent.next(null);
			return;
		}

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
		this.currentImage = this.images[this.currentIndex];
		this.autoplayEvent.next(null);
	}

	prev() {
		if (this.stockNumber && !this.flatView && this.currentIndex == 1) {
			this.flatView = !this.flatView;
			this.currentIndex = 0;
			this.autoplayEvent.next(null);
			return;
		}
		if (this.stockNumber && this.flatView && this.currentIndex == 0) {
			this.flatView = !this.flatView;
			this.currentIndex = this.arrLength - 1;
			this.currentImage = this.images[this.currentIndex];
			this.autoplayEvent.next(null);
			return;
		}
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
		this.currentImage = this.images[this.currentIndex];
		this.autoplayEvent.next(null);
	}

	navigateToIndex(index: number) {
		if (this.stockNumber && !this.flatView && index === 0) {
			this.flatView = !this.flatView;
		}
		if (this.stockNumber && this.flatView && index !== 0) {
			this.flatView = false;
		}
		this.currentIndex = index;
		this.currentImage = this.images[this.currentIndex];
		if (this.autoplayGo) {
			this.startAutoplayTimer();
			this.autoplayEvent.next(null);
		}
	}

	toggleAutoplay = () => {
		if (this.autoplayGo) {
			this.stopAutoplay();
		} else {
			this.startAutoplay();
		}
	};

	private startAutoplay() {
		this.autoplayGo = true;
		this.autoplayIcon = "pause";
		this.startAutoplayTimer();
		this.autoplayEvent.next(null);
	}

	private stopAutoplay() {
		this.autoplayGo = false;
		this.autoplayIcon = "play_arrow";
		this.autoplayDestroy.next(null);
	}

	private async startAutoplayTimer() {
		this.autoplayEvent.pipe(debounceTime(this.autoplayDelay), takeUntil(this.autoplayDestroy)).subscribe((e) => {
			this.next();
		});
	}

	toggleZoomBox() {
		if (this.imageZoom) {
			this.hideZoomBox();
		} else {
			this.showZoomBox();
		}
	}

	private hideZoomBox() {
		this.imageZoom = false;
	}

	private showZoomBox() {
		this.imageZoom = true;
	}

	toggleFullScreen() {
		if (this.fullscreenOpen) {
			this.closeFullScreen();
		} else {
			this.openFullScreen();
		}
	}

	private openFullScreen() {
		const fullScreen = document.querySelector("#fullScreen") as HTMLElement & {
			mozRequestFullScreen(): Promise<void>;
			webkitRequestFullscreen(): Promise<void>;
			msRequestFullscreen(): Promise<void>;
		};
		if (fullScreen.requestFullscreen) {
			fullScreen.requestFullscreen();
		} else if (fullScreen.mozRequestFullScreen) {
			fullScreen.mozRequestFullScreen();
		} else if (fullScreen.webkitRequestFullscreen) {
			fullScreen.webkitRequestFullscreen();
		} else if (fullScreen.msRequestFullscreen) {
			fullScreen.msRequestFullscreen();
		}
	}

	private closeFullScreen() {
		const docWithBrowsersExitFunctions = document as Document & {
			mozCancelFullScreen(): Promise<void>;
			webkitExitFullscreen(): Promise<void>;
			msExitFullscreen(): Promise<void>;
		};
		if (docWithBrowsersExitFunctions.exitFullscreen) {
			docWithBrowsersExitFunctions.exitFullscreen();
		} else if (docWithBrowsersExitFunctions.mozCancelFullScreen) {
			docWithBrowsersExitFunctions.mozCancelFullScreen();
		} else if (docWithBrowsersExitFunctions.webkitExitFullscreen) {
			docWithBrowsersExitFunctions.webkitExitFullscreen();
		} else if (docWithBrowsersExitFunctions.msExitFullscreen) {
			docWithBrowsersExitFunctions.msExitFullscreen();
		}
	}

	horizontalScroll(event: any) {
		if (!this.imageZoom && this.fullscreenOpen) {
			event.preventDefault();
			if (event.deltaY > 0) {
				this.next();
			} else if (0 > event.deltaY) {
				this.prev();
			}
		}
	}

	private initEventListeners() {
		this.widthChangeUnlistner = this.renderer.listen("window", "resize", this.galleryWidthChange);
		this.keyDownUnlistner = this.renderer.listen("window", "keydown", this.keyDownEvent);

		this.fullscreenUnlistner = this.renderer.listen("document", "fullscreenchange", this.fullScreenToggled);
		this.webkitFullscreenUnlistner = this.renderer.listen("document", "webkitfullscreenchange", this.fullScreenToggled);
		this.mozFullscreenUnlistner = this.renderer.listen("document", "mozfullscreenchange", this.fullScreenToggled);
		this.msFullscreenUnlistner = this.renderer.listen("document", "MSFullscreenChange", this.fullScreenToggled);
		this.renderer.listen("document", "keyup.Space", this.toggleAutoplay);
	}

	private galleryWidthChange = () => {
		this.galleryContainerWidth = this.galleryContainer.nativeElement.clientWidth;
	};

	public onImageLoad() {
		this.galleryContainerWidth = this.galleryContainer.nativeElement.clientWidth;
	}

	private keyDownEvent = (event: KeyboardEvent) => {
		if (event.key === "ArrowRight") {
			this.next();
		} else if (event.key === "ArrowLeft") {
			this.prev();
		}
	};

	private fullScreenToggled = () => {
		this.fullscreenOpen = !this.fullscreenOpen;
		this.delay(1).then((e) => {
			this.galleryContainerWidth = this.galleryContainer.nativeElement.clientWidth;
		}); // tiny delay needed to get the new width after closing fullscreen
	};

	private delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	pagerHorizontalScroll(event: any) {
		event.preventDefault();
		const maxScrollLeft = this.pagerScrollContainer.nativeElement.scrollWidth - this.pagerScrollContainer.nativeElement.clientWidth;
		// needs global variable to track the scroll position to prevent stutter when scrolling fast (pagerScrollContainerLeftScroll)
		this.pagerScrollContainerLeftScroll = this.clamp(this.pagerScrollContainerLeftScroll + event.deltaY, 0, maxScrollLeft);
		this.pagerScrollContainer.nativeElement.scrollTo({ left: this.pagerScrollContainerLeftScroll, behavior: "smooth" });
	}

	private clamp(value, min, max) {
		// keeps value between min and max
		return Math.min(Math.max(value, min), max);
	}

	ngOnDestroy(): void {
		this.autoplayDestroy.next(null);
		this.autoplayDestroy.complete();

		this.autoplayEvent.next(null);
		this.autoplayEvent.complete();

		if (this.widthChangeUnlistner) {
			this.widthChangeUnlistner();
		}
		if (this.keyDownUnlistner) {
			this.keyDownUnlistner();
		}
		if (this.fullscreenUnlistner) {
			this.fullscreenUnlistner();
		}
		if (this.webkitFullscreenUnlistner) {
			this.webkitFullscreenUnlistner();
		}
		if (this.mozFullscreenUnlistner) {
			this.mozFullscreenUnlistner();
		}
		if (this.msFullscreenUnlistner) {
			this.msFullscreenUnlistner();
		}
	}
}

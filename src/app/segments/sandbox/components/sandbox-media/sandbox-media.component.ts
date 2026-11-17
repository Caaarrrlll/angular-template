import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { _SandboxMediaImage, SandboxMediaDataService } from "@segments/sandbox/services/sandbox-media-data.service";
import { CarouselComponent } from "@shared/components/carousel/carousel.component";
import { GalleryComponent } from "@shared/components/gallery/gallery.component";
import { GalleryPreviewComponent } from "@shared/components/gallery-preview/gallery-preview.component";
import { ZoomImageComponent } from "@shared/components/zoom-image/zoom-image.component";
import { ZoomableImageComponent } from "@shared/components/zoomable-image/zoomable-image.component";

@Component({
	selector: "app-sandbox-media",
	templateUrl: "./sandbox-media.component.html",
	styleUrls: ["./sandbox-media.component.scss"],
	imports: [SandboxPageComponent, SandboxDemoComponent, CarouselComponent, GalleryComponent, GalleryPreviewComponent, ZoomImageComponent, ZoomableImageComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxMediaComponent {
	private readonly mediaData: SandboxMediaDataService = inject(SandboxMediaDataService);

	public readonly images: _SandboxMediaImage[] = this.mediaData.images;

	// ---- carousel ---- //
	public readonly carouselPreview: WritableSignal<`left` | `bottom`> = signal<`left` | `bottom`>(`left`);
	public readonly carouselNavigateTo: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
	public readonly carouselShortcuts: _SandboxMediaImage[] = this.images.slice(0, 3);
	public readonly carouselLog = new SandboxEventLog();

	// ---- gallery (+ cursorFollowZoom directive) ---- //
	public readonly galleryEmpty: WritableSignal<boolean> = signal(false);
	public readonly galleryAutoplay: WritableSignal<boolean> = signal(false);
	public readonly galleryShowAutoplay: WritableSignal<boolean> = signal(true);
	public readonly galleryBorder: WritableSignal<boolean> = signal(true);
	public readonly galleryShowPreview: WritableSignal<boolean> = signal(true);
	public readonly galleryFillWidth: WritableSignal<boolean> = signal(true);
	public readonly galleryLoopOver: WritableSignal<boolean> = signal(true);
	public readonly galleryImageZoom: WritableSignal<boolean> = signal(true);
	public readonly galleryOnlyShowPreview: WritableSignal<boolean> = signal(false);
	public readonly galleryOrangeIcons: WritableSignal<boolean> = signal(true);
	public readonly galleryCover: WritableSignal<boolean> = signal(false);
	public readonly galleryImages: Signal<_SandboxMediaImage[]> = computed((): _SandboxMediaImage[] => (this.galleryEmpty() ? [] : this.images));

	// ---- gallery-preview ---- //
	public readonly previewActiveIndex: WritableSignal<number> = signal(0);
	public readonly previewLog = new SandboxEventLog();

	// ---- zoomable-image ---- //
	public readonly zoomableIndex: WritableSignal<number> = signal(0);
	public readonly zoomableAllowZoom: WritableSignal<boolean> = signal(true);
	public readonly zoomableEmpty: WritableSignal<boolean> = signal(false);
	public readonly zoomableSrc: Signal<string> = computed((): string => (this.zoomableEmpty() ? `` : this.images[this.zoomableIndex()].url));
	public readonly zoomableCount: Signal<string> = computed((): string => `${String(this.zoomableIndex() + 1)} of ${String(this.images.length)}`);
	public readonly zoomableLog = new SandboxEventLog();

	public onCarouselOpenDetails(name: string): void {
		this.carouselLog.add(`openDetails: ${name}`);
	}

	public toggleCarouselPreview(): void {
		this.carouselPreview.update((preview: `left` | `bottom`): `left` | `bottom` => (preview === `left` ? `bottom` : `left`));
	}

	public navigateCarousel(name: string): void {
		this.carouselNavigateTo.set(name);
		this.carouselLog.add(`navigateTo set: ${name}`);
	}

	public onPreviewImageSelected(index: number): void {
		this.previewActiveIndex.set(index);
		this.previewLog.add(`imageSelected: ${String(index)} (${this.images[index].title})`);
	}

	public onZoomableNext(): void {
		this.zoomableIndex.update((index: number): number => (index + 1) % this.images.length);
		this.zoomableLog.add(`next -> ${this.zoomableCount()}`);
	}

	public onZoomablePrev(): void {
		this.zoomableIndex.update((index: number): number => (index - 1 + this.images.length) % this.images.length);
		this.zoomableLog.add(`prev -> ${this.zoomableCount()}`);
	}
}

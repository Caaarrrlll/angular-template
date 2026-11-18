import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, output, signal, untracked, Signal } from "@angular/core";
import { ZoomableImageComponent } from "@shared/components/zoomable-image/zoomable-image.component";
import { SnackbarService } from "@shared/services/snackbar.service";
import { CarouselImage } from "./carousel.interface";

@Component({
	selector: "app-carousel",
	templateUrl: "./carousel.component.html",
	styleUrls: ["./carousel.component.scss"],
	imports: [ZoomableImageComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
	public readonly images = input.required<CarouselImage[]>();
	public readonly preview = input<"left" | "bottom">("left");
	public readonly navigateTo = input<string | undefined>();
	public readonly openDetails = output<string>();

	public readonly selectedImg = signal(0);
	/** `.at()` is typed `| undefined`, unlike `images()[i]`: an empty list or out-of-range index really is undefined at runtime. */
	public readonly selectedImage: Signal<CarouselImage | undefined> = computed((): CarouselImage | undefined => this.images().at(this.selectedImg()));

	private readonly snackbarService: SnackbarService = inject(SnackbarService);
	private readonly imageElement: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

	constructor() {
		effect(() => {
			const navigateTo: string | undefined = this.navigateTo();
			if (navigateTo === undefined) {
				return;
			}
			// `untracked` so image-array changes alone don't re-run this; only `navigateTo` changes did in ngOnChanges
			const index: number = untracked(this.images)
				.map((image: CarouselImage): string => image.name)
				.indexOf(navigateTo);
			if (index !== -1) {
				this.selectedImg.set(index);
			} else {
				this.snackbarService.open("This image is not available", "warning");
			}
		});
	}

	public next(): void {
		const nativeElement: HTMLElement = this.imageElement.nativeElement;
		const scrollTarget: Element | null = nativeElement.querySelector(".selectedNext") ?? nativeElement.querySelector(".selected");
		scrollTarget?.scrollIntoView({ behavior: "smooth" });

		if (this.selectedImg() < this.images().length - 1) {
			this.selectedImg.set(this.selectedImg() + 1);
			this.openDetails.emit(this.images()[this.selectedImg()].name);
			return;
		}
		this.selectedImg.set(0);
	}

	public prev(): void {
		if (this.selectedImg() > 0) {
			this.selectedImg.set(this.selectedImg() - 1);
			this.openDetails.emit(this.images()[this.selectedImg()].name);
			return;
		}
		this.selectedImg.set(this.images().length - 1);
	}
}

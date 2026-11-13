import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from "@angular/core";
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
export class CarouselComponent implements OnChanges {
	@Input({ required: true }) public images!: CarouselImage[];
	@Input() public preview: "left" | "bottom" = "left";
	@Input() public navigateTo?: string;
	@Output() public openDetails: EventEmitter<string> = new EventEmitter<string>();

	public selectedImg: number = 0;

	private readonly snackbarService: SnackbarService = inject(SnackbarService);
	private readonly imageElement: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["navigateTo"] && this.navigateTo !== undefined) {
			const index: number = this.images.map((image: CarouselImage): string => image.name).indexOf(this.navigateTo);
			if (index !== -1) {
				this.selectedImg = index;
			} else {
				this.snackbarService.open("This image is not available", "warning");
			}
		}
	}

	public next(): void {
		const nativeElement: HTMLElement = this.imageElement.nativeElement;
		const scrollTarget: Element | null = nativeElement.querySelector(".selectedNext") ?? nativeElement.querySelector(".selected");
		scrollTarget?.scrollIntoView({ behavior: "smooth" });

		if (this.selectedImg < this.images.length - 1) {
			this.selectedImg++;
			this.openDetails.emit(this.images[this.selectedImg].name);
			return;
		}
		this.selectedImg = 0;
	}

	public prev(): void {
		if (this.selectedImg > 0) {
			this.selectedImg--;
			this.openDetails.emit(this.images[this.selectedImg].name);
			return;
		}
		this.selectedImg = this.images.length - 1;
	}
}

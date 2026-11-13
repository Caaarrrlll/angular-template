import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	Output,
	SecurityContext,
	ViewChild,
	WritableSignal,
	effect,
	inject,
	signal,
} from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-zoomable-image",
	templateUrl: "./zoomable-image.component.html",
	styleUrls: ["./zoomable-image.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomableImageComponent {
	@Input() public src: string = "";
	@Input() public allowZoom: boolean = true;
	@Input() public count: string = "";

	@Output() public next: EventEmitter<void> = new EventEmitter<void>();
	@Output() public prev: EventEmitter<void> = new EventEmitter<void>();

	public backgroundImage: SafeStyle | null = null;
	public backgroundSize: string = "";
	public backgroundPosition: string = "";
	public lensLeft: string = "";
	public lensTop: string = "";
	public resultLeft: string = "";
	public resultTop: string = "";
	public magnification: number = 1;

	public showZoomLens: WritableSignal<boolean> = signal(false);
	public showLightbox: WritableSignal<boolean> = signal(false);

	@ViewChild("image") private image?: ElementRef<HTMLImageElement>;
	@ViewChild("lens") private lens?: ElementRef<HTMLDivElement>;
	@ViewChild("result") private result?: ElementRef<HTMLDivElement>;

	private cx: number = 0;
	private cy: number = 0;

	private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

	constructor() {
		effect(() => {
			if (this.showZoomLens()) {
				this.imageZoom();
			}
		});
	}

	@HostListener("document:keydown.escape")
	public onEscapeKeydown(): void {
		this.showLightbox.set(false);
	}

	@HostListener("document:keydown.ArrowRight")
	public onRightKeydown(): void {
		this.next.emit();
	}

	@HostListener("document:keydown.ArrowLeft")
	public onLeftKeydown(): void {
		this.prev.emit();
	}

	public initZoom(): void {
		this.showZoomLens.set(!this.showZoomLens());
	}

	public onMouseWheel(event: WheelEvent): void {
		if (!this.allowZoom) {
			return;
		}
		event.preventDefault();
		if (event.deltaY < 0) {
			this.magnification += 0.3;
		} else {
			this.magnification = Math.max(this.magnification - 0.3, 0);
		}
		this.imageZoom();
		this.moveLens(event);
	}

	public imageZoom(): void {
		const image: HTMLImageElement | undefined = this.image?.nativeElement;
		const lens: HTMLDivElement | undefined = this.lens?.nativeElement;
		const result: HTMLDivElement | undefined = this.result?.nativeElement;
		if (image === undefined || lens === undefined || result === undefined || lens.offsetWidth === 0 || result.offsetWidth === 0) {
			return;
		}
		this.cx = (result.offsetWidth / lens.offsetWidth) * this.magnification;
		this.cy = (result.offsetHeight / lens.offsetHeight) * this.magnification;
		this.backgroundSize = `${image.width * this.cx}px ${image.height * this.cy}px`;
		const safeSrc: string | null = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.src);
		this.backgroundImage = this.sanitizer.bypassSecurityTrustStyle(`url('${safeSrc ?? ""}')`);
	}

	public moveLens(event: MouseEvent): void {
		const image: HTMLImageElement | undefined = this.image?.nativeElement;
		const lens: HTMLDivElement | undefined = this.lens?.nativeElement;
		if (image === undefined || lens === undefined) {
			return;
		}
		const rect: DOMRect = image.getBoundingClientRect();
		const cursorX: number = event.pageX - rect.left - window.scrollX;
		const cursorY: number = event.pageY - rect.top - window.scrollY;
		const x: number = Math.max(Math.min(cursorX - lens.offsetWidth / 2, image.width - lens.offsetWidth), 0);
		const y: number = Math.max(Math.min(cursorY - lens.offsetHeight / 2, image.height - lens.offsetHeight), 0);
		this.lensLeft = `${x}px`;
		this.lensTop = `${y}px`;
		this.resultLeft = `${cursorX}px`;
		this.resultTop = `${cursorY}px`;
		this.backgroundPosition = `-${x * this.cx}px -${y * this.cy}px`;
	}
}

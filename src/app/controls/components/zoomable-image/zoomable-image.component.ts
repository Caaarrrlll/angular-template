import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild, WritableSignal, effect, inject, signal } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-zoomable-image",
	host: {
		"(document:keydown.escape)": "onEscapeKeydown()",
		"(document:keydown.ArrowRight)": "onRightKeydown()",
		"(document:keydown.ArrowLeft)": "onLeftKeydown()",
	},
	templateUrl: "./zoomable-image.component.html",
	styleUrls: ["./zoomable-image.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomableImageComponent {
	@Input() public src = "";
	@Input() public allowZoom = true;
	@Input() public count = "";

	@Output() public next: EventEmitter<void> = new EventEmitter<void>();
	@Output() public prev: EventEmitter<void> = new EventEmitter<void>();

	public backgroundImage: SafeStyle | null = null;
	public backgroundSize = "";
	public backgroundPosition = "";
	public lensLeft = "";
	public lensTop = "";
	public resultLeft = "";
	public resultTop = "";
	public magnification = 1;

	public showZoomLens: WritableSignal<boolean> = signal(false);
	public showLightbox: WritableSignal<boolean> = signal(false);

	@ViewChild("image") private image?: ElementRef<HTMLImageElement>;
	@ViewChild("lens") private lens?: ElementRef<HTMLDivElement>;
	@ViewChild("result") private result?: ElementRef<HTMLDivElement>;

	private cx = 0;
	private cy = 0;

	private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

	constructor() {
		effect(() => {
			if (this.showZoomLens()) {
				this.imageZoom();
			}
		});
	}

	public onEscapeKeydown(): void {
		this.showLightbox.set(false);
	}

	public onRightKeydown(): void {
		this.next.emit();
	}

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
		this.backgroundSize = `${String(image.width * this.cx)}px ${String(image.height * this.cy)}px`;
		// An image URL inside CSS is a URL context (RESOURCE_URL always throws for plain strings). Percent-encode
		// quotes/parentheses/backslashes so the value cannot break out of `url('...')`.
		const safeSrc: string = (this.sanitizer.sanitize(SecurityContext.URL, this.src) ?? ``).replace(
			/['"()\\]/g,
			(char: string): string => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
		);
		this.backgroundImage = this.sanitizer.bypassSecurityTrustStyle(`url('${safeSrc}')`);
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
		this.lensLeft = `${String(x)}px`;
		this.lensTop = `${String(y)}px`;
		this.resultLeft = `${String(cursorX)}px`;
		this.resultTop = `${String(cursorY)}px`;
		this.backgroundPosition = `-${String(x * this.cx)}px -${String(y * this.cy)}px`;
	}
}

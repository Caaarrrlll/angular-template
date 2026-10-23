import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChange } from "@angular/core";
import { SnackbarService } from "@services/snackbar.service";
import { Subject } from "rxjs";

@Component({
	selector: "cust-carousel",
	templateUrl: "./carousel.component.html",
	styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent implements OnChanges {
	destroy$ = new Subject();
	@Input() images: any[];
	@Input() preview: "left" | "bottom" = "left";
	@Input() navigateTo: string = null;
	@Output() openDetails = new EventEmitter<string>();

	selectedImg = 0;

	constructor(private snackbarService: SnackbarService, private imageElement: ElementRef) {}

	ngOnChanges(changes: { [property: string]: SimpleChange }) {
		if (this.navigateTo) {
			let navTo = this.images.map((image) => image.name).indexOf(this.navigateTo);
			if (navTo !== -1) {
				this.selectedImg = navTo;
			} else {
				this.snackbarService.open("This image is not available", "warning");
			}
		}
		if (changes.images) {
			this.images = changes.images.currentValue;
		}
	}

	next() {
		if (this.imageElement.nativeElement.querySelector(".selectedNext")) {
			this.imageElement.nativeElement.querySelector(".selectedNext").scrollIntoView({ behavior: "smooth" });
		} else {
			this.imageElement.nativeElement.querySelector(".selected").scrollIntoView({ behavior: "smooth" });
		}
		if (this.selectedImg < this.images.length - 1) {
			this.selectedImg++;
			this.openDetails.emit(this.images[this.selectedImg].name);
			return;
		}
		this.selectedImg = 0;
	}

	prev() {
		if (this.selectedImg > 0) {
			this.selectedImg--;
			this.openDetails.emit(this.images[this.selectedImg].name);
			return;
		}
		this.selectedImg = this.images.length - 1;
	}
}

import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { RoadworthyApiService } from "src/app/apis/roadworthy/roadworthy-api.service";
import { _DekraButtonType } from "./dekra-button-type.enum";

@Component({
	selector: "cust-dekra-button",
	templateUrl: "./cust-dekra-button.component.html",
	styleUrls: ["./cust-dekra-button.component.scss"],
})
export class CustDekraButtonComponent implements OnInit, OnDestroy {
	@Input() vinNumber: string;
	@Input() hasDekraReport = false;
	@Input() avatar: boolean = false;
	@Input() noPadding: boolean = false;
	@Input() dekraButtonType: _DekraButtonType = null;
	isDekraLoading: boolean = false;
	reportSubscription$: Subscription;
	greenLogo: boolean = false;
	goldLogo: boolean = false;
	platinumLogo: boolean = false;

	constructor(private dekraButtonService: RoadworthyApiService) {}
	ngOnInit() {
		if (this.dekraButtonType !== null) {
			switch (this.dekraButtonType) {
				case _DekraButtonType.Gold: {
					this.goldLogo = true;
					break;
				}
				case _DekraButtonType.Platinum: {
					this.platinumLogo = true;
					break;
				}
				default: {
					this.greenLogo = true;
					break;
				}
			}
		}
	}

	ngOnDestroy(): void {
		if (this.reportSubscription$) {
			this.reportSubscription$.unsubscribe();
		}
	}

	openDekraReport(): void {
		this.isDekraLoading = true;

		this.reportSubscription$ = this.dekraButtonService.getDekraReport(this.vinNumber).subscribe((res) => {
			this.openPdfInNewTab(res.content);
			this.isDekraLoading = false;
		});
	}

	openPdfInNewTab(data: string): void {
		var byteCharacters = atob(data);
		var byteNumbers = new Array(byteCharacters.length);
		for (var i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		var byteArray = new Uint8Array(byteNumbers);
		var file = new Blob([byteArray], { type: "application/pdf;base64" });
		var fileURL = URL.createObjectURL(file);
		window.open(fileURL);
		this.isDekraLoading = false;
	}
}

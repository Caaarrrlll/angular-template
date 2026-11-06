import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class openPageService {
	openInNewTab: boolean = false;
	constructor(private _router: Router) {
		this.openInNewTab = localStorage.getItem("operations_open_in_new_tab") == "true";
	}

	openPage(url: string, queryParam?: NavigationExtras): void {
		this.openInNewTab = localStorage.getItem("operations_open_in_new_tab") == "true";
		if (this.openInNewTab) {
			window.open(url, "_blank", "noreferrer");
		} else {
			this._router.navigate([url], queryParam);
		}
	}

	goToStockItem(stockNumber: string): void {
		this.openPage(`/stock/${stockNumber}`);
	}

	goToVehicleOnWeb(stockNumber: string): void {
		window.open(`https://www.webuycars.co.za/buy-a-car/${stockNumber}`, "_blank", "noreferrer");
	}

	goToStockItemPricing(stockNumber: string): void {
		this.openPage(`/pricing/stock/${stockNumber}`);
	}

	goToBuyLead(buyLeadCode: string): void {
		this.openPage(`/blms/lead/${buyLeadCode}`);
	}

	goToConcern(concernId: number): void {
		this.openInNewTab = localStorage.getItem("operations_open_in_new_tab") == "true";
		if (this.openInNewTab) {
			this.openPage(`concerns/inbox/details?complaintId=${concernId}`);
		} else {
			this.openPage(`concerns/inbox/details`, { queryParams: { complaintId: concernId } });
		}
	}

	goToConcernAdd(): void {
		this.openPage(`concerns/inbox/add`);
	}

	goToConcernLeadDetails(leadId: number, concernId: number): void {
		if (this.openInNewTab) {
			this.openPage(`slms/lead-details?leadId=${leadId}&concernId=${concernId}`);
		} else {
			this.openPage(`slms/lead-details`, { queryParams: { leadId: leadId, concernId: concernId } });
		}
	}

	goToSaleLeadDetails(leadId: number): void {
		if (this.openInNewTab) {
			this.openPage(`slms/lead-details?leadId=${leadId}`);
		} else {
			this.openPage(`slms/lead-details`, { queryParams: { leadId: leadId } });
		}
	}
}

import { Service, inject } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";

const openInNewTabStorageKey = "operations_open_in_new_tab";

@Service()
export class OpenPageService {
	private readonly router = inject(Router);

	openInNewTab(): boolean {
		return localStorage.getItem(openInNewTabStorageKey) === "true";
	}

	openPage(url: string, queryParam?: NavigationExtras): void {
		if (this.openInNewTab()) {
			window.open(url, "_blank", "noreferrer");
			return;
		}
		this.router.navigate([url], queryParam);
	}
}

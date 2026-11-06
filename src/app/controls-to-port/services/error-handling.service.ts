import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { SnackbarService } from "@services/snackbar.service";

@Injectable({
	providedIn: "root",
})
export class ErrorHandlingService implements ErrorHandler {
	constructor(private snackbarService: SnackbarService) {}

	handleError(error: Error | HttpErrorResponse) {
		if (!environment.production) {
			console.error(error);
		}
		if (error instanceof HttpErrorResponse) {
			// Server error happened
			if (!navigator.onLine) {
				// No Internet connection
				return this.snackbarService.open("No Internet Connection", "error");
			}

			let errMessage = error.error?.title ? error.error.title : typeof error.error == "string" ? error.error : error.message;
			// Http Error
			this.snackbarService.open(`${error.status} - ${errMessage}`, "error");
		} else {
			// Client Error Happened
			this.snackbarService.open(error.message, "error");
		}
	}
}

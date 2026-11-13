import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Service, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { LoggerService } from "@shared/services/logger.service";
import { SnackbarService } from "@shared/services/snackbar.service";

@Service()
export class ErrorHandlingService implements ErrorHandler {
	private readonly snackbarService = inject(SnackbarService);
	private readonly logger = inject(LoggerService);

	handleError(error: Error | HttpErrorResponse): void {
		if (environment.environmentName !== "production") {
			this.logger.error(error);
		}
		if (error instanceof HttpErrorResponse) {
			// Server error happened
			if (!navigator.onLine) {
				// No Internet connection
				this.snackbarService.open("No Internet Connection", "error");
				return;
			}

			const errMessage = error.error?.title ? error.error.title : typeof error.error === "string" ? error.error : error.message;
			// Http Error
			this.snackbarService.open(`${error.status} - ${errMessage}`, "error");
		} else {
			// Client Error Happened
			this.snackbarService.open(error.message, "error");
		}
	}
}

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

			const errorBody: unknown = error.error;
			const errorTitle: unknown = typeof errorBody === "object" && errorBody !== null && "title" in errorBody ? (errorBody as { title?: unknown }).title : undefined;
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: an empty-string title must fall back to the body or message
			const errMessage: unknown = errorTitle ? errorTitle : typeof errorBody === "string" ? errorBody : error.message;
			// Http Error
			this.snackbarService.open(`${String(error.status)} - ${String(errMessage)}`, "error");
		} else {
			// Client Error Happened
			this.snackbarService.open(error.message, "error");
		}
	}
}

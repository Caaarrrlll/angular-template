import { HttpErrorResponse } from "@angular/common/http";
import { inject, Pipe, PipeTransform } from "@angular/core";
import { LoggerService } from "@shared/services/logger.service";
import { isObservable, of } from "rxjs";
import { catchError, map, startWith } from "rxjs/operators";

@Pipe({ name: "apiResponse", standalone: true })
export class ApiResponsePipe implements PipeTransform {
	private readonly logger = inject(LoggerService);

	transform(apiCall: any, ignoreNotFound: boolean = true): any {
		return isObservable(apiCall)
			? apiCall.pipe(
					map((payload: any) => {
						return payload?.type === "error"
							? { loading: false, error: true }
							: {
									loading: payload?.type === "start",
									payload: payload?.type ? payload?.value : payload,
							  };
					}),
					startWith({ loading: true }),
					catchError((error: unknown) => {
						if (error instanceof HttpErrorResponse && error.status === 404 && ignoreNotFound) {
							return of({ loading: false, noData: true });
						}

						this.logger.error(error);
						return of({ loading: false, error: true });
					})
			  )
			: apiCall;
	}
}

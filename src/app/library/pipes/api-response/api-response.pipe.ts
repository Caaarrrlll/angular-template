import { HttpErrorResponse } from "@angular/common/http";
import { inject, Pipe, PipeTransform } from "@angular/core";
import { LoggerService } from "@shared/services/logger.service";
import { isObservable, of, Observable } from "rxjs";
import { catchError, map, startWith } from "rxjs/operators";

export interface ApiResponseState {
	loading?: boolean;
	payload?: unknown;
	error?: boolean;
	noData?: boolean;
}

/** Envelope shape used by API streams that signal loading/error state themselves. */
interface ApiResponseEnvelope {
	type?: unknown;
	value?: unknown;
}

@Pipe({ name: "apiResponse", standalone: true })
export class ApiResponsePipe implements PipeTransform {
	private readonly logger = inject(LoggerService);

	transform(apiCall: Observable<unknown> | null | undefined, ignoreNotFound?: boolean): Observable<ApiResponseState> | undefined;
	transform(apiCall: unknown, ignoreNotFound?: boolean): unknown;
	transform(apiCall: unknown, ignoreNotFound = true): unknown {
		return isObservable(apiCall)
			? apiCall.pipe(
					map((payload: unknown): ApiResponseState => {
						const envelope: ApiResponseEnvelope | null = typeof payload === "object" && payload !== null ? payload : null;
						return envelope?.type === "error"
							? { loading: false, error: true }
							: {
									loading: envelope?.type === "start",
									payload: envelope?.type ? envelope.value : payload,
								};
					}),
					startWith({ loading: true }),
					catchError((error: unknown) => {
						if (error instanceof HttpErrorResponse && error.status === 404 && ignoreNotFound) {
							return of({ loading: false, noData: true });
						}

						this.logger.error(error);
						return of({ loading: false, error: true });
					}),
				)
			: apiCall;
	}
}

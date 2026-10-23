import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "@models/user";
import { LoginService } from "@services/login.service";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(public loginService: LoginService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// check if the current users token hasn't expired
		const currentUser = this.loginService.currentUserValue;
		if (currentUser && currentUser.token) {
			if (!request.headers.get("excludeauthorization")) {
				request = this.addHeaders(request, currentUser);
			}
		}

		return next.handle(request).pipe(
			catchError((error) => {
				if (error instanceof HttpErrorResponse && error.status === 401) {
					// This should only happen if the user had an active session Prior. Otherwise upon first time login logic will fail.
					if (currentUser) {
						return this.handle401Error(request, next);
					} else {
						return throwError(() => {
							throw error;
						});
					}
				} else {
					return throwError(() => {
						throw error;
					});
				}
			})
		);
	}

	private addHeaders(request: HttpRequest<any>, currentUser: User) {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${currentUser.token}`,
			},
			// url: this.lowerBaseUrl(request.url),
		});
	}

	// private lowerBaseUrl(url: string): string {
	// 	const urlArray: string[] = url.split("?");
	// 	urlArray[0] = urlArray[0].toLowerCase();
	// 	return urlArray.join("?");
	// }

	private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
		const currentUser = this.loginService.currentUserValue;
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);

			return this.loginService.refreshToken().pipe(
				switchMap((token: any) => {
					this.isRefreshing = false;
					if (token != null) {
						this.refreshTokenSubject.next(token.token);
					} else {
						this.refreshTokenSubject.next(null);
					}
					return next.handle(this.addHeaders(request, currentUser));
				})
			);
		} else {
			return this.refreshTokenSubject.pipe(
				filter((token) => token != null),
				take(1),
				switchMap((jwt) => {
					return next.handle(this.addHeaders(request, currentUser));
				})
			);
		}
	}
}

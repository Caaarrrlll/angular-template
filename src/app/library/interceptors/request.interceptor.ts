import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoginService } from "@shared/services/login.service";

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
	const loginService = inject(LoginService);
	const currentUser = loginService.currentUserValue;
	if (currentUser?.token && !request.headers.get("excludeauthorization")) {
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${currentUser.token}`,
			},
		});
	}
	return next(request);
};

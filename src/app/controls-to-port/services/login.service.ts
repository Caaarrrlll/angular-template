import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@environments/environment";
import { User } from "@models/user";
import { NotificationService } from "@services/notification.service";
import jwt_decode from "jwt-decode";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class LoginService {
	public currentUser: Observable<User>;
	decodedToken: any;
	private currentUserSubject: BehaviorSubject<User>;

	constructor(private http: HttpClient, private router: Router, private _notificationService: NotificationService) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUser")));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	validateUser() {
		return true;
	}

	login(username: string, password: string): Observable<User> {
		const formData = this.buildLoginHeader(username, password);
		return this.http.post<any>(`${environment.identityAuthenticationEndPoint}/connect/token`, formData).pipe(
			map((data) => {
				// login successfull if there's a jwt token in the response
				const user = new User();
				if (data && data.access_token) {
					const payload: any = jwt_decode(data.access_token);
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					if (payload.given_name) {
						user.fullName = payload.given_name + " " + payload.family_name;
					} else {
						user.fullName = payload.preferred_username;
					}
					user.username = payload.preferred_username;
					user.token = data.access_token;
					user.refreshToken = data.refresh_token;
					user.firstName = payload.given_name;
					user.lastName = payload.family_name;
					user.email = payload.email ?? payload.preferred_username;
					localStorage.setItem("currentUser", JSON.stringify(user));
					this.decodedToken = payload;
					this.currentUserSubject.next(user);
					let hasClaims = this.userHasClaim("we_support_admin") || this.userHasClaim("we_support_support");
					this._notificationService.startHubConnection(user, hasClaims);
				}
				return user;
			})
		);
	}

	isAuthenticated(): Observable<boolean> {
		if (this.currentUserSubject.value !== null) {
			if (this.isTokenExpired(this.currentUserValue.token)) {
				// Token expired
				if (this.isTokenExpired(this.currentUserValue.refreshToken)) {
					// The Refresh token has expired
					return of(false);
				} else {
					// Try refresh the token
					return this.refreshToken().pipe(
						map((response) => {
							return true;
						}),
						catchError((error) => {
							// this.snackBar.open('The access token could not be refreshed:' + error);
							return of(false);
						})
					);
				}
			}
			// The Token has not expired
			let hasClaims = this.userHasClaim("we_support_admin") || this.userHasClaim("we_support_support");
			this._notificationService.startHubConnection(this.currentUserSubject.value, hasClaims);

			return of(true);
		} else {
			return of(false);
		}
	}

	refreshToken(): Observable<any> {
		if (this.currentUserValue) {
			this._notificationService.closeHubConnection();
			const request = this.buildTokenRefreshRequest();

			return this.http.post<any>(`${environment.identityAuthenticationEndPoint}/connect/token`, request).pipe(
				map((data: any) => {
					if (data && data.access_token) {
						const user = this.currentUserSubject.value;
						user.token = data.access_token;
						user.refreshToken = data.refresh_token;
						this.decodedToken = jwt_decode(this.currentUserValue.token);
						let hasClaims = this.userHasClaim("we_support_admin") || this.userHasClaim("we_support_support");
						this._notificationService.startHubConnection(user, hasClaims);
						localStorage.setItem("currentUser", JSON.stringify(user));
					}
				})
			);
		}
	}

	isTokenExpired(token?: string): boolean {
		if (this.currentUserValue == null) {
			return true;
		}
		if (!token) {
			token = this.currentUserValue.token;
		}
		if (!token) {
			return true;
		}

		const date = this.getTokenExpirationDate(token);
		if (date === undefined) {
			return false;
		}
		return !(date.valueOf() > new Date().valueOf());
	}

	getTokenExpirationDate(token: string): Date {
		try {
			const decoded: any = jwt_decode(token);

			if (decoded.exp === undefined) {
				return null;
			}
			const date = new Date(0);
			date.setUTCSeconds(decoded.exp);
			return date;
		} catch {
			return undefined;
		}
	}

	getSubject(): string {
		if (!this.currentUserValue) {
			return "";
		}

		const payload: any = jwt_decode(this.currentUserValue.token);

		return payload.sub;
	}

	getUserClaimsCsv(): string {
		if (!this.currentUserValue) {
			return "";
		}
		const roles = this.getClaims();

		return roles.join(",");
	}

	getClaims(): string[] {
		if (!this.currentUserValue) {
			return [];
		}

		const claims = [];

		if (!this.decodedToken) {
			this.decodedToken = jwt_decode(this.currentUserValue.token);
		}

		for (const claim in this.decodedToken) {
			if (this.decodedToken.hasOwnProperty(claim)) {
				claims.push(claim);
			}
		}

		return claims;
	}

	getApiClaims(prefix: string): string[] {
		if (!this.currentUserValue) {
			return [];
		}

		const claims = [];

		if (!this.decodedToken) {
			this.decodedToken = jwt_decode(this.currentUserValue.token);
		}

		for (const claim in this.decodedToken) {
			if (this.decodedToken.hasOwnProperty(claim)) {
				if (claim.indexOf(prefix) === 0) {
					claims.push(claim);
				}
			}
		}

		return claims;
	}

	getClaimsFromPayLoad(payload: any): string[] {
		if (!payload) {
			return [];
		}
		const claims = [];

		for (const claim in payload) {
			if (payload.hasOwnProperty(claim)) {
				if (claim.indexOf(environment.IdentityServer.claimPermissionPrefix) === 0) {
					claims.push(claim);
				}
			}
		}

		return claims;
	}

	logout() {
		// remove user from local storage to log user out
		this.decodedToken = null;
		this._notificationService.closeHubConnection();
		localStorage.removeItem("currentUser");
		sessionStorage.clear();
		this.currentUserSubject.next(null);
		this.router.navigate([environment.IdentityServer.loginUrl]);
	}

	buildLoginHeader(username: string, password: string): FormData {
		const formData: FormData = new FormData();
		formData.append("client_id", environment.IdentityServer.clientID);
		let scopes = "";
		environment.IdentityServer.scopes.forEach((scope) => {
			scopes += scope + " ";
		});
		scopes = scopes.trim();
		formData.append("scope", scopes);
		formData.append("grant_type", environment.IdentityServer.grantType);
		formData.append("username", username);
		formData.append("password", password);
		return formData;
	}

	public userHasClaim(searchforClaim: string): boolean {
		let result = false;
		const claims = this.getClaims();
		claims.map((claim) => {
			if (claim === searchforClaim) {
				result = true;
			}
		});
		return result;
	}

	userHasRequiredClaims(requiredClaims: any): boolean {
		if (!this.decodedToken) {
			this.decodedToken = jwt_decode(this.currentUserValue.token);
		}

		return requiredClaims.some((claim) => {
			return this.decodedToken[claim] ? true : false;
		});
	}

	private buildTokenRefreshRequest() {
		const formData: FormData = new FormData();
		formData.append("client_id", environment.IdentityServer.clientID);
		let scopes = "";
		environment.IdentityServer.scopes.forEach((scope) => {
			scopes += scope + " ";
		});
		scopes = scopes.trim();
		formData.append("scope", scopes);
		formData.append("grant_type", "refresh_token");
		formData.append("refresh_token", this.currentUserValue.refreshToken);
		return formData;
	}
}

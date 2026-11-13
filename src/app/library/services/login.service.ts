import { Service, signal } from "@angular/core";
import { _User } from "@shared/models/user";

export interface _JwtPayload {
	sub?: string;
	exp?: number;
	[key: string]: unknown;
}

const currentUserStorageKey = "currentUser";

@Service()
export class LoginService {
	readonly currentUser = signal<_User | null>(this.readStoredUser());

	public get currentUserValue(): _User | null {
		return this.currentUser();
	}

	setUser(user: _User): void {
		localStorage.setItem(currentUserStorageKey, JSON.stringify(user));
		this.currentUser.set(user);
	}

	clearUser(): void {
		localStorage.removeItem(currentUserStorageKey);
		this.currentUser.set(null);
	}

	decodeToken(token: string): _JwtPayload | null {
		try {
			const payloadBase64Url = token.split(".")[1];
			if (!payloadBase64Url) {
				return null;
			}
			const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
			const payloadJson = decodeURIComponent(
				atob(base64)
					.split("")
					.map((character) => `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`)
					.join("")
			);
			return JSON.parse(payloadJson) as _JwtPayload;
		} catch {
			return null;
		}
	}

	getTokenExpirationDate(token: string): Date | null {
		const payload = this.decodeToken(token);
		if (!payload?.exp) {
			return null;
		}
		return new Date(payload.exp * 1000);
	}

	isTokenExpired(token?: string): boolean {
		const targetToken = token ?? this.currentUserValue?.token;
		if (!targetToken) {
			return true;
		}
		const payload = this.decodeToken(targetToken);
		if (!payload?.exp) {
			return false;
		}
		return payload.exp * 1000 <= Date.now();
	}

	getSubject(): string {
		const payload = this.decodeToken(this.currentUserValue?.token ?? "");
		return typeof payload?.sub === "string" ? payload.sub : "";
	}

	getClaims(): string[] {
		const payload = this.decodeToken(this.currentUserValue?.token ?? "");
		return payload ? Object.keys(payload) : [];
	}

	getApiClaims(prefix: string): string[] {
		return this.getClaims().filter((claim) => claim.indexOf(prefix) === 0);
	}

	userHasClaim(searchForClaim: string): boolean {
		return this.getClaims().includes(searchForClaim);
	}

	userHasRequiredClaims(requiredClaims: string[]): boolean {
		const payload = this.decodeToken(this.currentUserValue?.token ?? "");
		return requiredClaims.some((claim) => Boolean(payload?.[claim]));
	}

	private readStoredUser(): _User | null {
		const stored = localStorage.getItem(currentUserStorageKey);
		return stored ? (JSON.parse(stored) as _User) : null;
	}
}

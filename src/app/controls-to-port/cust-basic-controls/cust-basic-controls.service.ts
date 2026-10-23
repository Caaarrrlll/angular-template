import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class CustBasicControlService {
	constructor() {}

	public emailValidation(email: string): boolean {
		const emailRegex = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}

	public phoneValidation(phone: string, length: number): boolean {
		const pattern = new RegExp(`^[0-9]{${length}}$`);
		return pattern.test(phone);
	}
}

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Countries with a national identity number format. South Africa plus its neighbours for now;
 * add a country (code + rule below) as the need arises.
 */
export type _IdNumberCountry = "ZA" | "NA" | "BW" | "LS" | "MZ" | "SZ" | "ZW";

interface _IdNumberRule {
	/** Applied after spaces and hyphens are removed. */
	pattern: RegExp;
	/** The first six digits are a date of birth (YYMMDD). */
	birthDatePrefix?: boolean;
	/** Extra structural check (e.g. a checksum) on the normalised value. */
	check?: (value: string) => boolean;
}

/**
 * Format rules per country. ZA is a full check (date of birth, citizenship digit, Luhn checksum).
 * The other countries are format checks from public descriptions of each ID; LS and MZ are lenient and
 * **unconfirmed**: verify them against real samples before relying on them in production.
 */
const ID_NUMBER_RULES: Readonly<Record<_IdNumberCountry, _IdNumberRule>> = {
	// South Africa: YYMMDD SSSS C A Z — 13 digits; C = citizenship (0 citizen, 1 permanent resident, 2 refugee); Z = Luhn check digit.
	ZA: { pattern: /^\d{13}$/, birthDatePrefix: true, check: (value: string): boolean => ["0", "1", "2"].includes(value.charAt(10)) && passesLuhn(value) },
	// Namibia: 11 digits, starting with the date of birth.
	NA: { pattern: /^\d{11}$/, birthDatePrefix: true },
	// Botswana (Omang): 9 digits; the 5th digit is 1 (male) or 2 (female).
	BW: { pattern: /^\d{4}[12]\d{4}$/ },
	// Eswatini: 13 digits, starting with the date of birth.
	SZ: { pattern: /^\d{13}$/, birthDatePrefix: true },
	// Zimbabwe: 2-digit registration district, 6–7 digits, a check letter, 2-digit district of origin (e.g. 63-123456 A 42).
	ZW: { pattern: /^\d{8,9}[A-Z]\d{2}$/i },
	// Mozambique (BI): 12 digits followed by a letter — unconfirmed.
	MZ: { pattern: /^\d{12}[A-Z]$/i },
	// Lesotho: numeric national ID — length unconfirmed, so 8–13 digits are accepted.
	LS: { pattern: /^\d{8,13}$/ },
};

/**
 * Validates a national identity number for `country` (default South Africa). Empty values are valid (combine with `Validators.required`).
 * Spaces and hyphens are ignored. Error: `{ invalidIdNumber: { value, country } }`.
 *
 * @example
 *      idNumber: ["", [Validators.required, idNumberValidator()]],          // South Africa
 *      idNumber: ["", [idNumberValidator("BW")]],                           // Botswana
 */
export function idNumberValidator(country: _IdNumberCountry = "ZA"): ValidatorFn {
	const rule: _IdNumberRule = ID_NUMBER_RULES[country];
	return (control: AbstractControl): ValidationErrors | null => {
		const value: unknown = control.value;
		if (value === null || value === undefined || value === "") {
			return null;
		}
		// Only text and numbers can be ID numbers; anything else normalises to "" and fails the pattern.
		const raw: string = typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
		const normalised: string = raw.replace(/[\s-]/g, "");
		const valid: boolean = rule.pattern.test(normalised) && (!rule.birthDatePrefix || isBirthDate(normalised.slice(0, 6))) && (rule.check === undefined || rule.check(normalised));
		return valid ? null : { invalidIdNumber: { value, country } };
	};
}

/** YYMMDD is a real calendar date (the century is unknown, so 29 February is accepted for any year divisible by 4). */
function isBirthDate(yymmdd: string): boolean {
	const year = Number(yymmdd.slice(0, 2));
	const month = Number(yymmdd.slice(2, 4));
	const day = Number(yymmdd.slice(4, 6));
	if (month < 1 || month > 12 || day < 1) {
		return false;
	}
	const daysInMonth: number[] = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return day <= daysInMonth[month - 1];
}

/** Luhn (mod 10) checksum over a digit string whose last digit is the check digit. */
function passesLuhn(digits: string): boolean {
	let sum = 0;
	for (let index = 0; index < digits.length; index++) {
		let digit = Number(digits.charAt(digits.length - 1 - index));
		if (index % 2 === 1) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		sum += digit;
	}
	return sum % 10 === 0;
}

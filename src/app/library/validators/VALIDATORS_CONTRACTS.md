# Validator Contracts

This file documents the shared validators in `src/app/library/validators`. Review it before creating a validator, and update it whenever a validator is added, changed, or removed.

## Validator Index

| Validator Function          | File                             | Type                        | Summary                                                                            |
| --------------------------- | -------------------------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `atLeastNValid`             | `at-least-n-valid.validator.ts`  | FormGroup validator factory | Requires at least N controls in a form group to be valid and non-empty.            |
| `numberComparisonValidator` | `number-comparison.validator.ts` | FormGroup validator factory | Validates that one control value is not greater than another (form group level).   |
| `emailValidator`            | `email.validator.ts`             | Control validator factory   | Validates email format; returns null if empty.                                     |
| `idNumberValidator`         | `identity-number.validator.ts`   | Control validator factory   | National ID number for a country (ZA default + neighbours); returns null if empty. |

## Usage

```ts
import { FormBuilder } from "@angular/forms";
import { atLeastNValid } from "@shared/validators/at-least-n-valid.validator";
import { emailValidator } from "@shared/validators/email.validator";

form = this.fb.group(
	{
		email: ["", [emailValidator()]],
	},
	{ validators: [atLeastNValid(1)] },
);
```

## idNumberValidator

- **Signature:** `idNumberValidator(country: _IdNumberCountry = "ZA"): ValidatorFn`; `_IdNumberCountry` = `"ZA" | "NA" | "BW" | "LS" | "MZ" | "SZ" | "ZW"`.
- **Behaviour:** empty values are valid (pair with `Validators.required`); spaces and hyphens are ignored; error `{ invalidIdNumber: { value, country } }`.
- **Rules:**

| Country         | Check                                                                                | Confidence                                       |
| --------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------ |
| ZA South Africa | 13 digits; YYMMDD birth date; citizenship digit 0/1/2; Luhn check digit              | Full check                                       |
| NA Namibia      | 11 digits; YYMMDD birth date                                                         | Format check                                     |
| BW Botswana     | 9 digits (Omang); 5th digit 1 or 2                                                   | Format check                                     |
| SZ Eswatini     | 13 digits; YYMMDD birth date                                                         | Format check                                     |
| ZW Zimbabwe     | 2-digit district, 6–7 digits, check letter, 2-digit district (e.g. `63-123456 A 42`) | Format check (check letter not computed)         |
| MZ Mozambique   | 12 digits + a letter (BI)                                                            | **Unconfirmed**: verify against real samples     |
| LS Lesotho      | 8–13 digits                                                                          | **Unconfirmed / lenient**: verify before relying |

- **Adding a country:** add its code to `_IdNumberCountry` and a rule (`pattern`, optional `birthDatePrefix`, optional `check`) to `ID_NUMBER_RULES` as the need arises.
- **Changed 2026-11-20:** was a South-Africa-only regex that was not anchored (any string containing a matching substring passed) and had no checksum; `idNumberValidator()` with no argument keeps South Africa but is now strict.
- **Example:** `idNumber: ["", [Validators.required, idNumberValidator("BW")]]`

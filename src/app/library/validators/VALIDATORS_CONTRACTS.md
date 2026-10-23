# Validator Contracts

This file documents the shared validators in `src/app/library/validators`. Review it before creating a validator, and update it whenever a validator is added, changed, or removed.

> Validators in `src/app/controls-to-port/validators` are legacy code and are not yet part of this contract. Add them here as they are migrated.

## Validator Index

| Validator Function | File | Type | Summary |
| --- | --- | --- | --- |
| `atLeastNValid` | `at-least-n-valid.validator.ts` | FormGroup validator factory | Requires at least N controls in a form group to be valid and non-empty. |
| `numberComparisonValidator` | `number-comparison.validator.ts` | FormGroup validator factory | Validates that one control value is not greater than another (form group level). |
| `emailValidator` | `email.validator.ts` | Control validator factory | Validates email format; returns null if empty. |
| `idNumberValidator` | `identity-number.validator.ts` | Control validator factory | Validates identity number format; returns null if empty. |

## Usage

```ts
import { FormBuilder } from "@angular/forms";
import { atLeastNValid } from "@shared/validators/at-least-n-valid.validator";
import { emailValidator } from "@shared/validators/email.validator";

form = this.fb.group({
  email: ["", [emailValidator()]],
}, { validators: [atLeastNValid(1)] });
```

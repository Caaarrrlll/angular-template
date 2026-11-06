# Pipe Contracts

This file documents the shared pipes in `src/app/library/pipes`. Review it before creating a new pipe, and update it whenever a pipe is added, changed, or removed.

> Pipes in `src/app/controls-to-port/pipes` are legacy code and are not yet part of this contract. Add them here as they are migrated.

## Pipe Index

| Pipe | Name | File | Standalone | Summary |
| --- | --- | --- | --- | --- |
| `AbsolutePipe` | `absolute` | `absolute/absolute.pipe.ts` | Yes | Returns the absolute value of a number. |
| `ApiResponsePipe` | `apiResponse` | `api-response/api-response.pipe.ts` | Yes | Converts an observable API call into loading, payload, error, and no-data view states. |
| `CamelToTitlePipe` | `camelToTitle` | `camel-to-title/camel-to-title.pipe.ts` | Yes | Splits camelCase text and capitalizes the first character. |
| `CurrencyInStringPipe` | `currencyInString` | `currency-in-string/currency-in-string.pipe.ts` | Yes | Formats numbers embedded in a string as ZAR currency. |
| `DayAndHoursPipe` | `dayAndHours` | `day-and-hours/day-and-hours.pipe.ts` | Yes | Formats a date as elapsed days and hours from now. |
| `FormatNullTextPipe` | `formatNull` | `format-null/format-null.pipe.ts` | Yes | Replaces null or undefined with a fallback string. |
| `ObscureTextPipe` | `obscureText` | `obscure-text/obscure-text.pipe.ts` | Yes | Masks all but the last N characters. |
| `PascalToTitlePipe` | `pascalToTitle` | `pascal-to-title/pascal-to-title.pipe.ts` | Yes | Splits PascalCase text and capitalizes the first character. |
| `PostfixPipe` | `postfix` | `postfix/postfix.pipe.ts` | Yes | Appends a suffix, optionally separated by a space. |
| `RemoveSpacesPipe` | `removeSpaces` | `remove-spaces/remove-spaces.pipe.ts` | Yes | Removes whitespace and selected punctuation, then uppercases. |
| `RemoveUnderscorePipe` | `removeUnderscore` | `remove-underscore/remove-underscore.pipe.ts` | Yes | Replaces underscores with spaces. |
| `RoundToNthPipe` | `roundToNth` | `round-to-nth/round-to-nth.pipe.ts` | Yes | Rounds a number to N decimal places. |
| `SafePipe` | `safe` | `safe/safe.pipe.ts` | Yes | Bypasses resource URL sanitization. |
| `SpaceBetweenUppercasePipe` | `spaceBetweenUppercase` | `space-between-uppercase/space-between-uppercase.pipe.ts` | Yes | Inserts a space between an uppercase letter and a following lowercase letter. |
| `ThousandSeparatorPipe` | `thousandSeparator` | `thousand-separator/thousand-separator.pipe.ts` | Yes | Groups digit runs with spaces. |
| `TruncatePipe` | `truncate` | `truncate/truncate.pipe.ts` | Yes | Truncates text to a maximum length and appends a trailing string. |

## ApiResponsePipe

- **Purpose:** Normalises an observable API call into a view-model stream that templates can use without handling loading and error states themselves.
- **Inputs:**
  - `apiCall`: An observable API response. Non-observable values are returned unchanged.
  - `ignoreNotFound`: Defaults to `true`. When `true`, a `404` response produces `{ loading: false, noData: true }` without logging an error.
- **Output states:**
  - `{ loading: true }` while waiting for the response.
  - `{ loading: false, payload: value }` when the response succeeds.
  - `{ loading: false, error: true }` when the response fails.
  - `{ loading: false, noData: true }` when a `404` is ignored.
- **Error handling:** Non-ignored errors are logged through `LoggerService.error()`.
- **Example:**

  ```html
  <ng-container *ngIf="users$ | apiResponse | async as result">
    <app-loader *ngIf="result.loading"></app-loader>
    <app-error *ngIf="result.error"></app-error>
    <app-empty *ngIf="result.noData"></app-empty>
    <app-list *ngIf="result.payload" [items]="result.payload"></app-list>
  </ng-container>
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/api-response-pipe`. The legacy `ApiResponseModule` was removed; the pipe is standalone.

## TruncatePipe

- **Purpose:** Shortens long text so table cells and labels do not overflow.
- **Inputs:**
  - `text`: The string to truncate.
  - `size`: Maximum number of characters to keep.
  - `trail`: Optional suffix appended when text is truncated. Defaults to `...`.
- **Output:** The original string when it fits, otherwise the first `size` characters followed by `trail`.
- **Example:**

  ```html
  {{ longDescription | truncate: 85 }}
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/truncate.pipe.ts`; now standalone.

## AbsolutePipe

- **Purpose:** Returns the absolute value of a number.
- **Inputs:**
  - `value`: number to convert.
- **Output:** Non-negative number.
- **Example:**

  ```html
  {{ -5 | absolute }}
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/absolute.pipe.ts`; now standalone.

## CamelToTitlePipe

- **Purpose:** Splits camelCase text and capitalizes the first character.
- **Inputs:**
  - `text`: string to format.
- **Output:** Formatted string.
- **Example:**

  ```html
  {{ "camelCase" | camelToTitle }}
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/camel-to-title.pipe.ts`; now standalone.

## CurrencyInStringPipe

- **Purpose:** Formats numbers embedded in a string as ZAR currency.
- **Inputs:**
  - `value`: string containing one or more numeric values.
- **Output:** The original string with each numeric value replaced by a ZAR currency string.
- **Example:**

  ```html
  {{ "Invoice 1234,50" | currencyInString }}
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/currency-in-string-pipe/currency-in-string.pipe.ts`; uses `formatCurrency` with `LOCALE_ID` and is now standalone.

## DayAndHoursPipe

- **Purpose:** Formats a date as elapsed days and hours from now.
- **Inputs:**
  - `value`: date-like value to compare with the current date.
- **Output:** String in the form `"N Days: M Hours"`, or an empty string for a falsy value.
- **Example:**

  ```html
  {{ createdAt | dayAndHours }}
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/day-and-hour-pipe/day-and-hours.pipe.ts`; now standalone.

## FormatNullTextPipe

- **Purpose:** Replaces null or undefined with a fallback string.
- **Inputs:**
  - `value`: value to inspect.
  - `replaceText`: fallback text, default `"-"`.
- **Output:** `replaceText` for null or undefined; otherwise the original value.
- **Example:**

  ```html
  {{ value | formatNull }}
  {{ value | formatNull: "N/A" }}
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/format-null-pipe/format-null-text.pipe.ts`; template name remains `formatNull`; now standalone.

## ObscureTextPipe

- **Purpose:** Masks all but the last N characters.
- **Inputs:**
  - `value`: string to obscure.
  - `keepLast`: number of trailing characters to keep visible, default `4`.
- **Output:** String with the leading characters replaced by `*`, or an empty string for a falsy value.
- **Example:**

  ```html
  {{ "1234567890" | obscureText: 4 }}
  ```

  Outputs `******7890`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/obscure-text-pipe/obscure-text.pipe.ts`; now standalone.

## PascalToTitlePipe

- **Purpose:** Splits PascalCase text and capitalizes the first character.
- **Inputs:**
  - `text`: string to format.
- **Output:** Formatted string with spaces before capital-letter runs and an uppercase first character.
- **Example:**

  ```html
  {{ "pascalCase" | pascalToTitle }}
  ```

  Outputs `Pascal Case`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/pascal-to-title-pipe/pascal-to-title.pipe.ts`; now standalone.

## PostfixPipe

- **Purpose:** Appends a suffix, optionally separated by a space.
- **Inputs:**
  - `value`: value to append to.
  - `sign`: suffix text.
  - `addSpace`: whether to insert a space before the suffix, default `true`.
  - `noValue`: fallback text for null or undefined, default `"-"`.
- **Output:** Value with the suffix appended, or `noValue` for null or undefined.
- **Example:**

  ```html
  {{ 12 | postfix: "km" }}
  ```

  Outputs `12 km`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/postfix/postfix.pipe.ts`; now standalone.

## RemoveSpacesPipe

- **Purpose:** Removes whitespace and selected punctuation, then uppercases the result.
- **Inputs:**
  - `text`: string to clean.
- **Output:** Uppercased string without whitespace or `,@#$%^&*()/` characters.
- **Example:**

  ```html
  {{ "AB 12/34" | removeSpaces }}
  ```

  Outputs `AB1234`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/remove-spaces-pipe/remove-spaces.pipe.ts`; now standalone.

## RemoveUnderscorePipe

- **Purpose:** Replaces underscores with spaces.
- **Inputs:**
  - `value`: string to format.
- **Output:** String with underscores replaced by spaces, or an empty string for a falsy value.
- **Example:**

  ```html
  {{ "first_name" | removeUnderscore }}
  ```

  Outputs `first name`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/underscore-to-title.pipe.ts`; the template name remains `removeUnderscore` and the pipe does not title-case the result; now standalone.

## RoundToNthPipe

- **Purpose:** Rounds a number to N decimal places.
- **Inputs:**
  - `value`: number to round.
  - `n`: number of decimal places, default `2`.
- **Output:** Rounded number.
- **Example:**

  ```html
  {{ 12.3456 | roundToNth: 2 }}
  ```

  Outputs `12.35`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/round-to-nth-pipe/round-to-nth.pipe.ts`; now standalone.

## SafePipe

- **Purpose:** Bypasses resource URL sanitization.
- **Inputs:**
  - `url`: resource URL to trust.
- **Output:** `SafeResourceUrl`.
- **Example:**

  ```html
  <iframe [src]="url | safe"></iframe>
  ```

- **Notes:** Migrated from `src/app/controls-to-port/pipes/safe.pipe.ts`; injects `DomSanitizer` and is now standalone. Only use with trusted URLs.

## SpaceBetweenUppercasePipe

- **Purpose:** Inserts a space between an uppercase letter and a following lowercase letter.
- **Inputs:**
  - `text`: string to format.
- **Output:** Formatted string.
- **Example:**

  ```html
  {{ "HelloWorld" | spaceBetweenUppercase }}
  ```

  Outputs `Hello World`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/space-between-uppercase-pipe/space-between-uppercase.pipe.ts`; class renamed to `SpaceBetweenUppercasePipe`; now standalone.

## ThousandSeparatorPipe

- **Purpose:** Groups digit runs with spaces.
- **Inputs:**
  - `text`: string or number to format.
- **Output:** Formatted string, or an empty string for a falsy value.
- **Example:**

  ```html
  {{ 1234567 | thousandSeparator }}
  ```

  Outputs `1 234 567`.

- **Notes:** Migrated from `src/app/controls-to-port/pipes/thousand-separator-pipe/thousand-separator.pipe.ts`; now standalone.

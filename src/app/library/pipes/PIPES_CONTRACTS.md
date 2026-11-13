# Pipe Contracts

This file documents the shared pipes in `src/app/library/pipes`. Review it before creating a new pipe, and update it whenever a pipe is added, changed, or removed.

> All pipes previously in `src/app/controls-to-port/pipes` have been migrated into this contract; the legacy folder was removed on 2026-11-13.

## Pipe Index

| Pipe | Name | File | Standalone | Summary |
| --- | --- | --- | --- | --- |
| `AbsolutePipe` | `absolute` | `absolute/absolute.pipe.ts` | Yes | Returns the absolute value of a number. |
| `ApiResponsePipe` | `apiResponse` | `api-response/api-response.pipe.ts` | Yes | Converts an observable API call into loading, payload, error, and no-data view states. |
| `CamelToTitlePipe` | `camelToTitle` | `camel-to-title/camel-to-title.pipe.ts` | Yes | Splits camelCase text and capitalizes the first character. |
| `CharacterSpacingPipe` | `characterSpacing` | `character-spacing/character-spacing.pipe.ts` | Yes | Groups string characters by the length's lowest common denominator (3-5, default 3) with spaces. |
| `ContainsPipe` | `contains` | `contains/contains.pipe.ts` | Yes | Returns whether an array contains a value or matches a predicate function. |
| `CurrencyInStringPipe` | `currencyInString` | `currency-in-string/currency-in-string.pipe.ts` | Yes | Formats numbers embedded in a string as ZAR currency. |
| `DayAndHoursPipe` | `dayAndHours` | `day-and-hours/day-and-hours.pipe.ts` | Yes | Formats a date as elapsed days and hours from now. |
| `EmailToInitialsPipe` | `emailToInitials` | `email-to-initials/email-to-initials.pipe.ts` | Yes | Takes the first and last character of an email's local part and uppercases them. |
| `FilterPipe` | `arrayFilter` | `array-filter/array-filter.pipe.ts` | Yes | Filters an array with an object of property values or a predicate function. |
| `FormatNullTextPipe` | `formatNull` | `format-null/format-null.pipe.ts` | Yes | Replaces null or undefined with a fallback string. |
| `GroupByDatePipe` | `groupByDate` | `group-by-date/group-by-date.pipe.ts` | Yes | Groups a collection by its `entryDate` property into date/leadHistory pairs. |
| `HighlightSearchMatchPipe` | `searchMatch` | `highlight-search-match/highlight-search-match.pipe.ts` | Yes | Wraps the first case-insensitive match of a search term in a `<mark>` tag. |
| `KebabToTitlePipe` | `kebabToTitle` | `kebab-to-title/kebab-to-title.pipe.ts` | Yes | Replaces the first hyphen in kebab-case text with a space. |
| `NameToInitialsPipe` | `nameToInitials` | `name-to-initials/name-to-initials.pipe.ts` | Yes | Takes the first two initials of a name and uppercases them. |
| `NearestPipe` | `nearest` | `nearest/nearest.pipe.ts` | Yes | Rounds a value to the nearest multiple of a unit. |
| `ObscureTextPipe` | `obscureText` | `obscure-text/obscure-text.pipe.ts` | Yes | Masks all but the last N characters. |
| `OrderByPipe` | `orderBy` | `order-by/order-by.pipe.ts` | Yes | Sorts an array with a comparator function. |
| `OrdinalPipe` | `ordinal` | `ordinal/ordinal.pipe.ts` | Yes | Appends an ordinal suffix (st, nd, rd, th) to a number. |
| `PascalToTitlePipe` | `pascalToTitle` | `pascal-to-title/pascal-to-title.pipe.ts` | Yes | Splits PascalCase text and capitalizes the first character. |
| `PercentagePipe` | `percentage` | `percentage/percentage.pipe.ts` | Yes | Calculates a percentage as a two-decimal string with a `%` suffix. |
| `PostfixPipe` | `postfix` | `postfix/postfix.pipe.ts` | Yes | Appends a suffix, optionally separated by a space. |
| `RemoveEmailDomainPipe` | `removeDomain` | `remove-email-domain/remove-email-domain.pipe.ts` | Yes | Strips the `@` and domain from an email address. |
| `RemoveSpacesPipe` | `removeSpaces` | `remove-spaces/remove-spaces.pipe.ts` | Yes | Removes whitespace and selected punctuation, then uppercases. |
| `RemoveUnderscorePipe` | `removeUnderscore` | `remove-underscore/remove-underscore.pipe.ts` | Yes | Replaces underscores with spaces. |
| `RoundToNthPipe` | `roundToNth` | `round-to-nth/round-to-nth.pipe.ts` | Yes | Rounds a number to N decimal places. |
| `ArraySortPipe` | `sort` | `sort/array-sort.pipe.ts` | Yes | Sorts an array of records ascending by a field. |
| `SafePipe` | `safe` | `safe/safe.pipe.ts` | Yes | Bypasses resource URL sanitization. |
| `SpaceBetweenUppercasePipe` | `spaceBetweenUppercase` | `space-between-uppercase/space-between-uppercase.pipe.ts` | Yes | Inserts a space between an uppercase letter and a following lowercase letter. |
| `ThousandSeparatorPipe` | `thousandSeparator` | `thousand-separator/thousand-separator.pipe.ts` | Yes | Groups digit runs with spaces. |
| `TimeElapsedFormatPipe` | `timeElapsedFormat` | `time-elapsed/time-elapsed.pipe.ts` | Yes (impure) | Renders a date as a relative time string. |

## CharacterSpacingPipe

- **Purpose:** Adds blank spacing to strings like bank account or phone numbers, using the string length's lowest common denominator (3-5; default 3).
- **Inputs:**
  - `text`: string to format; empty for a falsy value.
  - `startFromFront`: when `true`, spaces are grouped from the start of the string; default groups from the end.
- **Output:** Formatted string with the group spacing applied (skips leading/trailing spaces).
- **Example:**
  ```html
  {{ "502336455040" | characterSpacing }}
  ```
  Outputs `502 336 455 040`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/character-spacing.pipe.ts`; now standalone.

## ContainsPipe

- **Purpose:** Emptiness/membership check for templates. Note: pipes cannot emit function bindings cleanly; prefer `Array.prototype.some` in the component instead of using this pipe with predicates.
- **Inputs:**
  - `items`: array to inspect.
  - `someCondition`: value to look for, or a predicate function `(item) => boolean`.
- **Output:** `false` when the array or condition is falsy; otherwise whether some element matches.
- **Example:**
  ```html
  {{ items | contains: "item-1" }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/contains.pipe.ts`; now standalone.

## EmailToInitialsPipe

- **Purpose:** Initials from an email address: the first and last character of the local part (before the `@`), uppercased. When the email has no `@`, the first and last character of the whole string are used.
- **Inputs:**
  - `value`: email address.
- **Output:** Two uppercase characters, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "pietk@webuycars.co.za" | emailToInitials }}
  ```
  Outputs `PK`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/email-to-initials.pipe.ts`; now standalone.

## FilterPipe (template name `arrayFilter`)

- **Purpose:** Filters an array in templates with an object of property values or a predicate function. Note: prefer `Array.prototype.filter` in the component instead of using this pipe with predicates for anything re-rendered often (pure pipe caching does not help with changing predicate references).
- **Inputs:**
  - `items`: array to filter.
  - `filter`: object whose property values must all equal the item's properties, or a predicate function `(item) => boolean`.
- **Output:** Filtered array; an empty array when the array is falsy.
- **Example:**
  ```html
  {{ items | arrayFilter: { status: "open" } }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/filter.pipe.ts` (declaration `FilterPipe`); now standalone.

## GroupByDatePipe

- **Purpose:** Groups a collection items' `entryDate` property using `DatePipe` format `d MMMM yyyy`.
- **Inputs:**
  - `collection`: array of records with an `entryDate` property.
- **Output:** Array of `{ date: string, leadHistory: items[] }`, or `null` for a falsy collection. The output key is named `leadHistory` for compatibility with the legacy usage.
- **Example:**
  ```html
  {{ leadHistory | groupByDate }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/group-by-date.pipe.ts`; injects `DatePipe`; now standalone.

## HighlightSearchMatchPipe (template name `searchMatch`)

- **Purpose:** Wraps the first case-insensitive match of the search argument in a `<mark>` tag and preserves leading/trailing spaces with `&nbsp;`.
- **Inputs:**
  - `value`: text to search in.
  - `args`: search string (used as a case-insensitive regex). Without an argument the text is returned unchanged.
- **Output:** Original typed `SafeValue` from `bypassSecurityTrustHtml`; bind it with the `innerHTML` property and the `safe` approach. Only use with trusted content displayed to end users.
- **Example:**
  ```html
  <span [innerHTML]="paragraph | searchMatch: searchTerm"></span>
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/highlight-search-match.pipe.ts`; injects `DomSanitizer`; now standalone.

## KebabToTitlePipe

- **Purpose:** Replaces the first hyphen of kebab-case text with a space (one hyphen only; no general formatting).
- **Inputs:**
  - `value`: string to format.
- **Output:** Formatted string, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "kebab-case-text" | kebabToTitle }}
  ```
  Outputs `kebab case-text`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/kebab-to-title.pipe.ts`; now standalone.

## NameToInitialsPipe

- **Purpose:** Takes the first character of every word, keeping at most two characters, and uppercases them.
- **Inputs:**
  - `value`: full name.
- **Output:** Up to two uppercase initials, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "Piet K Stellen" | nameToInitials }}
  ```
  Outputs `PK`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/name-to-initials.pipe.ts`; now standalone.

## NearestPipe

- **Purpose:** Rounds a value to the nearest multiple of a unit.
- **Inputs:**
  - `value`: number to round.
  - `unit`: unit to round to.
- **Output:** Rounded number.
- **Example:**
  ```html
  {{ 27 | nearest: 10 }}
  ```
  Outputs `30`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/nearest.pipe.ts`; now standalone.

## OrderByPipe

- **Purpose:** Sorts an array using a comparator function.
- **Inputs:**
  - `value`: array to sort.
  - `sort`: comparator `(a, b) => number`. Anything that is not a function returns `undefined`.
- **Output:** The sorted array (sorts in place), or `undefined`.
- **Example:**
  ```html
  {{ items | orderBy: byName }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/order-by.pipe.ts`; now standalone.

## OrdinalPipe

- **Purpose:** Appends the ordinal suffix (`st`/`nd`/`rd`/`th`) to a number, optionally dropping the number.
- **Inputs:**
  - `n`: the number.
  - `keepNumber`: when `false`, only the suffix is returned; defaults to `true`.
- **Output:** Formatted string.
- **Example:**
  ```html
  {{ 22 | ordinal }}
  ```
  Outputs `22nd`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/ordinal.pipe.ts`; now standalone.

## PercentagePipe

- **Purpose:** Calculates a percentage from a numerator and denominator.
- **Inputs:**
  - `numerator`
  - `denominator`
- **Output:** Two-decimal string with a `%` suffix; `0%` when the denominator is falsy.
- **Example:**
  ```html
  {{ 10 | percentage: 25 }}
  ```
  Outputs `40.00%`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/percentage.pipe.ts`; now standalone.

## RemoveEmailDomainPipe (template name `removeDomain`)

- **Purpose:** Removes the `@` and everything after it from an email address.
- **Inputs:**
  - `value`: email address.
- **Output:** The local part, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "pietk@webuycars.co.za" | removeDomain }}
  ```
  Outputs `pietk`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/remove-email-domain.pipe.ts`; now standalone.

## ArraySortPipe (template name `sort`)

- **Purpose:** Sorts an array of records ascending by a field.
- **Inputs:**
  - `array`: array of records with the given field.
  - `field`: property name to sort by.
- **Output:** The sorted array (sorts in place), or an empty array for a non-array.
- **Example:**
  ```html
  {{ rows | sort: "name" }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/sort.pipe.ts`; item field identities (`Record<string, any>`) are intentionally loosely typed to keep the original numeric/string compare behaviour.

## TimeElapsedFormatPipe

- **Purpose:** Renders a date as a relative time string: past dates as `"5 minutes ago"`-style text, future dates as `"in 3 hours"`-style text.
- **Inputs:**
  - `date`: date string to compare against now.
- **Output:** Relative time via `DateTimeOpsService.getRelativeTime` (past) or `timeTillNow(true, ...)` (future).
- **Example:**
  ```html
  {{ record.createdAt | timeElapsedFormat }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/time-elapsed.pipe.ts`; now standalone, injects the library `DateTimeOpsService`. Kept impure so values recompute as time passes.

## TimeFormatPipe

- **Purpose:** Formats a date string as `hh:mm` with `toLocaleTimeString`, using the given IANA-orabbreviation zone (`CAT` legacy abbreviation).
- **Inputs:**
  - `date`: date string.
  - `timeZone`: zone string, defaults to `CAT`.
- **Output:** Formatted time string; impure to recalculate with growing dates.
- **Example:**
  ```html
  {{ "2024-01-01T09:30:00Z" | timeFormat }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/time-format.pipe.ts`; now standalone.

## TimeInStringPipe

- **Purpose:** Converts UTC (`+00:00`) date-time strings embedded in a text to CAT time via `DatePipe`.
- **Inputs:**
  - `value`: text containing date-time strings in the form `dd/MM/yyyy HH:mm:ss +00:00`.
- **Output:** The text with embedded date-times converted, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "Report from 01/02/2024 08:00:00 +00:00" | timeInString }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/time-in-string-pipe/time-in-string.pipe.ts`; injects `DatePipe`; now standalone.

## TimeMaskPipe

- **Purpose:** Splits a dotted decimal value (`"2.30"`) into a days/hours string.
- **Inputs:**
  - `value`: dotted string with exactly one `.`.
- **Output:** `"Nd H"` string; a missing second segment interpolates literally.
- **Example:**
  ```html
  {{ "2.30" | timeMask }}
  ```
  Outputs `2d 30`.
- **Notes:** Migrated from `src/app/controls-to-port/pipes/time-mask.pipe.ts`; now standalone.

## ToNumberPipe

- **Purpose:** Converts the input with `Number()`. The `?? value` fallback of the legacy pipe never executes, so non-numeric strings become `NaN`.
- **Inputs:**
  - `value`: value to convert.
- **Output:** The `Number()` result.
- **Example:**
  ```html
  {{ "12" | toNumber }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/to-number.pipe.ts`; now standalone.

## TrimCharactersPipe

- **Purpose:** Truncates text to a maximum length and appends `...`.
- **Inputs:**
  - `text`: text to trim.
  - `length`: maximum length; without it the text is returned untrimmed.
- **Output:** Truncated string, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ longDescription | trimCharacters: 85 }}
  ```
- **Notes:** Migrated from `src/app/controls-to-port/pipes/trim-characters.pipe.ts`; now standalone. Overlaps with `TruncatePipe` (`truncate` keeps exactly `size` characters and accepts a custom trail; `trimCharacters` keeps `length - 1` characters and a fixed `...`). Drop one of the two during a cleanup pass.
| `TimeFormatPipe` | `timeFormat` | `time-format/time-format.pipe.ts` | Yes | Formats a date string as `hh:mm` using a zone abbreviation such as `CAT`. |
| `TimeInStringPipe` | `timeInString` | `time-in-string/time-in-string.pipe.ts` | Yes | Converts UTC date-time strings embedded in a string into CAT time. |
| `TimeMaskPipe` | `timeMask` | `time-mask/time-mask.pipe.ts` | Yes | Splits a dotted value into a `d`-prefixed days/hours string. |
| `ToNumberPipe` | `toNumber` | `to-number/to-number.pipe.ts` | Yes | Converts a value with `Number()`. |
| `TrimCharactersPipe` | `trimCharacters` | `trim-characters/trim-characters.pipe.ts` | Yes | Truncates text to a maximum length and appends `...`. |
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

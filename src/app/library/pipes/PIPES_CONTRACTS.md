# Pipe Contracts

This file documents the shared pipes in `src/app/library/pipes`. Review it before creating a new pipe, and update it whenever a pipe is added, changed, or removed.

## Pipe Index

| Pipe                        | Name                    | File                                                      | Standalone   | Summary                                                                                          |
| --------------------------- | ----------------------- | --------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `AbsolutePipe`              | `absolute`              | `absolute/absolute.pipe.ts`                               | Yes          | Returns the absolute value of a number.                                                          |
| `ApiResponsePipe`           | `apiResponse`           | `api-response/api-response.pipe.ts`                       | Yes          | Converts an observable API call into loading, payload, error, and no-data view states.           |
| `CamelToTitlePipe`          | `camelToTitle`          | `camel-to-title/camel-to-title.pipe.ts`                   | Yes          | Splits camelCase text and capitalizes the first character.                                       |
| `CharacterSpacingPipe`      | `characterSpacing`      | `character-spacing/character-spacing.pipe.ts`             | Yes          | Groups string characters by the length's lowest common denominator (3-5, default 3) with spaces. |
| `ContainsPipe`              | `contains`              | `contains/contains.pipe.ts`                               | Yes          | Returns whether an array contains a value or matches a predicate function.                       |
| `CurrencyInStringPipe`      | `currencyInString`      | `currency-in-string/currency-in-string.pipe.ts`           | Yes          | Formats numbers embedded in a string as currency (default currency).                             |
| `DayAndHoursPipe`           | `dayAndHours`           | `day-and-hours/day-and-hours.pipe.ts`                     | Yes          | Formats a date as elapsed days and hours from now.                                               |
| `EmailToInitialsPipe`       | `emailToInitials`       | `email-to-initials/email-to-initials.pipe.ts`             | Yes          | Takes the first and last character of an email's local part and uppercases them.                 |
| `FilterPipe`                | `arrayFilter`           | `array-filter/array-filter.pipe.ts`                       | Yes          | Filters an array with an object of property values or a predicate function.                      |
| `FormatNullTextPipe`        | `formatNull`            | `format-null/format-null.pipe.ts`                         | Yes          | Replaces null or undefined with a fallback string.                                               |
| `GroupByDatePipe`           | `groupByDate`           | `group-by-date/group-by-date.pipe.ts`                     | Yes          | Groups a collection by its `entryDate` property into date/leadHistory pairs.                     |
| `HighlightSearchMatchPipe`  | `searchMatch`           | `highlight-search-match/highlight-search-match.pipe.ts`   | Yes          | Wraps the first case-insensitive literal match of a search term in `<mark>`; HTML-escapes text.  |
| `KebabToTitlePipe`          | `kebabToTitle`          | `kebab-to-title/kebab-to-title.pipe.ts`                   | Yes          | Replaces the first hyphen in kebab-case text with a space.                                       |
| `NameToInitialsPipe`        | `nameToInitials`        | `name-to-initials/name-to-initials.pipe.ts`               | Yes          | Takes the first two initials of a name and uppercases them.                                      |
| `NearestPipe`               | `nearest`               | `nearest/nearest.pipe.ts`                                 | Yes          | Rounds a value to the nearest multiple of a unit.                                                |
| `ObscureTextPipe`           | `obscureText`           | `obscure-text/obscure-text.pipe.ts`                       | Yes          | Masks all but the last N characters.                                                             |
| `OrderByPipe`               | `orderBy`               | `order-by/order-by.pipe.ts`                               | Yes          | Sorts an array with a comparator function.                                                       |
| `OrdinalPipe`               | `ordinal`               | `ordinal/ordinal.pipe.ts`                                 | Yes          | Appends an ordinal suffix (st, nd, rd, th) to a number.                                          |
| `PascalToTitlePipe`         | `pascalToTitle`         | `pascal-to-title/pascal-to-title.pipe.ts`                 | Yes          | Splits PascalCase text and capitalizes the first character.                                      |
| `PercentagePipe`            | `percentage`            | `percentage/percentage.pipe.ts`                           | Yes          | Calculates a percentage as a two-decimal string with a `%` suffix.                               |
| `PostfixPipe`               | `postfix`               | `postfix/postfix.pipe.ts`                                 | Yes          | Appends a suffix, optionally separated by a space.                                               |
| `RemoveEmailDomainPipe`     | `removeDomain`          | `remove-email-domain/remove-email-domain.pipe.ts`         | Yes          | Strips the `@` and domain from an email address.                                                 |
| `RemoveCharsPipe`           | `removeChars`           | `remove-chars/remove-chars.pipe.ts`                       | Yes          | Removes every occurrence of a character (or substring); defaults to underscores.                 |
| `RoundToNthPipe`            | `roundToNth`            | `round-to-nth/round-to-nth.pipe.ts`                       | Yes          | Rounds a number to N decimal places.                                                             |
| `ArraySortPipe`             | `sort`                  | `sort/array-sort.pipe.ts`                                 | Yes          | Sorts an array of records ascending by a field.                                                  |
| `SafePipe`                  | `safe`                  | `safe/safe.pipe.ts`                                       | Yes          | Bypasses resource URL sanitization.                                                              |
| `SpaceBetweenUppercasePipe` | `spaceBetweenUppercase` | `space-between-uppercase/space-between-uppercase.pipe.ts` | Yes          | Inserts a space between an uppercase letter and a following lowercase letter.                    |
| `ThousandSeparatorPipe`     | `thousandSeparator`     | `thousand-separator/thousand-separator.pipe.ts`           | Yes          | Groups digit runs with spaces.                                                                   |
| `TimeElapsedFormatPipe`     | `timeElapsedFormat`     | `time-elapsed/time-elapsed.pipe.ts`                       | Yes (impure) | Renders a date as a relative time string.                                                        |

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

## EmailToInitialsPipe

- **Purpose:** Initials from an email address: the first and last character of the local part (before the `@`), uppercased. When the email has no `@`, the first and last character of the whole string are used.
- **Inputs:**
  - `value`: email address.
- **Output:** Two uppercase characters, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "janed@example.com" | emailToInitials }}
  ```
  Outputs `JD`.

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

## GroupByDatePipe

- **Purpose:** Groups a collection items' `entryDate` property using `DatePipe` format `d MMMM yyyy`.
- **Inputs:**
  - `collection`: array of records with an `entryDate` property.
- **Output:** Array of `{ date: string, items: unknown[] }`, or `null` for a falsy collection. (The key was `leadHistory` until 2026-11-20; renamed to the generic `items`.)
- **Example:**
  ```html
  {{ history | groupByDate }}
  ```
- **Notes:** Injects `DatePipe`.

## HighlightSearchMatchPipe (template name `searchMatch`)

- **Purpose:** Wraps the first case-insensitive match of the search argument in a `<mark>` tag. Every part of the text is HTML-escaped first, and a space touching the match is rendered as `&nbsp;`.
- **Inputs:**
  - `value`: text to search in.
  - `args`: search string, matched literally and case-insensitively (regex characters such as `(` or `.` have no special meaning). Without an argument, or without a match, the text is returned HTML-escaped as a plain string (still meant for `[innerHTML]`).
- **Output:** `SafeValue` from `bypassSecurityTrustHtml` when there is a match; bind it with `[innerHTML]`. Safe for user-supplied text and terms because all text is escaped before the `<mark>` markup is added.
- **Example:**
  ```html
  <span [innerHTML]="paragraph | searchMatch: searchTerm"></span>
  ```
- **Notes:** Injects `DomSanitizer`; 2026-11-18 (AUD-27/AUD-28): switched from regex to literal matching and added HTML escaping; no longer wraps the edge spaces in extra `<span>`s.

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

## NameToInitialsPipe

- **Purpose:** Takes the first character of every word, keeping at most two characters, and uppercases them.
- **Inputs:**
  - `value`: full name.
- **Output:** Up to two uppercase initials, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "Piet K Stellen" | nameToInitials }}
  ```
  Outputs `JD`.

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

## RemoveEmailDomainPipe (template name `removeDomain`)

- **Purpose:** Removes the `@` and everything after it from an email address.
- **Inputs:**
  - `value`: email address.
- **Output:** The local part, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "janed@example.com" | removeDomain }}
  ```
  Outputs `janed`.

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
- **Notes:** Item field identities (`Record<string, any>`) are intentionally loosely typed to keep the original numeric/string compare behaviour.

## TimeElapsedFormatPipe

- **Purpose:** Renders a date as a relative time string: past dates as `"5 minutes ago"`-style text, future dates as `"in 3 hours"`-style text.
- **Inputs:**
  - `date`: date string to compare against now.
- **Output:** Relative time via `DateTimeOpsService.getRelativeTime` (past) or `timeTillNow(true, ...)` (future).
- **Example:**
  ```html
  {{ record.createdAt | timeElapsedFormat }}
  ```
- **Notes:** Injects the library `DateTimeOpsService`. Kept impure so values recompute as time passes.

## TimeFormatPipe

- **Purpose:** Formats a date string as a 24-hour `HH:mm` time with `toLocaleTimeString` in the app locale (`LOCALE_ID`).
- **Inputs:**
  - `date`: date string.
  - `timeZone` (optional): IANA zone name such as `Africa/Johannesburg`; omitted = the user's local time. (Defaulted to `CAT` until 2026-11-20.)
- **Output:** Formatted time string; impure to recalculate with growing dates.
- **Example:**
  ```html
  {{ "2024-01-01T09:30:00Z" | timeFormat }}
  ```

## TimeInStringPipe

- **Purpose:** Converts UTC (`+00:00`) date-time strings embedded in a text to local time (or the given zone) via `DatePipe`.
- **Inputs:**
  - `value`: text containing date-time strings in the form `dd/MM/yyyy HH:mm:ss +00:00`.
  - `timezone` (optional): DatePipe zone, e.g. `+0200` or `UTC`; omitted = the DatePipe default (local time). (Was a fixed `CAT` until 2026-11-20, which `DatePipe` does not recognise.)
- **Output:** The text with embedded date-times converted, or an empty string for a falsy value.
- **Example:**
  ```html
  {{ "Report from 01/02/2024 08:00:00 +00:00" | timeInString }}
  ```
- **Notes:** Injects `DatePipe`.

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

## ToNumberPipe

- **Purpose:** Converts the input with `Number()`. Non-numeric strings become `NaN`.
- **Inputs:**
  - `value`: value to convert.
- **Output:** The `Number()` result.
- **Example:**
  ```html
  {{ "12" | toNumber }}
  ```

| `TimeFormatPipe` | `timeFormat` | `time-format/time-format.pipe.ts` | Yes | Formats a date string as `HH:mm` (local time or a given IANA zone). |
| `TimeInStringPipe` | `timeInString` | `time-in-string/time-in-string.pipe.ts` | Yes | Converts UTC date-time strings embedded in a string to local time. |
| `TimeMaskPipe` | `timeMask` | `time-mask/time-mask.pipe.ts` | Yes | Splits a dotted value into a `d`-prefixed days/hours string. |
| `ToNumberPipe` | `toNumber` | `to-number/to-number.pipe.ts` | Yes | Converts a value with `Number()`. |
| `TruncatePipe` | `truncate` | `truncate/truncate.pipe.ts` | Yes | Truncates text to a maximum length and appends a trailing string; empty string for a falsy value. |

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

## TruncatePipe

- **Purpose:** Shortens long text so table cells and labels do not overflow.
- **Inputs:**
  - `text`: The string to truncate.
  - `size`: Maximum number of characters to keep.
  - `trail`: Optional suffix appended when text is truncated. Defaults to `...`.
- **Output:** The original string when it fits, otherwise the first `size` characters followed by `trail`; an empty string for a falsy value.
- **Example:**

  ```html
  {{ longDescription | truncate: 85 }}
  ```

- **Notes:** Consolidates the former `TrimCharactersPipe` (`trimCharacters`), which was removed during a cleanup pass; `truncate` accepts a custom trail and is null-safe.

## AbsolutePipe

- **Purpose:** Returns the absolute value of a number.
- **Inputs:**
  - `value`: number to convert.
- **Output:** Non-negative number.
- **Example:**

  ```html
  {{ -5 | absolute }}
  ```

## CamelToTitlePipe

- **Purpose:** Splits camelCase text and capitalizes the first character.
- **Inputs:**
  - `text`: string to format.
- **Output:** Formatted string.
- **Example:**

  ```html
  {{ "camelCase" | camelToTitle }}
  ```

## CurrencyInStringPipe

- **Purpose:** Formats numbers embedded in a string as currency, through Angular's `CurrencyPipe`.
- **Inputs:**
  - `value`: string containing one or more numeric values.
- **Inputs (optional):** `currencyCode` (ISO 4217); defaults to the app's `DEFAULT_CURRENCY_CODE` (set once in `main.ts`).
- **Output:** The original string with each numeric value (`,` or `.` decimal, space thousands) replaced by a formatted currency string (`symbol-narrow`, `1.2-2`, `LOCALE_ID`); text with two separators such as `1,234.50` is left unchanged.
- **Example:**

  ```html
  {{ "Invoice 1234,50" | currencyInString }}
  ```

- **Notes:** 2026-11-20: uses `CurrencyPipe` (it called `formatCurrency` with the code and symbol arguments swapped, printing a literal "ZAR", then replaced the first `,` with `.`, which broke amounts of 1 000 and more).

## DayAndHoursPipe

- **Purpose:** Formats a date as elapsed days and hours from now.
- **Inputs:**
  - `value`: date-like value to compare with the current date.
- **Output:** String in the form `"N Days: M Hours"`, or an empty string for a falsy value.
- **Example:**

  ```html
  {{ createdAt | dayAndHours }}
  ```

## FormatNullTextPipe

- **Purpose:** Replaces null or undefined with a fallback string.
- **Inputs:**
  - `value`: value to inspect.
  - `replaceText`: fallback text, default `"-"`.
- **Output:** `replaceText` for null or undefined; otherwise the original value.
- **Example:**

  ```html
  {{ value | formatNull }} {{ value | formatNull: "N/A" }}
  ```

- **Notes:** Template name remains `formatNull`.

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

## RemoveCharsPipe

- **Purpose:** Removes every occurrence of a character (or substring) from text; defaults to removing underscores.
- **Inputs:**
  - `text`: string to clean.
  - `chars`: character or substring to remove. Defaults to `_`.
- **Output:** The string without the given characters, or an empty string for a falsy value.
- **Example:**

  ```html
  {{ "some_value" | removeChars }} {{ "some value" | removeChars: " " }}
  ```

- **Notes:** Consolidates the former `RemoveUnderscorePipe` (`removeUnderscore`) and `RemoveSpacesPipe` (`removeSpaces`), both removed during a cleanup pass.

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

## SafePipe

- **Purpose:** Bypasses resource URL sanitization.
- **Inputs:**
  - `url`: resource URL to trust.
- **Output:** `SafeResourceUrl`.
- **Example:**

  ```html
  <iframe [src]="url | safe"></iframe>
  ```

- **Notes:** Injects `DomSanitizer` and is Only use with trusted URLs.

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

- **Notes:** Class renamed to `SpaceBetweenUppercasePipe`.

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

# Service Contracts

This file documents the shared services in `src/app/library/services`. Review it before creating a new service, and update it whenever a service is added, changed, or removed.

> `GridStorageService` (sessionStorage cache for grid filters and the LinQ request state) and the `LinQRequestState`/`LinQSort` model were removed on 2026-11-18 (AUD-25): the custom LinQ backend they served is not part of the template, and the grid controls no longer persist anything. A fork that wants filters or paging to survive a reload stores the filter-bar outputs / `_CustPage` itself.

## Service Index

| Service                           | File                                    | Provided by  | Summary                                                                                                                                    |
| --------------------------------- | --------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `LoggerService`                   | `logger.service.ts`                     | `@Service()` | Central logging service; suppresses output in production.                                                                                  |
| `SnackbarService`                 | `snackbar.service.ts`                   | `@Service()` | Material snackbar wrapper for user-facing notifications.                                                                                   |
| `AppShellService`                 | `app-shell.service.ts`                  | `@Service()` | Global side-nav menu behaviour state (`over` / `side`).                                                                                    |
| `B64ToBlobService`                | `b64-to-blob.service.ts`                | `@Service()` | Converts base64 strings to `Blob` objects.                                                                                                 |
| `CustomPreloadingStrategyService` | `custom-preloading-strategy.service.ts` | `@Service()` | Router `PreloadingStrategy`; preloads routes with `data.preload`.                                                                          |
| `DateTimeOpsService`              | `date-time-ops.service.ts`              | `@Service()` | Relative time strings, date period helpers (`startOf`/`endOf`/`add`/`subtract`), and date/time formatting in the app locale (`LOCALE_ID`). |
| `ErrorHandlingService`            | `error-handling.service.ts`             | `@Service()` | App-wide `ErrorHandler`; surfaces errors via snackbar and logs non-production errors.                                                      |
| `LoginService`                    | `login.service.ts`                      | `@Service()` | Current-user state and JWT decoding/claims helpers (no authentication flows).                                                              |
| `OpenPageService`                 | `open-page.service.ts`                  | `@Service()` | Routes to a URL in-app or in a new tab based on a persisted user preference.                                                               |
| `SearchRetainService`             | `search-retain.service.ts`              | `@Service()` | Global search-term state retained across grids.                                                                                            |

## AppShellService

- **Purpose:** Holds the global menu behaviour (`"over"` / `"side"`) used by the side navigation.
- **Public API:**
  - `menuBehaviour$` — `Observable<"over" | "side">`, current behaviour.
  - `switchMenuBehaviour(): void` — toggles between `over` and `side`.
  - `getMenuBehaviour(): "over" | "side"` — snapshot of the current behaviour.

## B64ToBlobService

- **Purpose:** Decodes base64 data (default PDF) into a `Blob` for downloads/preview.
- **Public API:** `b64ToBlob(b64Data: string, contentType?: string, sliceSize?: number): Blob`.

## CustomPreloadingStrategyService

- **Purpose:** Selective lazy-route preloading; a route is preloaded only when `route.data["preload"]` is truthy.
- **Usage:** Pass as `preloadingStrategy` to `provideRouter(routes, withPreloading(CustomPreloadingStrategyService))` and add `data: { preload: true }` to routes that should preload.

## DateTimeOpsService

- **Purpose:** Date/time helpers shared by pipes and controls (e.g. the `timeElapsed` pipe, range date picker).
- **Types:** `_DateTimePeriod` = `"year" | "month" | "week" | "day" | "hour" | "minute" | "second"` (exported from the service file).
- **Public API:**

| Method               | Signature                                                                                                               | Output                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `getRelativeTime`    | `getRelativeTime(date: Date): string`                                                                                   | `"5 minutes ago"`, `"3 months 2d ago"`, `"1 yr 2 mo ago"`.                           |
| `timeTillNow`        | `timeTillNow(prefix: boolean, date: Date): string`                                                                      | Same units; `"in "` prefix when `prefix` is `true`.                                  |
| `getMonthDifference` | `getMonthDifference(startDate: Date, endDate: Date): { months: number; days: number }`                                  | Whole months plus leftover days.                                                     |
| `startOf`            | `startOf(timePeriod: _DateTimePeriod, date?: Date): Date`                                                               | Copy of `date` truncated to the start of the period (defaults to now).               |
| `endOf`              | `endOf(timePeriod: _DateTimePeriod, date?: Date): Date`                                                                 | Copy of `date` truncated to the end of the period (defaults to now).                 |
| `formatISO`          | `formatISO(date: Date, format: "YYYY-MM-ddTHH:mm:ss" \| "YYYY-MM-ddTHH:mm:ss[Z]" \| "YYYY-MM-ddTHH:mm:ssZ[Z]"): string` | ISO strings with seconds precision; the `Z[Z]` variant appends the local UTC offset. |
| `subtract`           | `subtract(date: Date, amount: number, timePeriod: _DateTimePeriod): Date`                                               | New date shifted back.                                                               |
| `add`                | `add(date: Date, amount: number, timePeriod: _DateTimePeriod): Date`                                                    | New date shifted forward.                                                            |
| `dateFormat`         | `dateFormat(date: Date): string`                                                                                        | Numeric date in the app locale (`LOCALE_ID`).                                        |
| `timeFormat`         | `timeFormat(date: Date): string`                                                                                        | Hours and minutes in the app locale.                                                 |
| `dateTimeFormat`     | `dateTimeFormat(date: Date): string`                                                                                    | Numeric date and time in the app locale.                                             |

- **Notes:** formatting follows the injected `LOCALE_ID` (it was hard-coded to `en-ZA` until 2026-11-20); time-period parameters use the `_DateTimePeriod` union type.

## ErrorHandlingService

- **Purpose:** Application-wide `ErrorHandler`; show user-facing errors and log for developers.
- **Registration:** Provide in `app.config.ts` via `{ provide: ErrorHandler, useClass: ErrorHandlingService }` (or `useExisting` since it is root-provided).
- **Behaviour:**
  - Non-production: logs the error through `LoggerService`.
  - `HttpErrorResponse` while offline: opens a `"No Internet Connection"` snackbar.
  - `HttpErrorResponse`: opens a `<status> - <message>` snackbar (message resolved from `error.error.title`, the string body, or `error.message`).
  - Other errors: opens a snackbar with `error.message`.

## LoginService

- **Purpose:** Base user/JWT service. Holds the current user (persisted in `localStorage` under `currentUser`) and decodes JWT access tokens. It intentionally contains **no authentication flows** — no login, token refresh, or Identity Server integration; each forked app adds its own.
- **Related model:** `_User` (`src/app/library/models/user.ts`) — `firstName`, `lastName`, `fullName`, `username`, `email`, `token` (all optional). JWT payloads decode to `_JwtPayload` (`sub`, `exp`, arbitrary claim keys).
- **Public API:**

| Member                   | Signature                                                  | Notes                                                                                                      |
| ------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `currentUser`            | `Signal<_User \| null>`                                    | Current user; hydrated from `localStorage` on creation.                                                    |
| `currentUserValue`       | `_User \| null` (getter)                                   | Snapshot of the current user.                                                                              |
| `setUser`                | `setUser(user: _User): void`                               | Persists to `localStorage` and updates the signal.                                                         |
| `clearUser`              | `clearUser(): void`                                        | Removes the stored user and clears the signal.                                                             |
| `decodeToken`            | `decodeToken(token: string): _JwtPayload \| null`          | Dependency-free base64url JWT decode; returns `null` on failure.                                           |
| `getTokenExpirationDate` | `getTokenExpirationDate(token: string): Date \| null`      | `exp` claim as a `Date`; `null` when absent/undecodable.                                                   |
| `isTokenExpired`         | `isTokenExpired(token?: string): boolean`                  | Falls back to the stored user's token; `true` when there is no token; `false` when the token has no `exp`. |
| `getSubject`             | `getSubject(): string`                                     | `sub` claim of the current token; `""` when unavailable.                                                   |
| `getClaims`              | `getClaims(): string[]`                                    | Claim keys of the current token.                                                                           |
| `getApiClaims`           | `getApiClaims(prefix: string): string[]`                   | Claim keys starting with `prefix`.                                                                         |
| `userHasClaim`           | `userHasClaim(searchForClaim: string): boolean`            | Whether the claim key is present.                                                                          |
| `userHasRequiredClaims`  | `userHasRequiredClaims(requiredClaims: string[]): boolean` | Whether **any** required claim key is present.                                                             |

## OpenPageService

- **Purpose:** Opens URLs in-app or in a new tab according to the `operations_open_in_new_tab` `localStorage` preference, re-read on every call.
- **Public API:**

| Member         | Signature                                                    | Notes                                                            |
| -------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| `openInNewTab` | `openInNewTab(): boolean`                                    | Current preference (`false` when unset).                         |
| `openPage`     | `openPage(url: string, queryParam?: NavigationExtras): void` | `window.open(url, "_blank", "noreferrer")` or `router.navigate`. |

## SearchRetainService

- **Purpose:** Retains a global search term (e.g. shared across grids).
- **Public API:**
  - `getSearchData` — `Observable<string>`, current search term (defaults to `""`).
  - `changeValue(searchValue: string): void` — pushes a new search term.
  - `clearValue(): void` — resets to `""`.

## LoggerService

- **Purpose:** Provides the application-wide logging API so application code does not call `console` directly.
- **Injection:** Use `inject(LoggerService)` or constructor injection.
- **Production behaviour:** Every method is a no-op when `environment.environmentName === "production"`.
- **Public API:**

| Method    | Signature                       | Output            |
| --------- | ------------------------------- | ----------------- |
| `log`     | `log(message: unknown): void`   | `console.log`     |
| `warn`    | `warn(message: unknown): void`  | `console.warn`    |
| `error`   | `error(message: unknown): void` | `console.error`   |
| `info`    | `info(message: unknown): void`  | `console.info`    |
| `debug`   | `debug(message: unknown): void` | `console.debug`   |
| `table`   | `table(data: unknown): void`    | `console.table`   |
| `time`    | `time(label: string): void`     | `console.time`    |
| `timeEnd` | `timeEnd(label: string): void`  | `console.timeEnd` |
| `dir`     | `dir(object: unknown): void`    | `console.dir`     |

- **Example:**

  ```ts
  import { inject } from "@angular/core";
  import { LoggerService } from "@shared/services/logger.service";

  private readonly logger = inject(LoggerService);

  this.logger.error(error);
  ```

## SnackbarService

- **Purpose:** Displays user-facing notifications using Angular Material's `MatSnackBar`.
- **Injection:** Use `inject(SnackbarService)` or constructor injection.
- **States:** `info`, `success`, `warning`, `error`. Each state maps to a `snackbar-<state>` panel class styled globally in `src/styles.scss`.
- **Public API:**

| Method    | Signature                                                                                                     | Notes                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`    | `open(message?: string, state?: _SnackbarState, duration?: number): MatSnackBarRef<TextOnlySnackBar> \| null` | Defaults to an empty message, `error` state, and `5555`ms. Shows a `Close` action. Returns `null` when the same message is already visible. |
| `dismiss` | `dismiss(): void`                                                                                             | Dismisses the currently visible snackbar.                                                                                                   |

- **Behaviour:** one snackbar at a time (Material); a message identical to the one already showing is not shown again.

- **Example:**

  ```ts
  import { inject } from "@angular/core";
  import { SnackbarService } from "@shared/services/snackbar.service";

  private readonly snackbar = inject(SnackbarService);

  this.snackbar.open("Saved successfully", "success");
  ```

## Sandbox mock services

These services live in `src/app/segments/sandbox/services` and exist only to feed deterministic mock data to the Sandbox segment. They are not shared application services.

| Service                            | File                                      | Provided by          | Summary                                                                               |
| ---------------------------------- | ----------------------------------------- | -------------------- | ------------------------------------------------------------------------------------- |
| `SandboxAccordionDataService`      | `sandbox-accordion-data.service.ts`       | `providedIn: "root"` | Mock accordion items for exercising the Accordion control.                            |
| `SandboxExpandableGridDataService` | `sandbox-expandable-grid-data.service.ts` | `providedIn: "root"` | Mock columns, editable fields, rules, rows, and form for the Expandable Grid control. |

### SandboxAccordionDataService

- **Purpose:** Supplies mock accordion items used by the Sandbox component.
- **Public API:** `items: _SandboxAccordionItem[]`, where each item has `title`, `body`, and `disabled`.

### SandboxExpandableGridDataService

- **Purpose:** Supplies the configuration and mock rows used by the Sandbox component to render the Expandable Grid.
- **Public API:**
  - `columns: _ExpandableGridDisplayOptionsInterface[]`
  - `editableColumns: _ExpandableGridOptionsInterface[]`
  - `rules: _ExpandableGridRulesInterface`
  - `rows: _ExpandableGridRow[]`
  - `createForm(): FormGroup`

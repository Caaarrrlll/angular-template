# Service Contracts

This file documents the shared services in `src/app/library/services`. Review it before creating a new service, and update it whenever a service is added, changed, or removed.

## Service Index

| Service | File | Provided by | Summary |
| --- | --- | --- | --- |
| `LoggerService` | `logger.service.ts` | `@Service()` | Central logging service; suppresses output in production. |
| `SnackbarService` | `snackbar.service.ts` | `@Service()` | Material snackbar wrapper for user-facing notifications. |
| `AppShellService` | `app-shell.service.ts` | `@Service()` | Global side-nav menu behaviour state (`over` / `side`). |
| `B64ToBlobService` | `b64-to-blob.service.ts` | `@Service()` | Converts base64 strings to `Blob` objects. |
| `CustomPreloadingStrategyService` | `custom-preloading-strategy.service.ts` | `@Service()` | Router `PreloadingStrategy`; preloads routes with `data.preload`. |
| `DateTimeOpsService` | `date-time-ops.service.ts` | `@Service()` | Relative time strings, date period helpers (`startOf`/`endOf`/`add`/`subtract`), and `en-ZA` date/time formatting. |
| `ErrorHandlingService` | `error-handling.service.ts` | `@Service()` | App-wide `ErrorHandler`; surfaces errors via snackbar and logs non-production errors. |
| `LoginService` | `login.service.ts` | `@Service()` | Current-user state and JWT decoding/claims helpers (no authentication flows). |
| `OpenPageService` | `open-page.service.ts` | `@Service()` | Routes to a URL in-app or in a new tab based on a persisted user preference. |
| `SearchRetainService` | `search-retain.service.ts` | `@Service()` | Global search-term state retained across grids. |
| `GridStorageService` | `grid-storage.service.ts` | `@Service()` | Session-storage cache for grid filters and request state. |

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
- **Types:** `DateTimePeriod` = `"year" | "month" | "week" | "day" | "hour" | "minute" | "second"` (exported from the service file).
- **Public API:**

| Method | Signature | Output |
| --- | --- | --- |
| `getRelativeTime` | `getRelativeTime(date: Date): string` | `"5 minutes ago"`, `"3 months 2d ago"`, `"1 yr 2 mo ago"`. |
| `timeTillNow` | `timeTillNow(prefix: boolean, date: Date): string` | Same units; `"in "` prefix when `prefix` is `true`. |
| `getMonthDifference` | `getMonthDifference(startDate: Date, endDate: Date): { months: number; days: number }` | Whole months plus leftover days. |
| `startOf` | `startOf(timePeriod: DateTimePeriod, date?: Date): Date` | Copy of `date` truncated to the start of the period (defaults to now). |
| `endOf` | `endOf(timePeriod: DateTimePeriod, date?: Date): Date` | Copy of `date` truncated to the end of the period (defaults to now). |
| `formatISO` | `formatISO(date: Date, format: "YYYY-MM-ddTHH:mm:ss" \| "YYYY-MM-ddTHH:mm:ss[Z]" \| "YYYY-MM-ddTHH:mm:ssZ[Z]"): string` | ISO strings with seconds precision; the `Z[Z]` variant appends the local UTC offset. |
| `subtract` | `subtract(date: Date, amount: number, timePeriod: DateTimePeriod): Date` | New date shifted back. |
| `add` | `add(date: Date, amount: number, timePeriod: DateTimePeriod): Date` | New date shifted forward. |
| `dateFormat` | `dateFormat(date: Date): string` | `en-ZA` `dd/MM/yyyy`. |
| `timeFormat` | `timeFormat(date: Date): string` | `en-ZA` `HH:mm`. |
| `dateTimeFormat` | `dateTimeFormat(date: Date): string` | `en-ZA` `dd/MM/yyyy, HH:mm`. |

- **Porting note:** the legacy service injected `DatePipe`; the ported service uses `formatDate` with the injected `LOCALE_ID` instead. Time-period parameters are now the `DateTimePeriod` union type instead of raw strings.

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

| Member | Signature | Notes |
| --- | --- | --- |
| `currentUser` | `Signal<_User \| null>` | Current user; hydrated from `localStorage` on creation. |
| `currentUserValue` | `_User \| null` (getter) | Snapshot of the current user. |
| `setUser` | `setUser(user: _User): void` | Persists to `localStorage` and updates the signal. |
| `clearUser` | `clearUser(): void` | Removes the stored user and clears the signal. |
| `decodeToken` | `decodeToken(token: string): _JwtPayload \| null` | Dependency-free base64url JWT decode; returns `null` on failure. |
| `getTokenExpirationDate` | `getTokenExpirationDate(token: string): Date \| null` | `exp` claim as a `Date`; `null` when absent/undecodable. |
| `isTokenExpired` | `isTokenExpired(token?: string): boolean` | Falls back to the stored user's token; `true` when there is no token; `false` when the token has no `exp`. |
| `getSubject` | `getSubject(): string` | `sub` claim of the current token; `""` when unavailable. |
| `getClaims` | `getClaims(): string[]` | Claim keys of the current token. |
| `getApiClaims` | `getApiClaims(prefix: string): string[]` | Claim keys starting with `prefix`. |
| `userHasClaim` | `userHasClaim(searchForClaim: string): boolean` | Whether the claim key is present. |
| `userHasRequiredClaims` | `userHasRequiredClaims(requiredClaims: string[]): boolean` | Whether **any** required claim key is present. |

- **Porting note:** the legacy service's `login`/`refreshToken`/Identity Server request builders, `NotificationService` hub calls, and the `jwt-decode` package were all removed per developer decision (2026-11-11).

## OpenPageService

- **Purpose:** Opens URLs in-app or in a new tab according to the `operations_open_in_new_tab` `localStorage` preference, re-read on every call.
- **Public API:**

| Member | Signature | Notes |
| --- | --- | --- |
| `openInNewTab` | `openInNewTab(): boolean` | Current preference (`false` when unset). |
| `openPage` | `openPage(url: string, queryParam?: NavigationExtras): void` | `window.open(url, "_blank", "noreferrer")` or `router.navigate`. |

- **Porting note:** the legacy `goTo*` methods (stock/lead/concern routes) were app-specific and dropped per the template's seam-stripping approach; renamed from `openPageService` to `OpenPageService`.

## SearchRetainService

- **Purpose:** Retains a global search term (e.g. shared across grids); legacy consumers keep the same observable contract.
- **Public API:**
  - `getSearchData` — `Observable<string>`, current search term (defaults to `""`).
  - `changeValue(searchValue: string): void` — pushes a new search term.
  - `clearValue(): void` — resets to `""`.

## GridStorageService

- **Purpose:** Caches grid filter setups and LinQ request state in `sessionStorage`.
- **Related models:** `_LinQGridFilterItem` (`src/app/controls/components/linq-grid-filters/linq-grid-filter-item.model`) and `LinQRequestState` (`src/app/library/models/lin-q-request-state`).
- **Public API:**

| Method | Signature | Notes |
| --- | --- | --- |
| `getCachedFilters` | `getCachedFilters(name: string): _LinQGridFilterItem[]` | Parses the cached setup and rehydrates `Date` values for active `date`/`dateRange` filters. |
| `setCachedFilters` | `setCachedFilters(name: string, setup: _LinQGridFilterItem[]): void` | Serializes the filter setup. |
| `setLinQCachedFilters` | `setLinQCachedFilters(name: string, setup: LinQRequestState): void` | Serializes the request state. |
| `getLinQCachedFilters` | `getLinQCachedFilters(name: string): LinQRequestState` | Parses the cached request state. |
| `state` | `LinQRequestState` (property) | Default request state (`skip`/`take`/`sorts`). |

- **Porting note:** the legacy service used the Kendo `DataSourceRequestState`/`GridFilter` types; the port replaces them with the rebuilt minimal models (best-effort rebuild per decision, 2026-11-12).

## LoggerService

- **Purpose:** Provides the application-wide logging API so application code does not call `console` directly.
- **Injection:** Use `inject(LoggerService)` or constructor injection.
- **Production behaviour:** Every method is a no-op when `environment.environmentName === "production"`.
- **Public API:**

| Method | Signature | Output |
| --- | --- | --- |
| `log` | `log(message: unknown): void` | `console.log` |
| `warn` | `warn(message: unknown): void` | `console.warn` |
| `error` | `error(message: unknown): void` | `console.error` |
| `info` | `info(message: unknown): void` | `console.info` |
| `debug` | `debug(message: unknown): void` | `console.debug` |
| `table` | `table(data: unknown): void` | `console.table` |
| `time` | `time(label: string): void` | `console.time` |
| `timeEnd` | `timeEnd(label: string): void` | `console.timeEnd` |
| `dir` | `dir(object: unknown): void` | `console.dir` |

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

| Method | Signature | Notes |
| --- | --- | --- |
| `open` | `open(message?: string, state?: SnackbarState, duration?: number): MatSnackBarRef<TextOnlySnackBar> \| null` | Defaults to an empty message, `error` state, and `5555`ms. Shows a `Close` action. Returns `null` when the same message is already visible. |
| `dismiss` | `dismiss(): void` | Dismisses the currently visible snackbar. |

- **Parity with the legacy service:** consecutive duplicate messages are suppressed. The following legacy behaviours are intentionally not carried over:
  - Stacked notifications and the Kendo "Close All" button; Material shows a single snackbar at a time.
  - The `errorList` / `errorListGet` / `errorListCntGet` buffer and `dev_show_error` claim gating; these depended on the unported `LoginService` and were not used by the template.
  - The Kendo slide animation; Material provides its own open/close animation.

- **Example:**

  ```ts
  import { inject } from "@angular/core";
  import { SnackbarService } from "@shared/services/snackbar.service";

  private readonly snackbar = inject(SnackbarService);

  this.snackbar.open("Saved successfully", "success");
  ```

### Legacy snackbar service

The old Kendo-based `SnackbarService` in `src/app/controls-to-port/services/snackbar.service.ts` was replaced by the Material service above. All of its `controls-to-port` consumers have been migrated (carousel and dynamic window now use the Material `SnackbarService`) and the legacy file was removed on 2026-11-13.

The ported `copy-text` directive (`src/app/library/directives/copy-text.directive.ts`) and `dynamic-material-dialog` component (`src/app/controls/components/dynamic-material-dialog/dynamic-material-dialog.component.ts`) already use the new Material `SnackbarService`.

## Sandbox mock services

These services live in `src/app/segments/sandbox/services` and exist only to feed deterministic mock data to the Sandbox segment. They are not shared application services.

| Service | File | Provided by | Summary |
| --- | --- | --- | --- |
| `SandboxAccordionDataService` | `sandbox-accordion-data.service.ts` | `providedIn: "root"` | Mock accordion items for exercising the Accordion control. |
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


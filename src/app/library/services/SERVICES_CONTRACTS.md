# Service Contracts

This file documents the shared services in `src/app/library/services`. Review it before creating a new service, and update it whenever a service is added, changed, or removed.

## Service Index

| Service | File | Provided by | Summary |
| --- | --- | --- | --- |
| `LoggerService` | `logger.service.ts` | `@Service()` | Central logging service; suppresses output in production. |
| `SnackbarService` | `snackbar.service.ts` | `@Service()` | Material snackbar wrapper for user-facing notifications. |

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

The old Kendo-based `SnackbarService` in `src/app/controls-to-port/services/snackbar.service.ts` has been replaced by the Material service above. It remains only for consumers still in `controls-to-port`; migrate them when their owning controls are ported:

| Consumer | Location |
| --- | --- |
| Carousel | `src/app/controls-to-port/cust-carousel/carousel/carousel.component.ts` |
| Dynamic window | `src/app/controls-to-port/dynamic-window/dynamic-window.component.ts` |
| Error handling service | `src/app/controls-to-port/services/error-handling.service.ts` |

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


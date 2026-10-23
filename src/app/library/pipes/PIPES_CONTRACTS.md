# Pipe Contracts

This file documents the shared pipes in `src/app/library/pipes`. Review it before creating a new pipe, and update it whenever a pipe is added, changed, or removed.

> Pipes in `src/app/controls-to-port/pipes` are legacy code and are not yet part of this contract. Add them here as they are migrated.

## Pipe Index

| Pipe | Name | File | Standalone | Summary |
| --- | --- | --- | --- | --- |
| `ApiResponsePipe` | `apiResponse` | `api-response/api-response.pipe.ts` | Yes | Converts an observable API call into loading, payload, error, and no-data view states. |

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

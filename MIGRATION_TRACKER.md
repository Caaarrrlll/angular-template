# Controls Migration Tracker

Tracks the migration of custom controls in `src/app/controls-to-port` to the newer Angular version used in this template.

> **Note:** `src/app/controls-to-port` does not have to be kept in a working state. Once a control or supporting item is migrated, it can be removed from the old code.

> **Animation migration:** Extract each animation into its own file in an `animations/` folder inside the owning control (for example `src/app/controls/components/accordion/animations/accordion-expansion-animation.ts`) and convert deprecated `@angular/animations` triggers to the newer `animate.enter`/`animate.leave` standard.

## Status key

| Status | Meaning |
| --- | --- |
| Pending | Not yet started. |
| Ready | Analysed: no prerequisites; can be migrated at any time. |
| In progress | Migration work has started. |
| Migrated | Finalised and migrated into the template. |
| Blocked | Waiting on a dependency or decision. |

## Summary

- Total control rows: 65 (includes 2 duplicate legacy rows for `card-table/` and `table/`)
- Migrated: 40
- In progress: 0
- Pending: 25 (Ready: 4, Blocked: 19, Not started: 2 duplicated rows)
- Supporting items: 8 migrated, 1 pending, 2 blocked
- Migrated helper services: 1
- Pending helper services: 12
- Migrated pipes: 33
- Pending legacy pipes: 1 (blocked: `timeElapsedFormat` waits on the un-ported `DateTimeOpsService`)
- Dropped pipes: 1 (`hideTradeRetail`, deleted on request)

Update the summary whenever a control, helper service, or pipe is finalised.

## Accordion

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Accordion | `accordion/` | Migrated | Standalone in `src/app/controls/components/accordion`; expansion uses CSS `animate.enter`/`animate.leave`. |

## Checkbox Group

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Checkbox group | `checkbox-group/` | Migrated | Standalone in `src/app/controls/components/checkbox-group`; implements `ControlValueAccessor`. |
| Checkbox | `checkbox-group/checkbox/` | Migrated | Standalone in `src/app/controls/components/checkbox-group/checkbox`; resolves the parent group with host injection. |

## Confirmation Dialog

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Confirmation dialog | `confirmation-dialog/` | Migrated | Standalone in `src/app/controls/components/confirmation-dialog`; ported as a dependency of the Expandable Grid. |

## Basic Controls

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Button primary | `cust-basic-controls/cust-button-primary/` | Migrated | Wrapper in `src/app/controls/components/button/button-primary`; renders `app-button-v2`. |
| Button secondary | `cust-basic-controls/cust-button-secondary/` | Migrated | Wrapper in `src/app/controls/components/button/button-secondary`; renders `app-button-v2`. |
| Button tertiary | `cust-basic-controls/cust-button-tertiary/` | Migrated | Wrapper in `src/app/controls/components/button/button-tertiary`; renders `app-button-v2`. |
| Button text | `cust-basic-controls/cust-button-text/` | Migrated | Wrapper in `src/app/controls/components/button/button-text`; renders `app-button-v2`. |
| Button toggle | `cust-basic-controls/cust-button-toggle/` | Migrated | Standalone in `src/app/controls/components/button-toggle`; typed `ButtonToggleInput`/`ButtonToggleResponse`. |
| Button v2 | `cust-basic-controls/cust-button-v2/` | Migrated | Standalone in `src/app/controls/components/button/button-v2`; OnPush with class/size getters; dangling `@controls/*` aliases re-pointed to the new `@shared/models/cust-basic-controls` file. |
| Chip status | `cust-basic-controls/cust-chip-status/` | Migrated | Standalone in `src/app/controls/components/chip-status`; ctor-as-module anti-pattern removed; `_ChipStatus` enum converted to a typed const map (`ChipStatus`). |
| Chips | `cust-basic-controls/cust-chips/` | Migrated | Standalone in `src/app/controls/components/chips`; unused `onClick`/`optionSelected` dropped; `count` typed as number; shared basic-controls interfaces moved to `@shared/models/cust-basic-controls`. |
| DEKRA button | `cust-basic-controls/cust-dekra-button/` | Blocked | Needs `RoadworthyApiService` (does not exist in the repo) and `cust-loader`. |
| Housing card | `cust-basic-controls/cust-housing-card/` | Blocked | Needs `UserSettingsModel` (does not exist in the repo). |
| Info card | `cust-basic-controls/cust-info-card/` | Blocked | Needs `cust-currency`, `cust-count-down`, `LoginService`, `card-table` enum/interface; `cust-distance`/`cust-sensitive-info` and `UserSettingsModel` do not exist in the repo. Migrate last. |
| Input currency | `cust-basic-controls/cust-input-currency/` | Blocked | Needs `LocalizeService` (does not exist in the repo); currency-source decision required. |
| Input email | `cust-basic-controls/cust-input-email/` | Migrated | Standalone in `src/app/controls/components/input/input-email`; `debounceTime` subscription torn down with `takeUntilDestroyed`. |
| Input number | `cust-basic-controls/cust-input-number/` | Migrated | Standalone in `src/app/controls/components/input/input-number`. |
| Input phone | `cust-basic-controls/cust-input-phone/` | Migrated | Standalone in `src/app/controls/components/input/input-phone`; `takeUntilDestroyed`; input `type="tel"`; missing `minlength` now falls back to a digits-only pattern. |
| Input select | `cust-basic-controls/cust-input-select/` | Migrated | Standalone in `src/app/controls/components/input/input-select`; control created in `ngOnInit`; `(ngModelChange)` replaced with `(selectionChange)`. |
| Input text | `cust-basic-controls/cust-input-text/` | Migrated | Standalone in `src/app/controls/components/input/input-text`; date-picker mode kept. |
| List card | `cust-basic-controls/cust-list-card/` | Blocked | Same chain as info card (`cust-currency`, `cust-count-down`, `LoginService`, missing `cust-distance`/`cust-sensitive-info`). Migrate last. |
| Range date picker | `cust-basic-controls/cust-range-date-picker/` | Blocked | Needs the un-ported `DateTimeOpsService`. |
| Slide toggle | `cust-basic-controls/cust-slide-toggle/` | Ready | Self-contained. |
| Tabs | `cust-basic-controls/cust-tabs/` | Migrated | Renamed to `app-tab-group` (`src/app/controls/components/tab-group`) to avoid the clash with the migrated `components/tabs`; `of(...).pipe(delay(100))` render hack replaced with a `hideContent` signal + `effect()` re-render cycle; unused `title` input and `_TabTypes` enum dropped. |

## Button

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Button | `cust-button/button/` | Blocked | Needs `cust-loader`; Kendo `kendo-contextmenu` decision (Kendo not installed); legacy `SharedControlsModule` barrel missing. |
| FAB button | `cust-button/fab-button/` | Migrated | Standalone in `src/app/controls/components/button/fab-button`; dead Kendo icon classname replaced with `mat-icon`. |

## Card

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Card | `cust-card/card/` | Migrated | Standalone in `src/app/controls/components/card`. |
| Card header | `cust-card/card-header/` | Migrated | Standalone in `src/app/controls/components/card/card-header`. |

## Card Table

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Card table | `card-table/` | Blocked | Needs the missing `linq-grid-filters` control, `cust-page`, `cust-button` + `cust-button-v2`, `cust-list-card`, `cust-slide-toggle`, `cust-currency`; `_TableTypes` enum diverges from `table/`. |

## Carousel

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Carousel | `cust-carousel/carousel/` | Migrated | Standalone in `src/app/controls/components/carousel`; binds `src` directly (ZoomableImage sanitises internally, so the `safe` pipe is no longer needed); legacy `title` binding was silently ignored and dropped; SCSS de-duplicated. |

## Count Down

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Count down | `cust-count-down/` | Migrated | Standalone in `src/app/controls/components/count-down`; `setInterval` torn down via `DestroyRef`. |

## Currency

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Currency | `cust-currency/currency/` | Blocked | Needs a currency-source decision; depends on `LocalizeService` (does not exist in the repo). |

## Gallery

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Gallery | `cust-gallery/gallery/` | Blocked | Heaviest chain: missing `cust-flat-vehicle`, `evaluation-comparison`, `ZoomDirective`, `_DeconstructedFlatView` model. |
| Gallery preview | `cust-gallery/gallery-preview/` | Ready | Self-contained; migrate separately from the gallery. |

## Input

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Input | `cust-input/input/` | Migrated | Standalone in `src/app/controls/components/input`. |

## Key Value

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Key value | `cust-key-value/key-value/` | Migrated | Standalone in `src/app/controls/components/key-value/key-value`. |
| Key value v2 | `cust-key-value/key-value-v2/` | Migrated | Standalone in `src/app/controls/components/key-value/key-value-v2`. |
| Key value v3 | `cust-key-value/key-value-v3/` | Migrated | Standalone in `src/app/controls/components/key-value/key-value-v3`; consolidation of v1/v2/v3 deliberately deferred. |

## Loader

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Loader | `cust-loader/loader/` | Migrated | Standalone in `src/app/controls/components/loader`. |

## Media Dialog

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Media dialog | `cust-media-dialog/` | Blocked | Needs `MediaApiService` + `_FileUploadResponse` (missing legacy API layer). |

## Select

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Select | `cust-select/select/` | Migrated | Standalone in `src/app/controls/components/select/select`; `ControlContainer`/`SkipSelf` pattern kept. Unused `options`/`type`/`controlName` inputs dropped. |
| Option | `cust-select/option/` | Migrated | Standalone in `src/app/controls/components/select/option`; `selected` now emits the option `value`. |

## Tab

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Tab | `cust-tab/tab/` | Blocked | Source folder no longer present in `controls-to-port`; re-import from the original project before migrating. |
| Tabs | `cust-tab/tabs/` | Blocked | Source folder no longer present in `controls-to-port`; re-import from the original project before migrating. |
| Tab actions | `cust-tab/tab-actions/` | Blocked | Source folder no longer present in `controls-to-port`; re-import from the original project before migrating. |

## Table

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Table | `table/` | Blocked | Heaviest: needs the missing `LinqGridFilters` control + `LinQRequestState` model, `cust-page`, `cust-button`/`cust-button-v2`, `cust-currency`, `cust-key-value`; `setTimeout` scroll-restore recursion to refactor; `_Dictionary` to re-point. |

## Table Dialogue

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Table dialogue | `cust-table-dialogue/` | Blocked | Needs the `table/` `_CustTableInterface` port; template references `cust-currency`/`cust-button-tertiary` without imports. |

## Zoom Image

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Zoom image | `cust-zoom-image/` | Migrated | Standalone in `src/app/controls/components/zoom-image`. |

## Other Controls

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Drag drop file upload | `drag-drop-file-upload/` | Ready | Re-point to the migrated library `DragAndDropFilesDirective`; Kendo icon classnames to remove. |
| Card table | `card-table/` (migrated to `src/app/controls/components/card-table`) | Pending | Convert to standalone component. |
| Table | `table/` (migrated to `src/app/controls/components/table`) | Pending | Convert to standalone component. |
| Tabs | `tabs/` (migrated to `src/app/controls/components/tabs`) | Migrated | Standalone `TabsComponent` with `TabComponent` in `tabs/tab/`; back/next button directives live alongside. |
| Drag drop file upload with comment | `drag-drop-file-upload-with-comment/` | Blocked | Needs a comment-handling directive (does not exist); Kendo floatinglabel/textarea markup to replace. |
| Dynamic material dialog | `dynamic-material-dialog/` | Migrated | Standalone in `src/app/controls/components/dynamic-material-dialog`; NgModule removed, typed model surface (`_DialogControl`/`_FormData`), strict-template fixes (removed `appearance="legacy"`, broken `[matCalendar]` binding), and a `google-places.d.ts` shim. |
| Dynamic window | `dynamic-window/` | Blocked | Needs a Kendo strategy decision (Kendo not installed), `DialogSetup`/`BtnGroup` model source, and `cust-button` first. |
| Expandable grid | `expandable-grid/` | Migrated | Standalone in `src/app/controls/components/expandable-grid`; detail expansion uses CSS `animate.enter`/`animate.leave`. |
| Expandable grid form | `expandable-grid/components/expandable-grid-form/` | Migrated | Standalone; `timeSpanPicker` and `chipList` field types omitted until those controls are migrated. The `timeSpanPicker` control is now available for wiring. |
| Numeric up/down | `numeric-up-down/` | Migrated | Standalone in `src/app/controls/components/numeric-up-down`; `upDownCallback` function input kept as-is for now. |
| Range checkbox group | `range-checkbox-group/` | Migrated | Standalone in `src/app/controls/components/range-checkbox-group`; typed `RangeCheckboxValue`. |
| Range checkbox | `range-checkbox-group/range-checkbox/` | Migrated | Standalone in `src/app/controls/components/range-checkbox-group/range-checkbox`. |
| Range slider | `range-slider/` | Ready | Self-contained; `detectChanges()`/`setTimeout`/fake-event patterns to refactor. |
| Search address | `search-address/` | Blocked | Needs a Google Maps script/typings decision; Kendo form-field markup to remove. |
| Time span picker | `time-span-picker/` | Migrated | Standalone CVA control in `src/app/controls/components/time-span-picker`; legacy `toLocaleString` zero-padding replaced with `padStart`; on `touch` now marked. |
| Zoomable image | `zoomable-image/` | Migrated | Standalone in `src/app/controls/components/zoomable-image`; `setTimeout` replaced with an `effect()` on a `showZoomLens` signal; legacy `mousewheel`/`DOMMouseScroll` listeners replaced with a standard `(wheel)` binding. |

## Services

Helper services in `src/app/controls-to-port/services`; review each for potential porting.

| Service | Source | Status | Notes |
| --- | --- | --- | --- |
| App shell service | `services/app-shell.service.ts` | Pending | Tracks menu behaviour (`over`/`side`) via `BehaviorSubject`. |
| Base64 to blob service | `services/b64-to-blob.service.ts` | Pending | Converts base64 data to `Blob`; uses Node `Buffer`. |
| Custom preloading strategy service | `services/custom-preloading-strategy.service.ts` | Pending | Preloads routes when `route.data.preload` is set. |
| Date/time ops service | `services/date-time-ops.service.ts` | Pending | Relative-time formatting and date helpers; uses `DatePipe`. |
| Error handling service | `services/error-handling.service.ts` | Pending | Global `ErrorHandler`; depends on `SnackbarService`. |
| Grid storage service | `services/grid-storage.service.ts` | Pending | Session-stored grid filter state; uses Kendo `DataSourceRequestState`. |
| Locale service | `services/locale.service.ts` | Pending | Loads Kendo CLDR locale data and switches the active locale. |
| Login service | `services/login.service.ts` | Pending | Authentication/JWT handling; depends on `NotificationService`, `User`, and `jwt-decode`. |
| Navigation service | `services/navigation.service.ts` | Pending | Builds role/country-filtered menus; depends on `LoginService` and models. |
| Notification service | `services/notification.service.ts` | Pending | SignalR notifications/chat; depends on Kendo, API models, and SignalR. |
| Open page service | `services/open-page.service.ts` | Pending | Routing helper for in-app/new-tab navigation; class name is `openPageService`. |
| Search retain service | `services/search-retain.service.ts` | Pending | Holds and clears the grid search value via `BehaviorSubject`. |
| Snackbar service | `services/snackbar.service.ts` | Migrated | Replaced by the Material-based `SnackbarService` in `src/app/library/services/snackbar.service.ts`; duplicate suppression preserved. Stacked notifications/"Close All", the `errorList` buffer with `dev_show_error` gating, and the Kendo slide animation are intentionally dropped. Legacy consumers still in `controls-to-port` are listed in `SERVICES_CONTRACTS.md`. |

## Pipes

Contracts for migrated pipes live in `src/app/library/pipes/PIPES_CONTRACTS.md`.

| Pipe | Source | Status | Notes |
| --- | --- | --- | --- |
| Absolute | `pipes/absolute.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/absolute`. |
| Camel to title | `pipes/camel-to-title.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/camel-to-title`. |
| Currency in string | `pipes/currency-in-string-pipe/` | Migrated | Standalone in `src/app/library/pipes/currency-in-string`; uses `formatCurrency`. |
| Day and hours | `pipes/day-and-hour-pipe/` | Migrated | Standalone in `src/app/library/pipes/day-and-hours`. |
| Format null | `pipes/format-null-pipe/` | Migrated | Standalone in `src/app/library/pipes/format-null`; template name `formatNull`. |
| Obscure text | `pipes/obscure-text-pipe/` | Migrated | Standalone in `src/app/library/pipes/obscure-text`. |
| Pascal to title | `pipes/pascal-to-title-pipe/` | Migrated | Standalone in `src/app/library/pipes/pascal-to-title`. |
| Postfix | `pipes/postfix/` | Migrated | Standalone in `src/app/library/pipes/postfix`. |
| Remove spaces | `pipes/remove-spaces-pipe/` | Migrated | Standalone in `src/app/library/pipes/remove-spaces`. |
| Remove underscore | `pipes/underscore-to-title.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/remove-underscore`; template name `removeUnderscore`. |
| Round to Nth | `pipes/round-to-nth-pipe/` | Migrated | Standalone in `src/app/library/pipes/round-to-nth`. |
| Safe | `pipes/safe.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/safe`; injects `DomSanitizer`. |
| Space between uppercase | `pipes/space-between-uppercase-pipe/` | Migrated | Standalone in `src/app/library/pipes/space-between-uppercase`; class renamed to `SpaceBetweenUppercasePipe`. |
| Thousand separator | `pipes/thousand-separator-pipe/` | Migrated | Standalone in `src/app/library/pipes/thousand-separator`. |
| Character spacing | `pipes/character-spacing.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/character-spacing`; name `characterSpacing`. |
| Contains | `pipes/contains.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/contains`; name `contains`. |
| Email to initials | `pipes/email-to-initials.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/email-to-initials`; name `emailToInitials`. |
| Filter | `pipes/filter.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/array-filter`; name `arrayFilter`, class kept as `FilterPipe`. |
| Group by date | `pipes/group-by-date.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/group-by-date`; injects `DatePipe`. |
| Hide trade retail | `pipes/hide-trade-retail-pipe/` | Dropped | Deleted without migration, per developer request. |
| Highlight search match | `pipes/highlight-search-match.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/highlight-search-match`; name `searchMatch`. |
| Kebab to title | `pipes/kebab-to-title.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/kebab-to-title`. |
| Name to initials | `pipes/name-to-initials.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/name-to-initials`. |
| Nearest | `pipes/nearest.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/nearest`. |
| Order by | `pipes/order-by.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/order-by`; comparator-function input only. |
| Ordinal | `pipes/ordinal.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/ordinal`. |
| Percentage | `pipes/percentage.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/percentage`. |
| Remove email domain | `pipes/remove-email-domain.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/remove-email-domain`; name `removeDomain`. |
| Sort | `pipes/sort.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/sort`; name `sort`, class kept as `ArraySortPipe`. |
| Time elapsed | `pipes/time-elapsed.pipe.ts` | Blocked | Depends on the un-ported `DateTimeOpsService`; the source stays in `controls-to-port/pipes` until that service is migrated. |
| Time format | `pipes/time-format.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/time-format`; impure pipe kept impure. |
| Time in string | `pipes/time-in-string-pipe/` | Migrated | Standalone in `src/app/library/pipes/time-in-string`; injects `DatePipe`. |
| Time mask | `pipes/time-mask.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/time-mask`. |
| To number | `pipes/to-number.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/to-number`. |
| Trim characters | `pipes/trim-characters.pipe.ts` | Migrated | Standalone in `src/app/library/pipes/trim-characters`; overlaps with `truncate`, flagged in `PIPES_CONTRACTS.md`. |

## Supporting Code

These are dependencies of the controls above and should be migrated alongside them.

| Item | Source | Status | Notes |
| --- | --- | --- | --- |
| Page base class | `cust-page/cust-page.class.ts` | Blocked | Needs the missing `_LinQGridFilterItem` model (the `linq-grid-filters` control body is empty); strict-mode violations throughout. |
| Basic controls service | `cust-basic-controls/cust-basic-controls.service.ts` | Blocked | Decision needed: delete (email part duplicates the library email validator) or fold into library validators; currently unused. |
| Basic controls models | new `src/app/library/models/cust-basic-controls.ts` | Migrated | Shared interfaces/enums for the chips/buttons/inputs family; created during the batch 2 port (new `@shared/models/*` tsconfig alias). Legacy `cust-basic-controls.interface.ts`/`.enum.ts` stay in `controls-to-port` until every blocked consumer is ported. |
| Dynamic dialog service | `dynamic-material-dialog/dynamic-dialog.service.ts` | Migrated | Standalone root service at `src/app/controls/components/dynamic-material-dialog/dynamic-dialog.service.ts`. |
| Shared directives | `directives/` | Migrated | Migrated to `src/app/library/directives`; legacy copies removed. |
| Shared validators | `validators/` | Migrated | Migrated to `src/app/library/validators`; legacy copies removed. |
| Click elsewhere directive | `cust-select/select/cust-click-elsewhere.directive.ts` | Migrated | Standalone `ClickElsewhereDirective` at `src/app/library/directives/click-elsewhere.directive.ts`; selector renamed to `[appClickElsewhere]`. |
| Tab next button directive | `cust-tab/tab-next-button.directive.ts` | Migrated | Standalone at `src/app/controls/components/tabs/tab-next-button.directive.ts`. |
| Tab back button directive | `cust-tab/tab-back-button.directive.ts` | Migrated | Standalone at `src/app/controls/components/tabs/tab-back-button.directive.ts`. |
| Accordion directives | `accordion/directives/` | Migrated | Standalone attribute directives: `appAccordionItem`, `appAccordionHeader`, `appAccordionContent`. |
| Shared grid filters | `shared-controls/grid-filters/` | Pending | Folder is currently empty. |

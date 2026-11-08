# Controls Migration Tracker

Tracks the migration of custom controls in `src/app/controls-to-port` to the newer Angular version used in this template.

> **Note:** `src/app/controls-to-port` does not have to be kept in a working state. Once a control or supporting item is migrated, it can be removed from the old code.

> **Animation migration:** Extract each animation into its own file in an `animations/` folder inside the owning control (for example `src/app/controls/components/accordion/animations/accordion-expansion-animation.ts`) and convert deprecated `@angular/animations` triggers to the newer `animate.enter`/`animate.leave` standard.

## Status key

| Status | Meaning |
| --- | --- |
| Pending | Not yet started. |
| In progress | Migration work has started. |
| Migrated | Finalised and migrated into the template. |
| Blocked | Waiting on a dependency or decision. |

## Summary

- Total controls: 62
- Migrated: 11
- In progress: 0
- Pending: 51
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
| Button primary | `cust-basic-controls/cust-button-primary/` | Pending | |
| Button secondary | `cust-basic-controls/cust-button-secondary/` | Pending | |
| Button tertiary | `cust-basic-controls/cust-button-tertiary/` | Pending | |
| Button text | `cust-basic-controls/cust-button-text/` | Pending | |
| Button toggle | `cust-basic-controls/cust-button-toggle/` | Migrated | Standalone in `src/app/controls/components/button-toggle`; typed `ButtonToggleInput`/`ButtonToggleResponse`. |
| Button v2 | `cust-basic-controls/cust-button-v2/` | Pending | |
| Chip status | `cust-basic-controls/cust-chip-status/` | Pending | |
| Chips | `cust-basic-controls/cust-chips/` | Pending | |
| DEKRA button | `cust-basic-controls/cust-dekra-button/` | Pending | |
| Housing card | `cust-basic-controls/cust-housing-card/` | Pending | |
| Info card | `cust-basic-controls/cust-info-card/` | Pending | |
| Input currency | `cust-basic-controls/cust-input-currency/` | Pending | |
| Input email | `cust-basic-controls/cust-input-email/` | Pending | |
| Input number | `cust-basic-controls/cust-input-number/` | Pending | |
| Input phone | `cust-basic-controls/cust-input-phone/` | Pending | |
| Input select | `cust-basic-controls/cust-input-select/` | Pending | |
| Input text | `cust-basic-controls/cust-input-text/` | Pending | |
| List card | `cust-basic-controls/cust-list-card/` | Pending | |
| Range date picker | `cust-basic-controls/cust-range-date-picker/` | Pending | |
| Slide toggle | `cust-basic-controls/cust-slide-toggle/` | Pending | |
| Tabs | `cust-basic-controls/cust-tabs/` | Pending | |

## Button

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Button | `cust-button/button/` | Pending | |
| FAB button | `cust-button/fab-button/` | Pending | |

## Card

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Card | `cust-card/card/` | Pending | |
| Card header | `cust-card/card-header/` | Pending | |

## Card Table

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Card table | `cust-card-table/table/` | Pending | |

## Carousel

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Carousel | `cust-carousel/carousel/` | Pending | |

## Count Down

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Count down | `cust-count-down/` | Pending | |

## Currency

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Currency | `cust-currency/currency/` | Pending | |

## Gallery

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Gallery | `cust-gallery/gallery/` | Pending | |
| Gallery preview | `cust-gallery/gallery-preview/` | Pending | |

## Input

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Input | `cust-input/input/` | Pending | |

## Key Value

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Key value | `cust-key-value/key-value/` | Pending | |
| Key value v2 | `cust-key-value/key-value-v2/` | Pending | |
| Key value v3 | `cust-key-value/key-value-v3/` | Pending | |

## Loader

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Loader | `cust-loader/loader/` | Pending | |

## Media Dialog

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Media dialog | `cust-media-dialog/` | Pending | |

## Select

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Select | `cust-select/select/` | Pending | |
| Option | `cust-select/option/` | Pending | |

## Tab

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Tab | `cust-tab/tab/` | Pending | |
| Tabs | `cust-tab/tabs/` | Pending | |
| Tab actions | `cust-tab/tab-actions/` | Pending | |

## Table

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Table | `cust-table/table/` | Pending | |

## Table Dialogue

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Table dialogue | `cust-table-dialogue/` | Pending | |

## Zoom Image

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Zoom image | `cust-zoom-image/` | Pending | |

## Other Controls

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Drag drop file upload | `drag-drop-file-upload/` | Pending | |
| Card table | `card-table/` (migrated to `src/app/controls/components/card-table`) | Pending | Convert to standalone component. |
| Table | `table/` (migrated to `src/app/controls/components/table`) | Pending | Convert to standalone component. |
| Tabs | `tabs/` (migrated to `src/app/controls/components/tabs`) | Migrated | Standalone `TabsComponent` with `TabComponent` in `tabs/tab/`; back/next button directives live alongside. |
| Drag drop file upload with comment | `drag-drop-file-upload-with-comment/` | Pending | |
| Dynamic material dialog | `dynamic-material-dialog/` | Migrated | Standalone in `src/app/controls/components/dynamic-material-dialog`; NgModule removed, typed model surface (`_DialogControl`/`_FormData`), strict-template fixes (removed `appearance="legacy"`, broken `[matCalendar]` binding), and a `google-places.d.ts` shim. |
| Dynamic window | `dynamic-window/` | Pending | |
| Expandable grid | `expandable-grid/` | Migrated | Standalone in `src/app/controls/components/expandable-grid`; detail expansion uses CSS `animate.enter`/`animate.leave`. |
| Expandable grid form | `expandable-grid/components/expandable-grid-form/` | Migrated | Standalone; `timeSpanPicker` and `chipList` field types omitted until those controls are migrated. |
| Numeric up/down | `numeric-up-down/` | Pending | |
| Range checkbox group | `range-checkbox-group/` | Migrated | Standalone in `src/app/controls/components/range-checkbox-group`; typed `RangeCheckboxValue`. |
| Range checkbox | `range-checkbox-group/range-checkbox/` | Migrated | Standalone in `src/app/controls/components/range-checkbox-group/range-checkbox`. |
| Range slider | `range-slider/` | Pending | |
| Search address | `search-address/` | Pending | |
| Time span picker | `time-span-picker/` | Pending | |
| Zoomable image | `zoomable-image/` | Pending | |

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
| Page base class | `cust-page/cust-page.class.ts` | Pending | |
| Basic controls service | `cust-basic-controls/cust-basic-controls.service.ts` | Pending | |
| Dynamic dialog service | `dynamic-material-dialog/dynamic-dialog.service.ts` | Migrated | Standalone root service at `src/app/controls/components/dynamic-material-dialog/dynamic-dialog.service.ts`. |
| Shared directives | `directives/` | Migrated | Migrated to `src/app/library/directives`; legacy copies removed. |
| Shared validators | `validators/` | Migrated | Migrated to `src/app/library/validators`; legacy copies removed. |
| Click elsewhere directive | `cust-select/select/cust-click-elsewhere.directive.ts` | Pending | |
| Tab next button directive | `cust-tab/tab-next-button.directive.ts` | Migrated | Standalone at `src/app/controls/components/tabs/tab-next-button.directive.ts`. |
| Tab back button directive | `cust-tab/tab-back-button.directive.ts` | Migrated | Standalone at `src/app/controls/components/tabs/tab-back-button.directive.ts`. |
| Accordion directives | `accordion/directives/` | Migrated | Standalone attribute directives: `appAccordionItem`, `appAccordionHeader`, `appAccordionContent`. |
| Shared grid filters | `shared-controls/grid-filters/` | Pending | Folder is currently empty. |

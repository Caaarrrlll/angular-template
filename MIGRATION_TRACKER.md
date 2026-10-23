# Controls Migration Tracker

Tracks the migration of custom controls in `src/app/controls-to-port` to the newer Angular version used in this template.

> **Note:** `src/app/controls-to-port` does not have to be kept in a working state. Once a control or supporting item is migrated, it can be removed from the old code.

## Status key

| Status | Meaning |
| --- | --- |
| Pending | Not yet started. |
| In progress | Migration work has started. |
| Migrated | Finalised and migrated into the template. |
| Blocked | Waiting on a dependency or decision. |

## Summary

- Total controls: 63
- Migrated: 0
- In progress: 0
- Pending: 63

Update the summary whenever a control is finalised.

## Accordion

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Accordion | `accordion/` | Pending | |

## Checkbox Group

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Checkbox group | `checkbox-group/` | Pending | |
| Checkbox | `checkbox-group/checkbox/` | Pending | |

## Confirmation Dialog

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Confirmation dialog | `confirmation-dialog/` | Pending | |

## Basic Controls

| Control | Source | Status | Notes |
| --- | --- | --- | --- |
| Button primary | `cust-basic-controls/cust-button-primary/` | Pending | |
| Button secondary | `cust-basic-controls/cust-button-secondary/` | Pending | |
| Button tertiary | `cust-basic-controls/cust-button-tertiary/` | Pending | |
| Button text | `cust-basic-controls/cust-button-text/` | Pending | |
| Button toggle | `cust-basic-controls/cust-button-toggle/` | Pending | |
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
| Tabs | `tabs/` (migrated to `src/app/controls/components/tabs`) | Pending | Convert to standalone component. |
| Drag drop file upload with comment | `drag-drop-file-upload-with-comment/` | Pending | |
| Dynamic material dialog | `dynamic-material-dialog/` | Pending | |
| Dynamic window | `dynamic-window/` | Pending | |
| Expandable grid | `expandable-grid/` | Pending | |
| Expandable grid form | `expandable-grid/components/expandable-grid-form/` | Pending | |
| Numeric up/down | `numeric-up-down/` | Pending | |
| Query builder | `query-builder/` | Pending | |
| Range checkbox group | `range-checkbox-group/` | Pending | |
| Range checkbox | `range-checkbox-group/range-checkbox/` | Pending | |
| Range slider | `range-slider/` | Pending | |
| Search address | `search-address/` | Pending | |
| Time span picker | `time-span-picker/` | Pending | |
| Zoomable image | `zoomable-image/` | Pending | |

## Supporting Code

These are dependencies of the controls above and should be migrated alongside them.

| Item | Source | Status | Notes |
| --- | --- | --- | --- |
| Page base class | `cust-page/cust-page.class.ts` | Pending | |
| Basic controls service | `cust-basic-controls/cust-basic-controls.service.ts` | Pending | |
| Dynamic dialog service | `dynamic-material-dialog/dynamic-dialog.service.ts` | Pending | |
| Submit directive | `directives/submit.directive.ts` | Pending | |
| Focus directive | `directives/focus.directive.ts` | Pending | |
| After value change directive | `directives/after-value-change.directive.ts` | Pending | |
| Click elsewhere directive | `cust-select/select/cust-click-elsewhere.directive.ts` | Pending | |
| Tab next button directive | `cust-tab/tab-next-button.directive.ts` | Pending | |
| Tab back button directive | `cust-tab/tab-back-button.directive.ts` | Pending | |
| Accordion directives | `accordion/directives/` | Pending | |
| Shared grid filters | `shared-controls/grid-filters/` | Pending | Folder is currently empty. |

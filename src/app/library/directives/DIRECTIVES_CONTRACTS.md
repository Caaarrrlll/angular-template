# Directive Contracts

This file documents the shared directives in `src/app/library/directives`. Review it before creating a new directive, and update it whenever a directive is added, changed, or removed (see AGENTS.md → Contracts).

> Selectors were renamed to the `app` prefix on 2026-11-18 (AUD-03). Old attribute names (`autoFocus`, `copyText`, `currencyInput`, `dateTransform`, `MinMax`, `MinMaxDecimal`, `NDigitDecimalNumber`, `NumericInput`, `cursorFollowZoom`) no longer match — forks using them must rename the attributes.

## Directive Index

| Directive                      | Selector                             | File                                  | Standalone | Summary                                                                |
| ------------------------------ | ------------------------------------ | ------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `AutoFocusInputDirective`      | `[appAutoFocus]`                     | `auto-focus-input.directive.ts`       | Yes        | Focuses the host element after the view initialises.                   |
| `ClickElseWhereDirective`      | `[appClickElsewhere]`                | `click-else-where.directive.ts`       | Yes        | Emits when a document click lands outside the host element.            |
| `CopyTextDirective`            | `[appCopyText]`                      | `copy-text.directive.ts`              | Yes        | Click-to-copy with an appended copy icon and a snackbar confirmation.  |
| `CurrencyInputDirective`       | `[appCurrencyInput]`                 | `currency-input.directive.ts`         | Yes        | Formats an input's displayed value as currency (no decimals), clamped. |
| `CurrencyMaskDirective`        | `[formControlName][appCurrencyMask]` | `currency-mask.directive.ts`          | Yes        | Masks a form-control input as `R` + thousands-separated digits.        |
| `DateTransformDirective`       | `[appDateTransform]`                 | `date-transform.directive.ts`         | Yes        | Reformats a date typed into an input with a `DatePipe` format.         |
| `DragAndDropFilesDirective`    | `[appDragAndDropFiles]`              | `drag-and-drop-files.directive.ts`    | Yes        | Turns the host into a file drop zone; emits the dropped files.         |
| `MinMaxDirective`              | `[appMinMax]`                        | `min-max.directive.ts`                | Yes        | Digits-only typing, clamped to `min`/`max` on input.                   |
| `MinMaxDecimalDirective`       | `[appMinMaxDecimal]`                 | `min-max-decimal.directive.ts`        | Yes        | Digits/`.`/`,` typing, clamped to `min`/`max` on input.                |
| `NDigitDecimalNumberDirective` | `[appNDigitDecimalNumber]`           | `n-digit-decimal-number.directive.ts` | Yes        | Blocks keys that would exceed N decimal places.                        |
| `NumericInputDirective`        | `[appNumericInput]`                  | `numeric-input.directive.ts`          | Yes        | Allows only the digits 0-9 to be typed.                                |
| `ZoomDirective`                | `img[appCursorFollowZoom]`           | `zoom.directive.ts`                   | Yes        | Cursor-following magnifier for the gallery's main image.               |

Live demos of every directive: `/sandbox/inputs` (input directives), `/sandbox/misc` (`appCopyText`, `appClickElsewhere`), `/sandbox/media` (`appCursorFollowZoom` via the gallery), `/sandbox/upload` (`appDragAndDropFiles`).

## AutoFocusInputDirective

- **Purpose:** Calls `focus()` on the host element in `ngAfterViewInit`.
- **Inputs / outputs:** none.
- **Example:** `<input matInput appAutoFocus />`
- **Notes:** Focuses once, when the element is created — render it conditionally (`@if`) to re-trigger.

## ClickElseWhereDirective

- **Purpose:** Listens to `document:click` and emits when the click target is outside the host element (close menus/popovers).
- **Outputs:** `clickElsewhere: EventEmitter<MouseEvent>`.
- **Example:** `<div appClickElsewhere (clickElsewhere)="closeMenu()">…</div>`

## CopyTextDirective

- **Purpose:** Adds a `content_copy` icon to the host; clicking the host copies the text to the clipboard and shows a snackbar.
- **Inputs:** `appCopyText: string` — text to copy. When empty, the host's `textContent` is used. Bind it when the content changes after render (grids, OnPush).
- **Example:** `<span appCopyText>{{ reference }}</span>` or `<span [appCopyText]="accountNumber()">Copy account</span>`
- **Dependencies:** `Clipboard` (CDK), `SnackbarService`.
- **Known issues:** the `copyAndPasteElement`/`copyAndPasteIcon`/`copyAndPasteIconActive` classes it adds have no styles in `src` (AUD-27).

## CurrencyInputDirective

- **Purpose:** Formats the displayed value with `CurrencyPipe` (`symbol`, `1.0-0`) on init and on every `ngModelChange`, clamping to `min`/`max`.
- **Inputs:** `currencyCode` (default: the app's `DEFAULT_CURRENCY_CODE`, set once in `main.ts`), `min?: number`, `max?: number`.
- **Example:** `<input matInput type="text" formControlName="amount" appCurrencyInput [min]="0" [max]="100000" />`
- **Dependencies:** injects `CurrencyPipe` — the host component must provide it (`providers: [CurrencyPipe]`).
- **Known issues:** display-only — the form value is not changed; strip non-digits before submitting (AUD-15).

## CurrencyMaskDirective

- **Purpose:** On `ngModelChange`/backspace, rewrites the input through the control's value accessor as the currency's narrow symbol + digits grouped with commas (max 10 digits).
- **Inputs:** `currencyCode` (ISO 4217), default the app's `DEFAULT_CURRENCY_CODE` (set once in `main.ts`; it was a hard-coded `R` until 2026-11-20).
- **Selector requirement:** must sit on an element with `formControlName`.
- **Example:** `<input matInput type="text" formControlName="price" appCurrencyMask />`
- **Known issues:** display-only, like `appCurrencyInput` (AUD-15).

## DateTransformDirective

- **Purpose:** Reformats the input's value with `DatePipe` after view init and on `ngModelChange` when the value parses as a date.
- **Inputs:** `appDateTransform: string` — a `DatePipe` format (e.g. `"dd MMM yyyy"`).
- **Example:** `<input matInput formControlName="date" appDateTransform="dd MMM yyyy" />`
- **Notes:** provides its own `DatePipe`.

## DragAndDropFilesDirective

- **Purpose:** Prevents the browser's default drop behaviour, toggles the `fileover` class while dragging, and emits the dropped files.
- **Outputs:** `fileDropped: EventEmitter<File[]>`.
- **Host binding:** `class.fileover` while a drag is over the element.
- **Example:** `<div appDragAndDropFiles (fileDropped)="onFiles($event)">Drop files here</div>`
- **Known issues:** no `accept` filtering on drop (AUD-21).

## MinMaxDirective

- **Purpose:** Blocks non-digit keypresses and clamps the value to `min`/`max` on input.
- **Inputs:** `min?: number`, `max?: number`.
- **Example:** `<input matInput type="number" appMinMax [min]="0" [max]="10" />`

## MinMaxDecimalDirective

- **Purpose:** Like `appMinMax`, but also allows `.` and `,` to be typed.
- **Inputs:** `min?: number`, `max?: number`.
- **Example:** `<input matInput type="text" appMinMaxDecimal [min]="0" [max]="10" />`
- **Known issues:** clamps with `parseInt`, so decimals are compared as whole numbers (AUD-15).

## NDigitDecimalNumberDirective

- **Purpose:** On `keydown`, prevents keys that would make the value exceed `numberOfDecimals` decimal places (navigation/editing keys are always allowed).
- **Inputs:** `numberOfDecimals = "2"`.
- **Example:** `<input matInput type="text" appNDigitDecimalNumber numberOfDecimals="3" />`
- **Notes:** the host must be a text input (`selectionStart` is used).

## NumericInputDirective

- **Purpose:** Blocks every keypress that is not a digit 0-9.
- **Example:** `<input matInput type="text" appNumericInput />`
- **Notes:** filters typing only — pasted text is not filtered.

## ZoomDirective

- **Purpose:** Shows a magnifier box that follows the cursor over an image and changes zoom on the mouse wheel. Built for the gallery's fullscreen view.
- **Inputs:** `appCursorFollowZoom: boolean` (enable), `zoomBox: HTMLElement | undefined` (the magnifier element, usually a template reference), `height = 300`, `width = 400`, `zoom = 2`.
- **Requirements:** the host must be an `<img>` (it is the zoomed image). The `zoomBox` element needs the image as its `background-image` and a `galleryZoomBoxVisible` class that shows it (see the gallery SCSS). No ids are used, so any number of instances can share a page.
- **Example:** `<span #zoomBox class="galleryZoomBox" [style.background-image]="'url(' + src + ')'"></span> <img [src]="src" [appCursorFollowZoom]="imageZoom && fullscreenOpen" [zoomBox]="zoomBox" />`
- **Changed 2026-11-18 (AUD-20):** the `imageID` input and the `#galleryZoomBox` / `#mainGalleryImage` ids were removed (breaking for forks that used them); the wheel listener uses the standard `wheel` event.

# Roadmap History

Historical record of completed roadmap projects. The live roadmap lives in `ROADMAP.md`.
Maintenance rule (see `ROADMAP.md`): after a task is confirmed complete, move its section here.

---

## Signals migration (done 2026-11-14, Phases 0–3; Phases 4–5 dropped by decision)

Migrate the entire project to Angular signals instead of decorator-based reactivity.

### Current state (surveyed 2026-11-13)

- ~250 `@Input()` and 59 `@Output()` across 63 files (controls + library directives); 109 `EventEmitter<` type usages.
- Only `button-v1` uses the signals API (`input()`, `signal`, `computed`) — it is the reference pattern.
- 9 files use `@ViewChild`/`@ViewChildren` (all plain `@ViewChild("name") ElementRef` — direct `viewChild()` swaps).
- 8 files use `ngOnChanges` (6 controls: carousel, gallery-preview, list-card, gallery, search-address, tab-group; 2 directives: copy-text, zoom).
- 3 `ControlValueAccessor` implementations: checkbox-group, time-span-picker, range-checkbox-group.
- No component inheritance anywhere — every migration is a local change.
- No two-way binding pairs (`@Output` named `xChange` for `@Input` `x`) — no `model()` candidates today; use `model()` only where a parent actually binds `[(x)]`.
- One `@Input` setter: `count-down` `timeLeft` (candidate for `linkedSignal`).

### Rules (applied to every phase)

- Replace `@Input()` with `input()` (default) or `input.required()` (no default, always bound); `@Output() EventEmitter<T>` with `output<T>()`.
- **Getter → `computed()` changes call syntax**: template usages `{{ foo }}` / `[x]="foo"` must become `foo()`. This is the highest-risk mechanical change — grep the component's template for every getter being converted.
- Manual recalculation in `ngOnChanges`/`ngOnInit` becomes `computed()`; use `linkedSignal()` when a derived value is also locally writable (e.g. count-down's `timeLeft`); use `effect()` only for side effects signals cannot express (DOM APIs, third-party widgets).
- Keep `ControlValueAccessor` methods (`writeValue`, `registerOnChange`, `setDisabledState`) as plain methods; convert their decorator inputs the same as any other.
- `@ViewChild("x") y?: ElementRef` → `y = viewChild<ElementRef>("x")` (template refs must exist in the template).
- Keep `takeUntilDestroyed` subscription teardown as-is; do not rewrite RxJS streams to signals in this migration.
- One control per commit/batch; verify with `ng build` + visual check in the sandbox (`/sandbox`, dev only) before moving on. Run `npm run lint` per batch.

### Phases

**Phase 0 — establish the pattern (done):** `button-v1` already migrated. Finish its remaining `@Output()` (`selected`) as the first live example of `output()`.

**Phase 1 — trivial leaf controls** (done 2026-11-14; exceptions: `tab` (sub) deferred to Phase 2 because the tabs parent/directives mutate child tab props directly; `select` had already been deleted from the project; `evaluation-comparison` was removed from the project on 2026-11-14): `loader`, `fab-button`, `button-primary`, `button-secondary`, `button-tertiary`, `button-text`, `slide-toggle`, `currency`, `housing-card`, `card`, `card-header`, `option`, `select`, `checkbox` (sub), `range-checkbox` (sub), `chips`, `chip-status`, `numeric-up-down`, `key-value`, `key-value-v2`, `key-value-v3`, `tab` (sub), `media-dialog`, `confirmation-dialog`, `evaluation-comparison`.

**Phase 2 — input family + simple mid-size controls (done 2026-11-14):** `input` + `input-text`, `input-email`, `input-number`, `input-phone`, `input-currency`, `input-select` (these carry subscription setup in `ngOnInit` — convert inputs to `input()` but leave the subscription wiring alone); `button-v2`, `button-toggle`, `drag-drop-file-upload`, `tabs` + `tab-back-button.directive` + `tab-next-button.directive`. (CVA trio moved to "Do not migrate".)

**Phase 3 — ngOnChanges redesigns only (done 2026-11-14):** `carousel` (effect + untracked for images lookup; snackbar side effect out of computation), `gallery-preview` (window state → computed, re-centering → effect, mutation of input images replaced by computed visibility check), `tab-group` (matTabGroupConfig rebuild → single computed, `tabToUse` writable signal two-way bound, `tabUpdate` input removed), `count-down` (`seconds` → `linkedSignal` from `timeLeft`, interval start → effect, `timeRemaining` → `output()`).

**Phase 4 — dropped (see "Do not migrate").**

**Phase 5 — dropped (see "Do not migrate").**

### Do not migrate (high risk, little or no benefit — reviewed 2026-11-13)

The goal is pragmatic cleanup, not forcing signals everywhere. These stay on the decorator API; they work and the migration cost outweighs any benefit. New/future controls should use the signals API from the start.

- **Heavy coupled controls:** `table`, `card-table`, `linq-grid-filters`, `expandable-grid`, `dynamic-material-dialog`, `dynamic-window`, `info-card`, `list-card`, `gallery`, `search-address`. Highest decorator counts, heavy template coupling, sort/filter/pagination/Google-Places behavior to retest, large diffs with no user-facing benefit. Touch them only when a bug or feature forces a change, and keep the existing style in that file.
- **CVA trio inputs** (`checkbox-group`, `range-checkbox-group`, `time-span-picker`): converting inputs changes value-arrival ordering relative to `writeValue`; form-behavior regression risk for near-zero gain. Accessor methods stay, decorators stay.
- **Library directives sweep** (all `library/directives/*`, plus `copy-text`/`zoom` ngOnChanges): these are small, stable, DOM-sync utilities; an `effect()` rewrite adds machinery without removing complexity.
- **Standalone getter → `computed()` conversions**: getters that are cheap pure derivations stay getters. Convert a getter to `computed()` only when already redesigning that file's `ngOnChanges` logic — never as its own migration (template call-syntax `foo` → `foo()` breakage risk for no behavioral win).
- **Standalone `@ViewChild` → `viewChild()` swaps**: only convert view references in files migrated for another reason.
- **`input.required()`**: avoid unless a template grep proves every usage binds the input; prefer `input()` with a default.

### Risk rules (used for the phases that ran)

1. **Getter call-syntax breakage** (silent in some cases): every `computed()` conversion must be paired with template updates `foo` → `foo()`.
2. **`input.required()` on loosely-bound controls**: only mark required when every usage binds the input; the sandbox alone is not proof — grep segment templates too.
3. **`ngOnChanges` with multi-input interplay**: can become order-dependent `computed()` chains; verify each control's sandbox demo against the pre-migration behavior (screenshots/side-by-side).
4. **CVA ordering**: `input()` changes when values arrive relative to `writeValue`; test form interactions, not just initial render.
5. **`@ViewChild` on conditionally-rendered refs** (`@if` blocks): `viewChild()` returns a signal that updates when the ref appears — verify the old `undefined`-handling logic still holds.

---

## Project CSS cleanup (Phases 0–3 done 2026-11-14; Phase 4 optional remains)

Sweep the entire project's CSS: remove dead/unused styles, deduplicate repeated rules across controls, normalize spacing/naming conventions.

- Work control-by-control with a sandbox visual check per batch (same cadence as the signals migration).

### Survey (2026-11-14)

- 61 `.scss`/`.css` files, ~50 KB total, all component-scoped; global `styles.scss` is tiny (~40 lines, snackbar theming only).
- **Zero shared SCSS foundation** — no `_variables`, no mixins, no utility partials anywhere.
- Hardcoded color duplication (top counts): white `#fff`/`#ffffff` ×58, brand orange `#f47920` ×25 with five near-variants in use (`c5580a`, `f79147`, `e6670b`, `e25e00`, `ed6c02`), dark navy `#1b2935` ×19 plus variants (`18242e`, `2d4559`, `444c53`), assorted grays with near-duplicates (`dcdcdc`/`dedede`/`f2f2f2`).
- Identical rules copy-pasted across components (e.g. `.show-pointer` in all three key-value variants); minor inconsistency: `#fff` vs `#ffffff` for the same white.
- Material prebuilt theme `indigo-pink.css`; components override with hardcoded hex values.

### Plan (phases)

1. **Phase 0 — token foundation (done 2026-11-14):** created `src/app/library/styles/_tokens.scss` (33 palette/status tokens, near-variants kept separate, documented) and `_utilities.scss` (cursor-pointer mixin, grows in Phase 2); importable via angular.json `stylePreprocessorOptions.includePaths = src/app/library/styles` (build + test targets). No dependencies added — plain SCSS.
2. **Phase 1 — token replacement (done 2026-11-14):** batches ran by color group instead of control family (white/black, orange incl. `rgba` for `#e25e0098`, navy/charcoal/slate/blue-gray, grays, semantic greens/reds/blues); 30 component scss files + `styles.scss` verified to `@use "tokens" as *;` and build + prettier verified per batch. Remaining literal hex in component scss = documented per-file singletons only (`_tokens.scss` comments list them). Deferred: hex inside HTML inline styles (chips, dynamic-material-dialog, drag-drop-file-upload, table check/close icons) and the tab-group TS default `--tab-label-hover-color` — those can't reference SCSS tokens until the styles move into scss/ts with real tokens.
3. **Phase 2 — dedupe copy-pasted rules (done 2026-11-14):** identical rules move into `_utilities.scss`/mixins and are `@include`d (keeps component encapsulation; avoids global-class collision risk). Only dedupe when rules are truly identical. Result: 4 mixins added (`cursor-pointer`, `orange-svg-filter`, `input-button-icon`, `input-button-wrapper`), 9 usages replaced across 6 files (key-value trio `.show-pointer`, gallery/gallery-preview orange SVG filter + hover, input family `.button-icon`/`.button-wrapper`). **Deferred — needs developer decision:** the two near-clone families (info-card ↔ list-card with ~15 identical rule pairs; drag-drop-file-upload ↔ dynamic-material-dialog with ~5 identical pairs) share copy-pasted styles; the clean fix is a shared partial `@use`d by both or a component merge — not a pile of global mixins. Also skipped: option ↔ orphan `select/select/` identical `.checkbox` blocks (orphan dies in Phase 3); standalone single `cursor: pointer` declarations left as-is (mixin adds no value).
4. **Phase 3 — dead-style removal (done 2026-11-14):** per file, grep each selector against the component template before deleting; started with the largest files (list-card, info-card, gallery). Also deleted the orphan `select/select/` scss/html/ts leftovers. Result: orphan `select/select/` folder deleted (empty .ts, zero consumers); survey script (class-selector extraction vs whole-src ts/html grep) found 43 candidates — after manual verification all but 10 were false positives kept: dynamic `[class]="color()"` inputs (card, card-header, button-v1), animation state strings (accordion), `'vehicle-imgs-' + preview()` dynamic classes (carousel), ZoomDirective `renderer.addClass` (`galleryZoomBoxVisible`), comment text (`_tokens.scss`/`_utilities.scss`). Deleted: card-table Material expansion-table demo leftovers (`tr.detail-row`, `.element-row td`, `.element-detail`), dynamic-window unused utilities (`.rotateButton`, `.k-textarea`, `.k-form-hint`, `.j-c-end`, `.j-c-space-between`, `.a-i-center` — component has ng-content but no `::ng-deep`, so emulated encapsulation can never match them), gallery-preview's dead duplicate `.galleryPreviewContainer` (the live styling lives in gallery's own scss), and 8 zero-byte scss files with their `styleUrls` entries (app, input-email, input-phone, input-select, search-address, slide-toggle, contact, landing). Pre-existing eslint `no-inferrable-types` debt in search-address.component.ts fixed while touched. Build + eslint + prettier verified.
5. **Phase 4 — naming normalization (optional, lowest priority):** only inside files already touched; keep selectors stable otherwise.

### Risks (for reference if Phase 4 or deferred items are picked up)

- View encapsulation: shared utilities must not rely on `::ng-deep`; `:host` contexts differ per component.
- Token values must match the old hex exactly (case/variant) — verify visually per batch, not just by build.
- Global utility classes could collide with Angular Material internals — prefer component-level `@use` + `@include` over global classes.
- Material prebuilt theme overrides: snackbar colors live in `styles.scss`; keep them as status-color tokens, not touched per component.

---

## Button family merge (done 2026-11-15, developer-approved Option A + delete button-v1)

### Inventory (6 controls in `src/app/controls/components/button/` at survey time)

- **`button-v1`** — legacy custom-styled button (not Material): 15 string-typed style inputs (`color`, `fontSize`, `padding`, …), `askToConfirm` double-click confirm with progress bar, contextmenu `mat-menu` of items. **Zero consumers** anywhere in src.
- **`button-v2`** — the real engine: takes `CustButtonInput` (incl. `CustButtonType`: Primary/Secondary/Tertiary/Text/Disabled/Icon), renders Material buttons with `color-set-*` classes, icon/tooltip/loading/isTableButton handling. **1 consumer file** (info-card ×2).
- **`button-primary` / `button-secondary` / `button-tertiary`** — three **byte-identical 26-line wrappers** around button-v2 that overwrite `type` with their own variant. Consumers: dynamic-window (4+4), list-card (2+2+2), info-card (6 primary), table (2 primary + 2 secondary + 6 tertiary), table-dialogue (2 tertiary).
- **`button-text`** — identical 4th wrapper forcing `type: text`. **Zero consumers.** Bug: its selector is `app-button-primary` (duplicate of button-primary — latent collision if both are imported).

### Findings

1. The wrapper layer is pure sugar that creates friction: consumers must build a full `CustButtonInput` including a **throwaway `type: ""`** that the wrapper discards (table/info-card `tableButton()` helpers do exactly this).
2. button-v2 already covers every variant via `CustButtonType` — a single tag `<app-button-v2>` with the correct `type` in the input object replaces all four wrappers. The table/list-card config strings already use the enum spellings (`"Primary"`/`"Secondary"`/`"Tertiary"`).
3. `button-v1` is a different design language and dead code; it is not part of the v2-family merge.
4. Inputs render their own inline Material action button (via `_utilities.scss` mixins) — separate concern, unaffected by this merge.
5. Sandbox currently demos no buttons; per roadmap order, sandbox flesh-out lands after this merge.

### Result (done 2026-11-15)

- Deleted all five dead/derivative controls: `button-v1`, `button-primary`, `button-secondary`, `button-tertiary`, `button-text`. End state: `button-v2` + `fab-button` (one engine, no wrapper layer).
- Consumers switched to `<app-button-v2>` with the real variant in the object they already build: dynamic-window (`buttonInput` gained a `type = "Primary"` param; the two secondary call sites pass `"Secondary"`), info-card (`tableButton` hardcodes `"Primary"`; the inline object literal sets `type: 'Primary'`), list-card (`tableButton` gained `type = "Tertiary"`; the Primary/Secondary `@if` branches pass their variant), table (`tableButton` gained a 5th `type = "Primary"` param; tertiary/favourite/secondary call sites pass their variant), table-dialogue (`tableButton` hardcodes `"Tertiary"`).
- Behavior-preserving: the old wrappers only overwrote `type`; no consumer reads the emitted payload's `action`/`event` fields (verified by grep), so the payload-shape difference (CustChipReturn vs CustInputReturn) is inert.
- Verify: `ng build` passes (only pre-existing bundle-budget warning); prettier clean; no new lint errors introduced (remaining eslint output = pre-existing debt in the do-not-migrate heavy controls).
- Optional follow-up (not done): rename `button-v2` → `button`/`app-button` if the version suffix should go.

---

## Fab-button merge investigation (resolved 2026-11-15 — keep + parameterize; parameterization executed 2026-11-16)

**Current state at survey:** `fab-button` is a fixed-position floating help widget — hardcoded `help` icon, no inputs at all, one `emitClick` output, 60px orange circle pinned bottom-right with custom styles. **Zero consumers** anywhere in src.

**Verdict: it cannot meaningfully merge into button-v2.** The two are different control models: button-v2 is an inline-flow Material button driven by `CustButtonInput` (display/icon/tooltip/disabled/loading/table sizing); the fab is a page-level floating widget with fixed positioning, opposite styling (circular, fixed, opacity-hover) and no state. A merge would mean bolting `isFab`-style branches and fab-specific fields onto `CustButtonInput` — machinery for zero reuse, against KISS.

**Developer decision (2026-11-15): keep + parameterize, do not delete.** Parameterize: `icon = input("help")`, `aria-label`/tooltip input for a11y (the clickable `<div>` failed a11y rules — not keyboard focusable, no role). Executed 2026-11-16: `icon` input (default "help") + `ariaLabel` input (default "Help"); clickable div → real `<button type="button">` with `[attr.aria-label]` (native focus/keyboard/role); button resets in scss; `white` → `$color-white` token. Verified: eslint clean, prettier unchanged, ng build passes.

---

## Template control-flow migration (done 2026-11-16, verified 2026-11-17)

Convert remaining legacy structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`/`*ngSwitchCase`/`*ngSwitchDefault`) to the built-in control-flow blocks (`@if`, `@for`, `@switch`), per the project's template syntax standard.

### Survey (2026-11-16)

Legacy directives survived in exactly **one file** — every other template in src already used the new syntax:

- `dynamic-material-dialog.component.html` — **~92 usages**: 37 `*ngIf`, 22 `*ngFor`, 20 `*ngSwitchCase`, 1 `[ngSwitch]`, plus 13 `<ng-template [ngIf]>` wrappers (the `mat-error` validation blocks) that became plain `@if` blocks.
- Its TS imported `CommonModule` solely for these; after migration only the single `ngStyle` usage remained, replaced with a `[style]` binding so `CommonModule` was dropped from imports entirely.

### Result (done 2026-11-16)

- All ~92 legacy directives converted → `@if`/`@for`/`@switch` (title h2s kept as two separate `@if` blocks to preserve the "options exists but not draggable → no title" behavior; mat-error `ng-template [ngIf]` wrappers → `@if` inside `@for`; `$any()` casts + formControlName/[formGroupName] wiring preserved; track keys = formName/option.value/group.groupName/$index; `[ngStyle]` → `[style.justify-content]`; ng-container Upload case hoisted). TS: CommonModule dropped, AsyncPipe + CurrencyPipe imported (only remaining pipe usages).
- Verify (2026-11-16): zero legacy-directive matches in the template; ng build passes (no NG8113 unused-import warnings; strictTemplates green); eslint zero errors on the whole dialog folder (bonus: fixed 2 pre-existing eqeqeq `==` → `===` and added role/tabindex/keydown.enter to close icons + autocomplete lines per the project's established a11y pattern); prettier clean.
- Re-verified 2026-11-17 (final architecture analysis): zero legacy structural directives anywhere in src templates; dialog TS has no CommonModule import; ng build passes. Note: the usage examples in `PIPES_CONTRACTS.md` still show legacy `*ngIf` syntax (documentation only) — modernize opportunistically.

## Sandbox flesh-out (planned 2026-11-15, done 2026-11-17)

Extend the sandbox (`/sandbox`, dev only) so every control in `src/app/controls` has a demo entry covering its inputs, outputs and visual states. Today only accordion + expandable-grid have demos; the sandbox is a single page (`segments/sandbox/components/sandbox/`) with mock-data services (`sandbox-accordion-data.service.ts`, `sandbox-expandable-grid-data.service.ts`) and is already dev-gated (`environment.isLocal` in `app.routes.ts`).

### Survey (2026-11-15)

- 41 control folders under `src/app/controls/components` (~45 components incl. subs/directives): signal-API controls (~25 migrated ones), decorator-API heavy controls (table, card-table, info-card, list-card, gallery, dynamic-window, dynamic-material-dialog, linq-grid-filters, search-address, range-slider), CVA trio, dialogs, plus library directives/pipes worth demonstrating alongside.
- Mock data today is deterministic (no random) — keep that.

### Plan (phases)

1. **Phase 0 — sandbox skeleton:** convert `/sandbox` from one page to an index page (card per control linking to its demo) + a demo route per control family (`sandbox/:family`, lazy `loadComponent`). Keep the existing page/section structure per family; mock data stays in per-family `sandbox-*-data.service.ts` files.
2. **Phase 1 — signal-API controls (highest value: verifies the recent migrations):** button-v2 + button-toggle + fab-button, input family (text/email/number/phone/currency/select), key-value trio, chips + chip-status, card/card-header/housing-card, loader/currency/slide-toggle/numeric-up-down/count-down, carousel + gallery + gallery-preview, tab-group + tabs + tab, checkbox/range-checkbox groups, range-date-picker, table-dialogue (dialog opened from a demo), media-dialog/confirmation-dialog, drag-drop-file-upload. Every demo covers: default state, all inputs varied, every output wired to a visible log, visual states (loading/disabled/error/empty).
3. **Phase 2 — heavy decorator-API controls:** table, card-table, info-card, list-card, gallery (incl. zoom), dynamic-window, dynamic-material-dialog (button/menu/form-type coverage), linq-grid-filters, search-address, range-slider, accordion (already done), expandable-grid (already done), time-span-picker. Their APIs are config-object heavy — demos double as living usage documentation for forked apps.
4. **Phase 3 — directives/pipes:** demo `copy-text`, `zoom`, `min-max*`, `numeric-input`, `currency-mask`, `drag-and-drop-files`, `highlight-search-match`, `safe`, `api-response` inside relevant control demos (no standalone pages unless needed). Plus a **Signal Forms reference demo** (per the adopted policy above) — the codebase's modern-forms pattern for forked apps.

### Rules

- One family per batch; verify each demo against the control's real API (no invented inputs).
- Deterministic mock data only; in-memory state only (existing pattern).
- The sandbox stays dev-only; no prod bundle impact (routes already gated, lazy chunks).
- Demos use the signals API themselves (`input()`, `computed()`) — the sandbox is the codebase's modern-pattern reference.

### Result (done 2026-11-17)

- `/sandbox` is an index of 13 family cards; `segments/sandbox/sandbox.routes.ts` (loaded via `loadChildren`, still gated by `environment.isLocal`) lazy-loads one page per family: buttons, inputs, data-display, cards, small-controls, media, tabs, selection, dialogs, upload, tables, misc, forms.
- Shared kit: `sandbox-page` (shell + back link), `sandbox-demo` (demo block with visible output log), `models/sandbox-event-log.ts`; per-family mock data in `services/sandbox-*-data.service.ts` (`@Service()` for new ones).
- Phases 1–3 were executed as 7 parallel agent batches grouped by page rather than by API style; directives/pipes folded into the relevant pages; Signal Forms reference demo at `/sandbox/forms` (`form()`, `[formField]`, `[formRoot]`, schema validators + a conditional cross-field rule).
- Deliberately not demoed: dynamic dialog Slider/Upload/Address field types (broken or need Google Maps), CheckBoxRange/SingleDateString/Numeric, list-card `countDown` buttons and table `timeAgo`/`dateInPast` (non-deterministic), table `expandable`/`template`, standalone `cursorFollowZoom`, `GridStorageService`; search-address only renders when the Google Maps global exists.
- Verify: production + development `ng build` pass (pre-existing budget warning only; no sandbox chunks in prod); eslint + prettier clean on the sandbox. Not yet walked through in a browser. Control bugs found are listed in the ROADMAP.md audit.

## Signal Forms applicability survey (surveyed 2026-11-16; policy adopted 2026-11-17; reference demo done 2026-11-17)

Status of the API: Signal Forms (`form()` from `@angular/forms/signals`, `[formField]` template binding, schema-based validation) are **stable as of Angular 22** — the version this template runs on. Reactive Forms are NOT deprecated and remain a supported choice for existing apps; `compatForm` enables field-by-field interop if a partial migration is ever wanted.

### Survey — where forms live today (13 files with ReactiveFormsModule, 12 templates with `formControl`/`ngModel`)

- **Input family** (`input-text/email/number/phone/currency/select`): thin reactive wrappers around a single `FormControl` — highest conversion applicability, but the CVA pair already proven fragile under OnPush (see audit) suggests verifying writeValue rendering before any conversion.
- **CVA trio** (`checkbox-group`, `range-checkbox-group`, `time-span-picker`): implement `ControlValueAccessor` + internal FormGroup/FormControl. Signal Forms custom controls use `FormValueControl`/`FormCheckboxControl` interfaces instead — a full rewrite of the control wiring, not a mechanical swap.
- **Mid-size reactive users** (`button-toggle`, `range-date-picker`, `linq-grid-filters`, `dynamic-window`, `expandable-grid-form`): FormGroup/FormBuilder patterns, moderate applicability.
- **`dynamic-material-dialog`: do not convert.** It builds a `FormGroup` entirely at runtime from config (`addControl` per `FormType` with dynamic validators via the `ValidatorType` enum) — Signal Forms dynamic schemas exist in v22 but this is the repo's riskiest control (also flagged "do not migrate" for signals). Revisit only if a forked app needs it.
- **Custom validators** (`at-least-n-valid`, `email`, `identity-number`, `number-comparison`): written as reactive-forms `ValidatorFn`s. Signal Forms validation is schema/rule-based (`required()`, `email()`, custom rules with `{ message }`) — these would need parallel rule implementations, doubling validator maintenance while both systems coexist.

### Concrete next step

Done 2026-11-17: Signal Forms reference demo at `/sandbox/forms` (`sandbox-forms.component.ts`). Policy stays in ROADMAP.md Standing policy.

# Roadmap

Items parked for future investigation; not part of the current migration scope.

## Signals migration

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

### Rules (apply to every phase)

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

**Phase 2 — input family + simple mid-size controls:** `input` + `input-text`, `input-email`, `input-number`, `input-phone`, `input-currency`, `input-select` (these carry subscription setup in `ngOnInit` — convert inputs to `input()` but leave the subscription wiring alone); `button-v2`, `button-toggle`, `drag-drop-file-upload`, `tabs` + `tab-back-button.directive` + `tab-next-button.directive`. (CVA trio moved to "Do not migrate".)

**Phase 3 — ngOnChanges redesigns only:** these four contain hand-rolled state-sync logic that `computed()`/`linkedSignal()` genuinely deletes: `carousel`, `gallery-preview`, `tab-group`, `count-down` (setter → `linkedSignal`). Opportunistic, only when a file is already being touched for another reason: `accordion` (+ `accordion-item.directive`), `zoom-image`, `zoomable-image` (`@ViewChild` → `viewChild()` swaps).

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

### Risk rules (for the phases that remain)

1. **Getter call-syntax breakage** (silent in some cases): every `computed()` conversion must be paired with template updates `foo` → `foo()`.
2. **`input.required()` on loosely-bound controls**: only mark required when every usage binds the input; the sandbox alone is not proof — grep segment templates too.
3. **`ngOnChanges` with multi-input interplay**: can become order-dependent `computed()` chains; verify each control's sandbox demo against the pre-migration behavior (screenshots/side-by-side).
4. **CVA ordering**: `input()` changes when values arrive relative to `writeValue`; test form interactions, not just initial render.
5. **`@ViewChild` on conditionally-rendered refs** (`@if` blocks): `viewChild()` returns a signal that updates when the ref appears — verify the old `undefined`-handling logic still holds.

## Follow-up projects (priority: after the signals migration, before the navigation service)

Priority order: current signals migration first, then these, then the navigation service (TBD).

### Project CSS cleanup

- Sweep the entire project's CSS: remove dead/unused styles, deduplicate repeated rules across controls, normalize spacing/naming conventions.
- Work control-by-control with a sandbox visual check per batch (same cadence as the signals migration).

#### Survey (2026-11-14)

- 61 `.scss`/`.css` files, ~50 KB total, all component-scoped; global `styles.scss` is tiny (~40 lines, snackbar theming only).
- **Zero shared SCSS foundation** — no `_variables`, no mixins, no utility partials anywhere.
- Hardcoded color duplication (top counts): white `#fff`/`#ffffff` ×58, brand orange `#f47920` ×25 with five near-variants in use (`c5580a`, `f79147`, `e6670b`, `e25e00`, `ed6c02`), dark navy `#1b2935` ×19 plus variants (`18242e`, `2d4559`, `444c53`), assorted grays with near-duplicates (`dcdcdc`/`dedede`/`f2f2f2`).
- Identical rules copy-pasted across components (e.g. `.show-pointer` in all three key-value variants); minor inconsistency: `#fff` vs `#ffffff` for the same white.
- Material prebuilt theme `indigo-pink.css`; components override with hardcoded hex values.

#### Plan (phases)

1. **Phase 0 — token foundation:** create `src/app/library/styles/_tokens.scss` (brand palette incl. orange + its intentional variants, navy scale, grays, status colors matching the snackbar theming) and `_utilities.scss` (shared rules like `.show-pointer`); make it importable via angular.json `stylePreprocessorOptions.includePaths`. No dependencies added — plain SCSS.
2. **Phase 1 — token replacement (done 2026-11-14):** replace hex literals with tokens, highest-traffic colors first (white → orange → navy → grays). Batch by control family, `ng build` + sandbox visual check per batch; decicions on near-variants (keep as named tokens vs unify) get recorded when first hit. Result: batches ran by color group instead of control family (white/black, orange incl. `rgba` for `#e25e0098`, navy/charcoal/slate/blue-gray, grays, semantic greens/reds/blues); 30 component scss files + `styles.scss` verified to `@use "tokens" as *;` and build + prettier verified per batch. Remaining literal hex in component scss = documented per-file singletons only (`_tokens.scss` comments list them). Deferred: hex inside HTML inline styles (chips, dynamic-material-dialog, drag-drop-file-upload, table check/close icons) and the tab-group TS default `--tab-label-hover-color` — those can't reference SCSS tokens until the styles move into scss/ts with real tokens.
3. **Phase 2 — dedupe copy-pasted rules (done 2026-11-14):** identical rules move into `_utilities.scss`/mixins and are `@include`d (keeps component encapsulation; avoids global-class collision risk). Only dedupe when rules are truly identical. Result: 4 mixins added (`cursor-pointer`, `orange-svg-filter`, `input-button-icon`, `input-button-wrapper`), 9 usages replaced across 6 files (key-value trio `.show-pointer`, gallery/gallery-preview orange SVG filter + hover, input family `.button-icon`/`.button-wrapper`). **Deferred — needs developer decision:** the two near-clone families (info-card ↔ list-card with ~15 identical rule pairs; drag-drop-file-upload ↔ dynamic-material-dialog with ~5 identical pairs) share copy-pasted styles; the clean fix is a shared partial `@use`d by both or a component merge — not a pile of global mixins. Also skipped: option ↔ orphan `select/select/` identical `.checkbox` blocks (orphan dies in Phase 3); standalone single `cursor: pointer` declarations left as-is (mixin adds no value).
4. **Phase 3 — dead-style removal (done 2026-11-14):** per file, grep each selector against the component template before deleting; start with the largest files (list-card, info-card, gallery). Also delete the orphan `select/select/` scss/html/ts leftovers. Result: orphan `select/select/` folder deleted (empty .ts, zero consumers); survey script (class-selector extraction vs whole-src ts/html grep) found 43 candidates — after manual verification all but 10 were false positives kept: dynamic `[class]="color()"` inputs (card, card-header, button-v1), animation state strings (accordion), `'vehicle-imgs-' + preview()` dynamic classes (carousel), ZoomDirective `renderer.addClass` (`galleryZoomBoxVisible`), comment text (`_tokens.scss`/`_utilities.scss`). Deleted: card-table Material expansion-table demo leftovers (`tr.detail-row`, `.element-row td`, `.element-detail`), dynamic-window unused utilities (`.rotateButton`, `.k-textarea`, `.k-form-hint`, `.j-c-end`, `.j-c-space-between`, `.a-i-center` — component has ng-content but no `::ng-deep`, so emulated encapsulation can never match them), gallery-preview's dead duplicate `.galleryPreviewContainer` (the live styling lives in gallery's own scss), and 8 zero-byte scss files with their `styleUrls` entries (app, input-email, input-phone, input-select, search-address, slide-toggle, contact, landing). Pre-existing eslint `no-inferrable-types` debt in search-address.component.ts fixed while touched. Build + eslint + prettier verified.
5. **Phase 4 — naming normalization (optional, lowest priority):** only inside files already touched; keep selectors stable otherwise.

#### Risks

- View encapsulation: shared utilities must not rely on `::ng-deep`; `:host` contexts differ per component.
- Token values must match the old hex exactly (case/variant) — verify visually per batch, not just by build.
- Global utility classes could collide with Angular Material internals — prefer component-level `@use` + `@include` over global classes.
- Material prebuilt theme overrides: snackbar colors live in `styles.scss`; keep them as status-color tokens, not touched per component.

### Button family merge investigation (surveyed 2026-11-15)

#### Inventory (6 controls in `src/app/controls/components/button/`)

- **`button-v1`** — legacy custom-styled button (not Material): 15 string-typed style inputs (`color`, `fontSize`, `padding`, …), `askToConfirm` double-click confirm with progress bar, contextmenu `mat-menu` of items. **Zero consumers** anywhere in src.
- **`button-v2`** — the real engine: takes `CustButtonInput` (incl. `CustButtonType`: Primary/Secondary/Tertiary/Text/Disabled/Icon), renders Material buttons with `color-set-*` classes, icon/tooltip/loading/isTableButton handling. **1 consumer file** (info-card ×2).
- **`button-primary` / `button-secondary` / `button-tertiary`** — three **byte-identical 26-line wrappers** around button-v2 that overwrite `type` with their own variant. Consumers: dynamic-window (4+4), list-card (2+2+2), info-card (6 primary), table (2 primary + 2 secondary + 6 tertiary), table-dialogue (2 tertiary).
- **`button-text`** — identical 4th wrapper forcing `type: text`. **Zero consumers.** Bug: its selector is `app-button-primary` (duplicate of button-primary — latent collision if both are imported).

#### Findings

1. The wrapper layer is pure sugar that creates friction: consumers must build a full `CustButtonInput` including a **throwaway `type: ""`** that the wrapper discards (table/info-card `tableButton()` helpers do exactly this).
2. button-v2 already covers every variant via `CustButtonType` — a single tag `<app-button-v2>` with the correct `type` in the input object replaces all four wrappers. The table/list-card config strings already use the enum spellings (`"Primary"`/`"Secondary"`/`"Tertiary"`).
3. `button-v1` is a different design language and dead code; it is not part of the v2-family merge.
4. Inputs render their own inline Material action button (via `_utilities.scss` mixins) — separate concern, unaffected by this merge.
5. Sandbox currently demos no buttons; per roadmap order, sandbox flesh-out lands after this merge.

#### Merge options (developer decision)

- **Option A — delete the wrapper layer (recommended):** remove `button-primary/secondary/tertiary/text`; update ~20 tags across 5 consumer files to `<app-button-v2 [type]="...">` with the real `CustButtonType` set in the object they already build. CustButtonType becomes mandatory in `CustButtonInput` usages. End state: one engine (v2) + optional rename (`app-button`).
- **Option B — keep the wrapper API, prune dead code:** delete only `button-text` (dead + broken selector) and decide on `button-v1` (delete or keep as the custom-style alternate). Wrappers stay as-is; zero template churn.
- **Either option:** decide `button-v1` — zero consumers; delete or park.

#### Result (done 2026-11-15, developer-approved Option A + delete button-v1)

- Deleted all five dead/derivative controls: `button-v1`, `button-primary`, `button-secondary`, `button-tertiary`, `button-text`. End state: `button-v2` + `fab-button` (one engine, no wrapper layer).
- Consumers switched to `<app-button-v2>` with the real variant in the object they already build: dynamic-window (`buttonInput` gained a `type = "Primary"` param; the two secondary call sites pass `"Secondary"`), info-card (`tableButton` hardcodes `"Primary"`; the inline object literal sets `type: 'Primary'`), list-card (`tableButton` gained `type = "Tertiary"`; the Primary/Secondary `@if` branches pass their variant), table (`tableButton` gained a 5th `type = "Primary"` param; tertiary/favourite/secondary call sites pass their variant), table-dialogue (`tableButton` hardcodes `"Tertiary"`).
- Behavior-preserving: the old wrappers only overwrote `type`; no consumer reads the emitted payload's `action`/`event` fields (verified by grep), so the payload-shape difference (CustChipReturn vs CustInputReturn) is inert.
- Verify: `ng build` passes (only pre-existing bundle-budget warning); prettier clean; no new lint errors introduced (remaining eslint output = pre-existing debt in the do-not-migrate heavy controls: `no-inferrable-types` on old `@Input`s/params, `no-explicit-any`, a11y `mouseover`/click handlers, `eqeqeq` — tracked as candidate future cleanup, not part of this merge).
- Optional follow-up (not done): rename `button-v2` → `button`/`app-button` if the version suffix should go.

### Fab-button merge investigation (surveyed 2026-11-15)

**Current state:** `fab-button` is a fixed-position floating help widget — hardcoded `help` icon, no inputs at all, one `emitClick` output, 60px orange circle pinned bottom-right with custom styles. **Zero consumers** anywhere in src.

**Verdict: it cannot meaningfully merge into button-v2.** The two are different control models: button-v2 is an inline-flow Material button driven by `CustButtonInput` (display/icon/tooltip/disabled/loading/table sizing); the fab is a page-level floating widget with fixed positioning, opposite styling (circular, fixed, opacity-hover) and no state. A merge would mean bolting `isFab`-style branches and fab-specific fields onto `CustButtonInput` — machinery for zero reuse, against KISS.

Options (developer decision — resolved 2026-11-15: **keep + parameterize**, do not delete):

- Parameterize: `icon = input("help")`, `aria-label`/tooltip input for a11y (the clickable `<div>` currently fails a11y rules — not keyboard focusable, no role). Reasonable to keep since this is a fork template and a help-fab is a plausible widget.

#### Risks

- `CustButtonType` values are case-sensitive strings (`"Primary"`, `"icon"`); every rewritten tag must use the exact spelling.
- The wrappers strip down nothing — the only behavioral surface is the forced `type`; renaming to v2 directly is behavior-preserving.
- `disabled` variant (`CustButtonType.disabled`) is reachable only through v2 today and stays so.

### Sandbox flesh-out (planned 2026-11-15 — not started)

Extend the sandbox (`/sandbox`, dev only) so every control in `src/app/controls` has a demo entry covering its inputs, outputs and visual states. Today only accordion + expandable-grid have demos; the sandbox is a single page (`segments/sandbox/components/sandbox/`) with mock-data services (`sandbox-accordion-data.service.ts`, `sandbox-expandable-grid-data.service.ts`) and is already dev-gated (`environment.isLocal` in `app.routes.ts`).

#### Survey (2026-11-15)

- 41 control folders under `src/app/controls/components` (~45 components incl. subs/directives): signal-API controls (~25 migrated ones), decorator-API heavy controls (table, card-table, info-card, list-card, gallery, dynamic-window, dynamic-material-dialog, linq-grid-filters, search-address, range-slider), CVA trio, dialogs, plus library directives/pipes worth demonstrating alongside.
- Mock data today is deterministic (no random) — keep that.

#### Plan (phases)

1. **Phase 0 — sandbox skeleton:** convert `/sandbox` from one page to an index page (card per control linking to its demo) + a demo route per control family (`sandbox/:family`, lazy `loadComponent`). Keep the existing page/section structure per family; mock data stays in per-family `sandbox-*-data.service.ts` files.
2. **Phase 1 — signal-API controls (highest value: verifies the recent migrations):** button-v2 + button-toggle + fab-button, input family (text/email/number/phone/currency/select), key-value trio, chips + chip-status, card/card-header/housing-card, loader/currency/slide-toggle/numeric-up-down/count-down, carousel + gallery + gallery-preview, tab-group + tabs + tab, checkbox/range-checkbox groups, range-date-picker, table-dialogue (dialog opened from a demo), media-dialog/confirmation-dialog, drag-drop-file-upload. Every demo covers: default state, all inputs varied, every output wired to a visible log, visual states (loading/disabled/error/empty).
3. **Phase 2 — heavy decorator-API controls:** table, card-table, info-card, list-card, gallery (incl. zoom), dynamic-window, dynamic-material-dialog (button/menu/form-type coverage), linq-grid-filters, search-address, range-slider, accordion (already done), expandable-grid (already done), time-span-picker. Their APIs are config-object heavy — demos double as living usage documentation for forked apps.
4. **Phase 3 — directives/pipes:** demo `copy-text`, `zoom`, `min-max*`, `numeric-input`, `currency-mask`, `drag-and-drop-files`, `highlight-search-match`, `safe`, `api-response` inside relevant control demos (no standalone pages unless needed).

#### Rules

- One family per batch; verify each demo against the control's real API (no invented inputs).
- Deterministic mock data only; in-memory state only (existing pattern).
- The sandbox stays dev-only; no prod bundle impact (routes already gated, lazy chunks).
- Demos use the signals API themselves (`input()`, `computed()`) — the sandbox is the codebase's modern-pattern reference.

### Angular best-practices audit (surveyed 2026-11-15 — notes only, no code changes yet)

Project-wide critique of patterns that deviate from Angular best practices (Angular 22, standalone, signals in progress). Grouped by severity; each item is a candidate for a future approved task.

#### High — dead infrastructure / broken wiring

**Decision (2026-11-15, developer): all of these are KEEP — do not delete.** They are intended functionality for forked apps and simply have no consumers yet because the sandbox doesn't exercise them. When the sandbox or a forked app starts using them, the wiring items below must be fixed.

- **`request.interceptor.ts` is unwired:** no `provideHttpClient`/`withInterceptors` anywhere in src, and no `HttpClient` usage at all — the auth-token interceptor is never registered and can never run. When a forked app first needs HTTP, `provideHttpClient(withInterceptors([authTokenInterceptor]))` must be added to the bootstrap providers.
- **Services without consumers (kept for future forks):** `app-shell.service`, `error-handling.service` (also never registered as an app `ErrorHandler` — wire via `provideErrorHandler` when used), `open-page.service`, `search-retain.service`, `b64-to-blob.service`.
- **`custom-preloading-strategy.service.ts` unused:** routes never set `preloadingStrategy`; wire into `provideRouter` when lazy loading needs it.
- **Bootstrap providers live inline in `main.ts`** (`provideZoneChangeDetection` + `provideRouter` only) — should move to an `app.config.ts` with `provideHttpClient` etc. when HTTP wiring lands. The only `console.error` outside the logger is main.ts's bootstrap catch.

#### Medium — consistency / modernization

- **34 components without `ChangeDetectionStrategy.OnPush`** — **done 2026-11-15 (OnPush sweep):** every component in src now sets `changeDetection: ChangeDetectionStrategy.OnPush`; build + prettier verified. Caveats for sandbox verification: the CVA pair (`checkbox-group`, `range-checkbox-group`) — programmatic `writeValue`/`form.patchValue` updates may not re-render until the next event under OnPush (form interactions need testing, same risk family as the CVA input() rule); heavy mutation-driven controls (`table`, `card-table`, `gallery`, `dynamic-material-dialog`) rely on template-event-driven CD — visually verify sort/filter/pagination once the sandbox demos land.
- **Mixed service decorators:** 10 services use the newer `@Service()`, 4 still use `@Injectable({ providedIn: "root" })` (dynamic-dialog, grid-storage, both sandbox data services). Unify on one.
- **Legacy `*ngIf`/`*ngFor`/`*ngSwitch`** remain only in `dynamic-material-dialog` (the largest template in the repo, ~370 lines) — convert to `@if/@for/@switch`; high-value since it is a do-not-migrate control otherwise frozen on old syntax.
- **`@HostListener`/`@HostBinding` ×~20** (library directives, tabs directives, zoomable-image) — Angular 20+ prefers the `host: {}` metadata object; mechanical, low-risk, also required before those decorators can be dropped with `experimentalDecorators`.
- **`constructor()` blocks that only run `inject()` calls** (carousel, gallery-preview, count-down, tab-group, zoomable-image, dynamic-material-dialog, copy-text/currency-input directives): convert to field initializers per project standards. Also `cust-table-dialogue` uses constructor `@Inject(MAT_DIALOG_DATA)` → `inject(MAT_DIALOG_DATA)`.
- **Redundant `standalone: true` ×63** — default since Angular 19; cosmetic cleanup.
- **Untyped `any`:** `dynamic-material-dialog-setup.model.ts` has 23 × `value?: any` (type as a union per form-type); `api-response.pipe` uses `any` params; `info-card`/`list-card` data inputs are `Record<string, any>`.
- **Unused public field:** `app.component.ts` `title` (not referenced in the template).
- **Empty lifecycle hook:** `table.component` `ngOnDestroy` is empty (lint flags it).

#### Low — security & perf notes (verify, don't assume wrong)

- **Three `bypassSecurityTrust*` uses:** `safe.pipe` (resource URL for external images — legitimate), `highlight-search-match.pipe` (`bypassSecurityTrustHtml` on data-driven highlights — confirm the source data can't be user-supplied), `zoomable-image` (`bypassSecurityTrustStyle("url(...)")` built from an image path — confirm path provenance).
- **Teardown-less subscriptions in `dynamic-material-dialog`:** a form-control `valueChanges` and `dialogRef.backdropClick()` have no `takeUntilDestroyed`/`first()` — dialog-scoped so leak impact is small, but inconsistent with the project standard.
- **Getters called in templates** (button-v2's `displayLength`/`buttonClass`/sizing getters) — re-evaluated every CD cycle; fine under OnPush, worth converting to `computed()` when the file is next touched.
- **`tsconfig`:** `experimentalDecorators: true` + `useDefineForClassFields: false` are needed while decorator-API controls remain; both become removable if the do-not-migrate controls are ever converted.
- **`::ng-deep` ×2 in `range-slider`** for Material internals — acceptable last resort; noted so it doesn't spread.

### Signal Forms applicability survey (surveyed 2026-11-16 — notes only, no code changes)

Status of the API: Signal Forms (`form()` from `@angular/forms/signals`, `[formField]` template binding, schema-based validation) are **stable as of Angular 22** — the version this template runs on. Reactive Forms are NOT deprecated and remain a supported choice for existing apps; `compatForm` enables field-by-field interop if a partial migration is ever wanted.

#### Survey — where forms live today (13 files with ReactiveFormsModule, 12 templates with `formControl`/`ngModel`)

- **Input family** (`input-text/email/number/phone/currency/select`): thin reactive wrappers around a single `FormControl` — highest conversion applicability, but the CVA pair already proven fragile under OnPush (see audit) suggests verifying writeValue rendering before any conversion.
- **CVA trio** (`checkbox-group`, `range-checkbox-group`, `time-span-picker`): implement `ControlValueAccessor` + internal FormGroup/FormControl. Signal Forms custom controls use `FormValueControl`/`FormCheckboxControl` interfaces instead — a full rewrite of the control wiring, not a mechanical swap.
- **Mid-size reactive users** (`button-toggle`, `range-date-picker`, `linq-grid-filters`, `dynamic-window`, `expandable-grid-form`): FormGroup/FormBuilder patterns, moderate applicability.
- **`dynamic-material-dialog`: do not convert.** It builds a `FormGroup` entirely at runtime from config (`addControl` per `FormType` with dynamic validators via the `ValidatorType` enum) — Signal Forms dynamic schemas exist in v22 but this is the repo's riskiest control (also flagged "do not migrate" for signals and frozen on legacy template syntax). Revisit only if a forked app needs it.
- **Custom validators** (`at-least-n-valid`, `email`, `identity-number`, `number-comparison`): written as reactive-forms `ValidatorFn`s. Signal Forms validation is schema/rule-based (`required()`, `email()`, custom rules with `{ message }`) — these would need parallel rule implementations, doubling validator maintenance while both systems coexist.

#### Recommendation

No bulk migration. Reactive forms remain stable and the template's purpose is a fork base — mixing is officially supported. Suggested policy: use Signal Forms for new form work (sandbox demos, future fork features), convert existing controls only opportunistically when a file is already touched for other reasons, and keep `dynamic-material-dialog` + the CVA trio on reactive forms.

## Navigation service (TBD)

Status: TBD — no real need for it right now; revisit only when a forked app actually needs claim/country-filtered menus. Lower priority than the follow-up projects below. (Legacy source `src/app/controls-to-port/services/navigation.service.ts` was deleted without migration on 2026-11-13; the mechanics below were recorded before deletion.)

- **Original:** builds claim- and country-filtered menus (`navSetup`, `canDisplay`, distinct-claims aggregation) from a large app-specific menu tree, gated by `LoginService` claims.
- **Why parked:** the template's existing navigation base covers current needs, and the legacy menu data is app-specific (old-company).
- **Future investigation points:**
  - A generic `Navigation` model (name, path, icon, claims, allowed countries, children).
  - Tree aggregation of child claims/countries onto parents.
  - Claim filtering integration with `LoginService.userHasRequiredClaims`.
  - How menu data should be supplied per forked app (config file vs route data).

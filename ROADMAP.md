# Roadmap

Live roadmap: open and planned work only. Completed projects are moved to `ROADMAP_HISTORY.md`.

**Maintenance rule:** after a task is confirmed complete, move its section/checklist from this file (and `RATE_LIMIT_TRACKER.md`) into the matching `*_HISTORY.md` file so the live docs stay lean. Do this as part of the task's clean boundary, not later.

## Standing policy (carried from completed projects — details in ROADMAP_HISTORY.md)

- **Signals API** is the default for all new/future controls; a "do not migrate" list of heavy decorator-API controls applies (table, card-table, linq-grid-filters, expandable-grid, dynamic-material-dialog, dynamic-window, info-card, list-card, gallery, search-address + the CVA trio inputs + library directives) — touch those only when a bug or feature forces a change, keeping the file's existing style.
- **SCSS tokens** (`src/app/library/styles/_tokens.scss`) + **utilities/mixins** (`_utilities.scss`) exist and are wired via `stylePreprocessorOptions.includePaths`; new styles must use tokens instead of literal hex (documented per-file singletons excepted). Dedupe only truly-identical rules.
- **Button end state**: `button-v2` + `fab-button` only; build new buttons on `CustButtonType` via `app-button-v2`.
- **Signal Forms policy (adopted 2026-11-17, from the survey below):** no bulk migration of the 13 reactive-forms files; new form work (sandbox demos, future fork features) uses Signal Forms (`@angular/forms/signals`); opportunistic conversion only when a file is already touched for other reasons; `dynamic-material-dialog` + the CVA trio stay reactive.

## Open items

### Best-practices audit (live findings — last full audit 2026-11-17)

Project-wide critique of patterns that deviate from Angular best practices (Angular 22, standalone, signals). Grouped by severity; each item is a candidate for a future approved task. Verified-clean items are not listed (100% OnPush, zero `@typescript-eslint` errors under strictTypeChecked, zero `any`, zero legacy control flow, zero console violations, full `@for` track coverage — see RATE_LIMIT_TRACKER_HISTORY.md, 2026-11-17 entry).

#### High

- **Library→controls dependency inversion** (alias masks it): `library/models/cust-page.ts:1` and `library/services/grid-storage.service.ts:2` import `_LinQGridFilterItem`/`_LinQGridFilterCondition` from `@shared/components/linq-grid-filters/...` — library importing up into controls. Fix: move that model to `library/models` and update consumers + `SERVICES_CONTRACTS.md`.
- **Dormant integration scaffolding (developer decision 2026-11-15: KEEP, wire when first used):** `request.interceptor.ts` never registered (no `provideHttpClient`/`withInterceptors` anywhere; zero `HttpClient` usage); `ErrorHandlingService` implements `ErrorHandler` but never provided; `CustomPreloadingStrategyService` never wired into `provideRouter`; providers inline in `main.ts` — create `app.config.ts` when HTTP wiring lands.
- **47 live `@angular-eslint` errors** (2026-11-17 lint run; `@typescript-eslint` at zero): template a11y ×27 (click-events-have-key-events ×7, interactive-supports-focus ×7, mouse-events-have-key-events ×10, alt-text ×3 — info-card:481, list-card:209, media-dialog:10; files: zoomable-image, zoom-image, media-dialog, option, info-card, chips/table mouseover rows), template `eqeqeq` ×7, `directive-selector` ×9 (`cust*` selectors in library directives vs the `app` prefix rule), `prefer-inject` (cust-table-dialogue:29 `@Inject(MAT_DIALOG_DATA)`), `no-empty-lifecycle-method` (table:192). Fix pattern already established (role/tabindex/keydown.enter — see gallery/chips/tabs/dialog).

#### Control bugs surfaced by sandbox demos (2026-11-17, from code reading by the demo batches — not yet confirmed in a browser)

Demos work around these; no control was changed. Candidate fixes, grouped by control:

- **High / likely runtime errors:** `zoomable-image.component.ts:106` passes a plain string to `sanitize(SecurityContext.RESOURCE_URL)` (throws when the lens shows); `list-card.component.html:73` crashes when no `tableButtonConfig`/`parentButtonProcess` is given; dynamic-material-dialog + dynamic-window: `formControlName` on `<mat-slider>` (no value accessor) and `matInput` on `type="file"` (Slider/Upload field types unusable).
- **dynamic-material-dialog:** builder classes (`DialogInput`, `DropDown`, …) declare `formName?` but `_DialogControl.formName` is required — the control's own builders don't type-check against its setup (sandbox uses a `namedControls()` helper); title/close hidden unless `options` passed (`options ?? {}` makes `@if (!options)` dead); `ValidatorType.noSpace`/`phone` swapped and `[^s]+` missing its backslash (same in dynamic-window); setup objects mutated so reopening a setup gives `Validators.pattern(0)`; hard-coded "payroll"/"sales executive" snackbars; CheckBox/Radio/CheckBoxRange share one `data`/`filteredData`; every Input hijacks autocomplete + OnPush stale suggestion list + spinner ordering; `Numeric` sets `type: Input` (MinMax branch dead); `ngModel` mixed with `formControlName`; `DynamicDialogService.clear()` kills the app-wide subjects.
- **CVA / OnPush (confirms the audit caveat below):** `checkbox-group.component.ts:36` + `range-checkbox-group.component.ts:37` `writeValue` never marks for check — programmatic set doesn't re-render ticks, and single mode likely leaves the previous tick showing; time-span-picker likely fine.
- **Inputs/selection:** range-slider ignores `minValue`/`maxValue` (initialised at construction); range-date-picker initial range not shown + no `startAt`; `option.component.html:2` shared `name="test"` + label double-emit; input-select binds `[disabled]` with `[formControl]`; app-input fixed `for="search"`, unused `type`; currencyInput/appCurrencyMask display-only; MinMaxDecimal uses `parseInt`; input-text/number/currency `setValidators` overwrite caller validators.
- **Tabs/buttons/small controls:** tab-group `<ng-content [select]>` binding is ignored + content follows `activeTab` input only + `matTabGroupConfig` CSS vars unused; tab back/next directives blank the wizard at the ends (`tab-back-button.directive.ts:14-18`, `tab-next-button.directive.ts:26-31`), `resetTabs()` keeps `completed`; `tabs.component.html:20` duplicate `class`; count-down won't restart on same value + uses `setInterval` (AGENTS.md rule); slide-toggle `!!value` treats `"false"` as on, `isReadOnly` unused; fab-button `position: fixed`.
- **Media/upload:** gallery `#fullScreen` querySelector (first gallery only), autoplay without markForCheck, missing `assets/images/image_not_found.png`, global arrow/space listeners (also zoomable-image); `cursorFollowZoom` uses document-wide `selectRootElement`; drag-drop-file-upload duplicate `id="fileDropRef"`, `filesToAccept` not applied to drops; carousel wrap doesn't emit `openDetails`; media-dialog null loader → broken img, `<span (click)>` close.
- **Cards/tables/data display:** info-card drops `false` booleans (`info-card.component.ts:226`), `heightAuto` mutates input, `getElementById` menus; info-card + list-card + table + linq-grid-filters map inputs once (later changes ignored); list-card loading matched by label text, header without `type` renders nothing; table writes/reads localStorage (`lastScrollPosition`, sort) + hard-coded `desc` arrow; card-table `upperToggleChange` emits `data: null`; `_CUSTPage` reads sessionStorage in its constructor; chips mutates input objects + inline hex; key-value/info-card clickable `mat-icon`/`div`/`a` (a11y, overlaps the 47-error lint item).
- **Library:** `highlight-search-match.pipe.ts:25` builds `new RegExp` from raw input (throws on `(`; add escaping alongside the XSS item); `orderBy`/`sort` pipes sort in place; `thousandSeparator` blanks `0`; `copyText` classes have no styles; `safe` pipe (resource-URL only) used on `<img [src]>` in `dynamic-window.component.html:28`; search-address has no guard for a missing `google` global and hard-codes `za`.

#### Medium

- **XSS surface in `highlight-search-match.pipe`** (`bypassSecurityTrustHtml`): injected `<mark>` markup is fixed but surrounding text is inserted unescaped — injection vector if highlighted data is ever user-supplied. (`safe.pipe` is a documented trusted-content-only escape hatch; `zoomable-image` pre-sanitizes properly.)
- **Two dev-gating flags disagree:** `environment.isLocal` gates sandbox routes, but `environmentName !== "production"` gates nav `showSandbox`, logger, error-handling — a non-prod/non-local build behaves inconsistently. Unify on one flag.
- **No `DIRECTIVES_CONTRACTS.md`** for the 12 `library/directives` files — breaks the contracts rule in INSTRUCTIONS.md (pipes/services/validators contracts are complete).
- **Mixed service decorators:** 10 services use `@Service()`, 4 use `@Injectable({ providedIn: "root" })` (dynamic-dialog, grid-storage, both sandbox data services). Unify on one — new sandbox services should use `@Service()`.
- **`@HostListener` ×22 + `@HostBinding` ×1** (library directives, tabs directives, zoomable-image) — Angular 20+ prefers the `host: {}` metadata object; mechanical, low-risk, also required before `experimentalDecorators` can be dropped.

#### Low / cosmetic

- 63 redundant `standalone: true` (default since Angular 19); tsconfig still excludes the deleted `src/app/controls-to-port` path; `@animations/*` alias configured but unused.
- No `environments` path alias — 3–4 level relative imports to `src/environments` (navigation.component.ts:12 worst; only 5 relative imports total in src).
- 92 HTML inline styles in 18 files (deferred from CSS cleanup; hardest: table.component.html:31 dynamic CSS var); dead Kendo CSS selectors in card-table.component.scss:79-83; tab-group TS default `--tab-label-hover-color`.
- Two `model()`-candidate two-way pairs (time-span-picker `value`, range-date-picker `selectedRangeValue`) — convert only if those files are touched for another reason.
- Perf notes: 3 duplicate `filteredData | async` subscriptions in dialog `@for` branches; `keyvalue` pipes inside `@for` (expandable-grid-form); template getters (button-v2 ×5, gallery ×4, dialog `formType` ×24 — fine under OnPush, convert when touched); 2 unteardown'd dialog-scoped subscriptions (dynamic-material-dialog:190, backdropClick:582).
- JWT token stored in localStorage (documented trade-off, SERVICES_CONTRACTS.md); direct DOM access vs Renderer2 inconsistency (Renderer2 in only copy-text/zoom directives) — consistency decision, not a violation.
- `tsconfig`: `experimentalDecorators: true` + `useDefineForClassFields: false` needed while decorator-API controls remain; `::ng-deep` ×2 in range-slider (acceptable last resort; don't spread).
- Unused public field: app.component.ts `title`; CVA pair OnPush caveat: confirmed by code reading for checkbox-group/range-checkbox-group (see "Control bugs surfaced by sandbox demos"); verify visually on `/sandbox/selection`.

### CSS cleanup — remaining open items

- Phase 4 naming normalization (optional, lowest priority — only inside files already touched).
- Deferred decisions: the two clone families (info-card ↔ list-card ~15 identical rule pairs; drag-drop-file-upload ↔ dynamic-material-dialog ~5 pairs) — shared partial vs component merge; HTML inline hex styles; tab-group TS default color.

### Button follow-up (optional)

- Rename `button-v2` → `button`/`app-button` if the version suffix should go.

## Navigation service (TBD)

Status: TBD — no real need for it right now; revisit only when a forked app actually needs claim/country-filtered menus. Lower priority than the open items above. (Legacy source `src/app/controls-to-port/services/navigation.service.ts` was deleted without migration on 2026-11-13; the mechanics below were recorded before deletion.)

- **Original:** builds claim- and country-filtered menus (`navSetup`, `canDisplay`, distinct-claims aggregation) from a large app-specific menu tree, gated by `LoginService` claims.
- **Why parked:** the template's existing navigation base covers current needs, and the legacy menu data is app-specific (old-company).
- **Future investigation points:**
  - A generic `Navigation` model (name, path, icon, claims, allowed countries, children).
  - Tree aggregation of child claims/countries onto parents.
  - Claim filtering integration with `LoginService.userHasRequiredClaims`.
  - How menu data should be supplied per forked app (config file vs route data).

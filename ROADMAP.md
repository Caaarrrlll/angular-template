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

Project-wide critique of patterns that deviate from Angular best practices (Angular 22, standalone, signals). Each item has a stable ID: reference it from tasks and commits ("fixes AUD-14"), tick it `[✓]` with a date when resolved, and never renumber (new findings take the next free number). Items marked _(code reading)_ have not been reproduced in a browser. Verified-clean areas are not listed (100% OnPush, zero `@typescript-eslint` errors under strictTypeChecked, zero `any`, zero legacy control flow, zero console violations, full `@for` track coverage — see RATE_LIMIT_TRACKER_HISTORY.md, 2026-11-17 entry; most of these are now lint-enforced).

#### High

- [ ] **AUD-01 Library→controls dependency inversion** (alias masks it): `library/models/cust-page.ts:1` and `library/services/grid-storage.service.ts:2` import `_LinQGridFilterItem`/`_LinQGridFilterCondition` from `@shared/components/linq-grid-filters/...`. Fix: move that model to `library/models`, update consumers + `SERVICES_CONTRACTS.md`.
- [ ] **AUD-02 Dormant integration scaffolding** (developer decision 2026-11-15: KEEP, wire when first used): `request.interceptor.ts` never registered (no `provideHttpClient`/`withInterceptors`; zero `HttpClient` usage); `ErrorHandlingService` never provided; `CustomPreloadingStrategyService` not wired into `provideRouter`; providers inline in `main.ts` — create `app.config.ts` when HTTP wiring lands.
- [ ] **AUD-03 47 pre-existing `@angular-eslint` errors** (re-measured 2026-11-17, unchanged by the sandbox and the new lint rules): click-events-have-key-events ×9, interactive-supports-focus ×9, mouse-events-have-key-events ×9, alt-text ×3 (info-card:481, list-card:209, media-dialog:10), template `eqeqeq` ×6, `directive-selector` ×9 (`cust*` selectors in library directives vs the `app` prefix), `prefer-inject` ×1 (cust-table-dialogue:29), `no-empty-lifecycle-method` ×1 (table:192). Fix pattern already established (role/tabindex/keydown.enter — see gallery/chips/tabs/dialog).
- [✓] **AUD-04 zoomable-image lens throws** _(confirmed in browser 2026-11-18: NG05201 on mouse-wheel)_: `zoomable-image.component.ts:106` passes a plain string to `sanitize(SecurityContext.RESOURCE_URL)`. — fixed 2026-11-18: `SecurityContext.URL` + quote/paren encoding; browser-verified.
- [✓] **AUD-05 list-card crashes without buttons** _(code reading)_: `list-card.component.html:73` when neither `tableButtonConfig` nor `parentButtonProcess` is given. — fixed 2026-11-18: empty button row skipped; sandbox regression card; browser-verified.
- [✓] **AUD-06 Dynamic dialog Slider/Upload field types unusable** _(code reading)_: `formControlName` on `<mat-slider>` (no value accessor; dynamic-material-dialog + dynamic-window) and `matInput` on `type="file"`. — fixed 2026-11-18: `formControlName` on `matSliderThumb` (dialog + window); native file input writes the files into the control; sandbox regression dialog; browser-verified.
- [✓] **AUD-07 checkbox-group / range-checkbox-group don't re-render on programmatic values** _(confirmed in browser 2026-11-18 for both groups, incl. the stale single-mode tick; time-span-picker confirmed fine)_: `writeValue` never marks for check (`checkbox-group.component.ts:36`, `range-checkbox-group.component.ts:37`); single mode likely leaves the previous tick showing. time-span-picker likely fine. Verify on `/sandbox/selection`. — fixed 2026-11-18: group `value` is a signal; inner `mat-checkbox` no longer takes clicks; browser-verified.
- [✓] **AUD-08 dynamic-material-dialog validators wrong** _(code reading)_: `ValidatorType.noSpace`/`phone` swapped and `[^s]+` missing its backslash (same pattern in dynamic-window); setup objects are mutated, so reopening a setup gives `Validators.pattern(0)`. — fixed 2026-11-18: patterns corrected (dialog + window); `getEnumName` maps noSpace/phone to `pattern` so the setup is no longer mutated; browser-verified.

#### Control bugs surfaced by sandbox demos (2026-11-17, from code reading by the demo batches)

The demos work around these; no control was changed.

- [ ] **AUD-09 dynamic-material-dialog model/typing:** builder classes (`DialogInput`, `DropDown`, …) declare `formName?` but `_DialogControl.formName` is required, so the control's own builders don't type-check against its setup (sandbox uses a `namedControls()` helper); `Numeric` sets `type: Input` (MinMax branch dead).
- [ ] **AUD-10 dynamic-material-dialog behaviour:** title/close hidden unless `options` passed (`options ?? {}` makes `@if (!options)` dead); hard-coded "payroll"/"sales executive" snackbars (also dynamic-window); CheckBox/Radio/CheckBoxRange share one `data`/`filteredData`; every Input hijacks autocomplete, OnPush stale suggestion list, spinner ordering; `ngModel` mixed with `formControlName`; `DynamicDialogService.clear()` kills the app-wide subjects.
- [ ] **AUD-11 range-slider ignores `minValue`/`maxValue`** _(confirmed in browser 2026-11-18)_ (initialised at construction); `valueChange` re-emits the same mutated object.
- [ ] **AUD-12 range-date-picker:** initial range not shown in the inputs; no `startAt`; inline `--width` style.
- [ ] **AUD-13 select option:** `option.component.html:2` shared `name="test"` (all radios form one group); label click may emit twice.
- [ ] **AUD-14 input family:** input-select binds `[disabled]` with `[formControl]` (Angular warning confirmed in browser 2026-11-18); app-input fixed `for="search"`, unused `type`; input-text/number/currency `setValidators` overwrite caller validators.
- [ ] **AUD-15 input directives:** `currencyInput`/`appCurrencyMask` change display only, never the model; `MinMaxDecimal` uses `parseInt`.
- [ ] **AUD-16 tab-group:** `<ng-content [select]>` binding is ignored; content follows the `activeTab` input only; `matTabGroupConfig` CSS vars + `vertical`/`horizontal` classes unused (white-on-white vertical labels).
- [ ] **AUD-17 tabs:** back/next directives blank the wizard at the ends (`tab-back-button.directive.ts:14-18`, `tab-next-button.directive.ts:26-31`); `resetTabs()` keeps `completed`; `tabs.component.html:20` duplicate `class`; still `CommonModule`/`ngClass`.
- [ ] **AUD-18 small controls:** count-down won't restart on the same value and uses `setInterval`; slide-toggle `!!value` treats `"false"` as on, `isReadOnly` unused; fab-button `position: fixed`.
- [ ] **AUD-19 gallery:** `#fullScreen` querySelector (first gallery only); autoplay without markForCheck; missing `assets/images/image_not_found.png`; global arrow/space listeners.
- [ ] **AUD-20 media misc:** zoomable-image global arrow listeners; `cursorFollowZoom` uses document-wide `selectRootElement`; carousel wrap doesn't emit `openDetails`; media-dialog null loader → broken img, `<span (click)>` close.
- [ ] **AUD-21 drag-drop-file-upload:** duplicate `id="fileDropRef"`; `filesToAccept` not applied to dropped files.
- [ ] **AUD-22 info-card:** drops `false` booleans (`info-card.component.ts:226`); `heightAuto` mutates the input; `getElementById` menus need page-unique ids.
- [ ] **AUD-23 list-card / card-table:** loading flag matched by button label; header without `type` renders nothing; `upperToggleChange` emits `data: null`; card-table always renders filter bar + paginator.
- [ ] **AUD-24 config mapped once:** info-card, list-card, table and linq-grid-filters read their config inputs only on init (later changes ignored); linq-grid-filters mutates the passed items.
- [ ] **AUD-25 table storage side effects:** writes/reads localStorage (`lastScrollPosition`, sort, `operations_open_in_new_tab`); hard-coded `desc` arrow; `_CUSTPage` reads sessionStorage in its constructor.
- [ ] **AUD-26 chips / key-value:** chips mutates input objects + inline hex; key-value v2 inline colours; key-value/info-card clickable `mat-icon`/`div`/`a` (a11y; overlaps AUD-03).
- [ ] **AUD-27 library pipes/directives:** `highlight-search-match.pipe.ts:25` builds `new RegExp` from raw input (throws on `(`; fix with AUD-28); `orderBy`/`sort` sort in place; `thousandSeparator` blanks `0`; `copyText` classes have no styles; `safe` pipe (resource-URL only) used on `<img [src]>` in `dynamic-window.component.html:28`.
- [ ] **AUD-29 search-address:** no guard for a missing `google` global; country hard-coded to `za`.
- [ ] **AUD-42 dynamic-window drops `required`** _(code reading, found 2026-11-18)_: `setValidators([phoneValidator | emailValidator | noSpaceValidator])` replaces the `required` validator set just before it (`dynamic-window.component.ts` ~L74-90 and ~L111-126), so a required phone/email/nospace field is not required.

#### Medium

- [ ] **AUD-28 XSS surface in `highlight-search-match.pipe`** (`bypassSecurityTrustHtml`): the injected `<mark>` markup is fixed, but surrounding text is inserted unescaped — injection vector if highlighted data is ever user-supplied. (`safe.pipe` is a documented trusted-content-only escape hatch; `zoomable-image` pre-sanitizes properly.)
- [ ] **AUD-30 Two dev-gating flags disagree:** `environment.isLocal` gates sandbox routes, but `environmentName !== "production"` gates nav `showSandbox`, logger, error-handling. Unify on one flag.
- [ ] **AUD-31 No `DIRECTIVES_CONTRACTS.md`** for the 12 `library/directives` files — breaks the Contracts rule in AGENTS.md.
- [✓] **AUD-32 Mixed service decorators** — resolved 2026-11-17: the remaining 4 `@Injectable({ providedIn: "root" })` services moved to `@Service()`; now lint-enforced.
- [ ] **AUD-33 `@HostListener` ×22 + `@HostBinding` ×1** (library directives, tabs directives, zoomable-image) — prefer the `host: {}` metadata object; mechanical, low-risk, also required before `experimentalDecorators` can be dropped.

#### Low / cosmetic

- [ ] **AUD-34** 63 redundant `standalone: true` (default since Angular 19); tsconfig still excludes the deleted `src/app/controls-to-port` path; `@animations/*` alias configured but unused.
- [ ] **AUD-35** No `environments` path alias — 3–4 level relative imports to `src/environments` (navigation.component.ts:12 worst).
- [ ] **AUD-36** 92 HTML inline styles in 18 files (hardest: table.component.html:31 dynamic CSS var); dead Kendo CSS selectors in card-table.component.scss:79-83; tab-group TS default `--tab-label-hover-color`.
- [ ] **AUD-37** Two `model()`-candidate two-way pairs (time-span-picker `value`, range-date-picker `selectedRangeValue`) — convert only if those files are touched for another reason.
- [ ] **AUD-38** Perf notes: 3 duplicate `filteredData | async` subscriptions in dialog `@for` branches; `keyvalue` pipes inside `@for` (expandable-grid-form); template getters (button-v2 ×5, gallery ×4, dialog `formType` ×24 — fine under OnPush, convert when touched); 2 un-torn-down dialog-scoped subscriptions (dynamic-material-dialog:190, backdropClick:582).
- [ ] **AUD-39** JWT token stored in localStorage (documented trade-off, SERVICES_CONTRACTS.md); Renderer2 used only in copy-text/zoom directives vs direct DOM access elsewhere — consistency decision, not a violation.
- [ ] **AUD-40** `tsconfig`: `experimentalDecorators: true` + `useDefineForClassFields: false` needed while decorator-API controls remain; `::ng-deep` ×2 in range-slider (acceptable last resort; don't spread).
- [ ] **AUD-41** Unused public field `app.component.ts` `title`.

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

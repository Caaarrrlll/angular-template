# Rate Limit Tracker — History

Historical record of completed sessions/tasks. The live checklist lives in `RATE_LIMIT_TRACKER.md`.
Maintenance rule (see live tracker): after a task is confirmed complete, move its checklist section here.

---

Task: critical signals-readiness check of the project and a concrete migration plan for the ROADMAP.md signals item (developer-approved).

## Checklist

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Checked out master, fast-forwarded to origin/master (old-code-integration merged; 305 files, current work now on master)
[✓] Survey complete: 250 `@Input` / 59 `@Output` across 63 files; only `button-v1` on the signals API; 9 files with `@ViewChild` (all plain ElementRef refs), 8 with `ngOnChanges`, 3 CVA components, no component inheritance, no two-way `xChange` output pairs (no `model()` candidates), 1 `@Input` setter (count-down `timeLeft` → `linkedSignal` candidate)
[✓] Read ROADMAP.md signals section + analyzed patterns per control
[✓] Migration plan written into ROADMAP.md: rules block (getter→computed call-syntax risk, CVA, viewChild, takeUntilDestroyed stays) + 6 phases (0 done/finish button-v1 output, 1 trivial leafs, 2 input family + CVA trio, 3 ngOnChanges/ViewChild rewrites, 4 heavy grids/tables, 5 directives sweep) + 5 risks
[✓] Clean boundary reached (2026-11-13): signals migration plan recorded

## Follow-up (2026-11-13): pragmatic scope cut for the signals plan (developer-approved)

[✓] ROADMAP.md amended: Phases 4 & 5 dropped; "Do not migrate" subsection added (heavy coupled controls table/card-table/linq-grid-filters/expandable-grid/dynamic-material-dialog/dynamic-window/info-card/list-card/gallery/search-address; CVA trio inputs; library directives sweep; standalone getter→computed; standalone viewChild swaps; input.required() restricted). Phase 2 loses the CVA trio; Phase 3 narrowed to ngOnChanges redesigns (carousel, gallery-preview, tab-group, count-down) + opportunistic accordion/zoom-\* viewChild swaps
[✓] Summarize the revised plan for the developer (chat only) — closed 2026-11-15: plan was approved and executed (Phases 0–3 done; Phase 4/5 dropped to "Do not migrate"); stale in-progress marker resolved

## Task (2026-11-13): signals migration Phase 0 — finish button-v1's `@Output()` (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Convert `@Output() selected: EventEmitter<CustButtonMenuItem>` to `output<CustButtonMenuItem>()`; removed unused `EventEmitter`/`Output` imports
[✓] Verify: `npx ng build` passes (no errors); `npx eslint` on the file clean; no external consumers of `app-button-v1` (verified by grep — output rename would have been a breaking change otherwise)
[✓] Clean boundary reached (2026-11-13): Phase 0 done. Next = Phase 1 trivial leafs per ROADMAP.md (loader, fab-button, button-primary/secondary/tertiary/text, slide-toggle, currency, housing-card, card, card-header, option, select, checkbox sub, range-checkbox sub, chips, chip-status, numeric-up-down, key-value v1–v3, tab sub, media-dialog, confirmation-dialog, evaluation-comparison)

## Task (2026-11-13): signals migration Phase 1 — trivial leaf controls (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Batch 1: loader, fab-button, button-primary, button-secondary, button-tertiary, button-text, slide-toggle, currency — build + eslint clean (CRLF fix via prettier)
[✓] Batch 2: housing-card, card, card-header, option, checkbox (sub), range-checkbox (sub) — build + eslint clean. `select` control already deleted in e7d4619 (empty .ts + orphan html/scss, zero consumers — skipped); consider deleting the orphan select files
[✓] Batch 3: chips, chip-status, numeric-up-down, confirmation-dialog (no @Input/@Output — no-op), media-dialog (no @Input/@Output; teardown modernized to takeUntilDestroyed per coding standards), evaluation-comparison — build + eslint clean. `tab` (sub) moved to Phase 2: tabs.component + tab-back/next-button directives read/write child tab props directly (`tab.active = true`, `tab.completed`, `tab.isConfig`) — migrating the sub alone breaks them
[✓] Batch 4: key-value, key-value-v2, key-value-v3 — build + eslint clean (no external consumers; templates only)
[✓] Final verify (2026-11-14): full `npx ng build` passes (only pre-existing bundle-budget warning), prettier + eslint clean on every file touched in batches 2–4
[✓] Clean boundary reached (2026-11-14): Phase 1 done. Developer reminders: (a) sandbox visual check of migrated controls; (b) orphan select files (`src/app/controls/components/select/select/` empty .ts + html/scss, zero consumers) can be deleted; (c) `tab` (sub) deferred to Phase 2 (parent/directives mutate child props). Next = Phase 2 per ROADMAP.md (input family, button-v2, button-toggle, drag-drop-file-upload, tabs + tab directives + tab sub)

## Follow-up (2026-11-14): chips a11y lint fix

[✓] chips.component.html clear-circle div: added `tabindex="0"`, `role="button"` and `(keydown.enter)="chipClearAction(item)"` to satisfy `click-events-have-key-events`; eslint + prettier clean (verified)

## Task (2026-11-14): remove company-specific evaluation-comparison (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Deleted `src/app/controls/components/gallery/evaluation-comparison/`; removed `_DeconstructedFlatView` from gallery.models.ts
[✓] Removed the flat-view path it solely hosted from gallery: `stockNumber`/`flatView`/`flatViewCompare` inputs, flat-view branches in next()/prev()/navigateToIndex(), `@if (!flatView)` template wrapper, `.galleryFlatView` styles
[✓] Verify (2026-11-14): `npx ng build` passes (only pre-existing bundle-budget warning); eslint + prettier clean on gallery files; no remaining references in src (remaining `stockNumber` hits are unrelated card-table/table logic)

## Follow-up (2026-11-14): gallery a11y lint fixes

[✓] gallery.component.html: prev/next nav container divs and pager dot spans got `role="button"`, `tabindex="0"` and `(keydown.enter)` handlers (full-size click areas kept — handlers not moved to the inner 50px buttons); eslint + prettier clean, build passes (verified)

## Task (2026-11-14): signals migration Phase 2 — input family + simple mid-size controls (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Batch 1: `input` + input-text, input-email, input-number, input-phone, input-currency, input-select — inputs → `input()`, ngOnInit wiring untouched; no external consumers (verified by grep); build + prettier + eslint clean
[✓] Batch 2: button-v2, button-toggle, drag-drop-file-upload — build + eslint + prettier clean (fixed TS narrowing across signal calls in button-toggle ngOnInit; `close` output renamed `closed` (no-output-native, zero consumers); pre-existing `==` in button-v2 html)
[✓] Batch 3: tabs + tab (sub) + tab-back/next-button.directive — `active`/`completed` converted to `model()` (input bindings preserved, parent/directives write via `.set()`); title/isConfig/stepControl → `input()`; linear → `input()`, tabSelectedEvent → `output()`; ContentChildren/QueryList kept. Directive selectors renamed `cust*TabButton` → `app*TabButton` (app-prefix lint rule; zero consumers). Tab `<li>` elements got role/tabindex/keydown.enter. Build + eslint + prettier clean
[✓] Verify after each batch: `npx ng build` + eslint/prettier on changed files
[✓] Final verify (2026-11-14): full `npx ng build` passes (only pre-existing bundle-budget warning); clean tracker boundary. Next = Phase 3 per ROADMAP.md (ngOnChanges redesigns: carousel, gallery-preview, tab-group, count-down; opportunistic accordion/zoom-* viewChild swaps)

## Task (2026-11-14): signals migration Phase 3 — ngOnChanges redesigns (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Batch 1: carousel — inputs/outputs → signal API; `selectedImg` stayed a writable `signal` with an `effect` on `navigateTo` (using `untracked` for the images lookup) instead of `linkedSignal`: linkedSignal's `previous.value` only restores the last *computed* value, so locally-clicked selections would be lost when `navigateTo` changes/clears — effect+untracked reproduces ngOnChanges semantics exactly; the snackbar side effect also doesn't belong in a computation. Template got call syntax + thumbnail keyboard a11y. Build + eslint + prettier clean
[✓] Batch 2: gallery-preview — window state redesigned: maxWidth/lastIndexOfArray/visibleImages/lastVisibleIndex → `computed()`, firstVisibleIndex stays a writable `signal`, ngOnChanges re-centering → `effect` (active index or window-size change); object mutation of input images (`image.visible`) replaced by computed visibility check `isImageVisible(i)` (image.visible was internal-only — parent passes plain Image[]); template call syntax + preview-image keyboard a11y. Build + eslint + prettier clean
[✓] Batch 3: tab-group — `activeTab`/`tabList` → `input()`; `tabToUse` → writable `signal` bound via `[(selectedIndex)]="tabToUse"` (writable-signal two-way binding, Angular 22); matTabGroupConfig rebuild (`buildTabGroupConfig` + setMatTabHeader/setMatLabels/addMargins) → single `computed()` from `tabList()`; activeTab ngOnChanges → `effect` (sets tabToUse + hideContent); `tabUpdate` input removed (computed rebuilds reactively — zero consumers verified); ngAfterContentInit dropped. Build + eslint + prettier clean
[✓] Batch 4: count-down — `seconds` → `linkedSignal` from `timeLeft` (Angular 22 API: no `initialValue` option — computation supplies the initial null via `previous?.value ?? null`; annotated `WritableSignal<number | null>`); interval start moved to an `effect` (side effect out of the computation); textFormat → `input()`, timeRemaining → `output()`. Bonus fix: seconds mutation now properly re-renders under OnPush (the old plain-field mutation could not). list-card consumer API-compatible (verified). Build + eslint + prettier clean
[✓] Verify after each batch: `npx ng build` + eslint/prettier on changed files
[✓] Final verify (2026-11-14): full `npx ng build` passes (only pre-existing bundle-budget warning); eslint clean across all four Phase 3 controls; clean tracker boundary. Phase 3 done — ROADMAP opportunistic accordion/zoom-* viewChild swaps remain deferred (only when those files are touched for another reason). Next = the follow-up projects in ROADMAP.md (CSS cleanup, button family merge) or developer-directed work

## Task (2026-11-14): roadmap updates — sandbox item + CSS cleanup migration plan (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Add "sandbox flesh-out" item to ROADMAP.md, placed after the button family merge
[✓] Survey the project's CSS (file counts, sizes, duplication patterns, global styles, theming vars): 61 files ~50KB, zero SCSS partials/mixins, white ×58 / orange ×25+5 variants / navy ×19+variants hardcoded, .show-pointer duplicated in key-value trio, orphan select/ scss noted
[✓] Write the CSS cleanup migration plan into ROADMAP.md (survey + 5 phases: token foundation → token replacement → dedupe → dead-style removal → optional naming pass; risks documented)
## Task (2026-11-14): CSS cleanup Phase 0 — token foundation (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Full color inventory (all hex counts + usage spots for variant naming): 58 distinct hex values; recurring set tokenized, singletons left literal
[✓] Check duplicated rule bodies (.show-pointer etc.): trivially identical (`cursor: pointer`) in all key-value variants
[✓] Create src/app/library/styles/_tokens.scss (33 palette/status tokens, near-variants kept separate, documented) and _utilities.scss (cursor-pointer mixin, grows in Phase 2)
[✓] Wire angular.json stylePreprocessorOptions.includePaths = src/app/library/styles (build + test targets)
[✓] Smoke-test wiring: styles.scss snackbar theming converted to tokens (`@use "tokens" as *;`); ng build passes, compiled styles css verified to contain token values; prettier clean
## Task (2026-11-14): CSS cleanup Phase 1 — token replacement (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Batch 1: neutrals — #fff/#ffffff → $color-white, #000 → $color-black across src scss (15 files; build + prettier verified, no leftover literals)
[✓] Batch 2: orange family — 17 files; alpha variant → rgba($color-orange-selected, 0.6); build + prettier verified; leftovers = 2 HTML inline styles (deferred) + 2 gradient singletons (intentional)
[✓] Batch 3: navy/charcoal/slate/blue-gray — 15 files; build + prettier verified; leftovers = HTML inline styles only (deferred to scss move)
[✓] Batch 4: grays — 11 files; build + prettier verified; leftovers = chips HTML inline styles + tab-group TS string default (both deferred — not scss)
[✓] Batch 5: semantic — greens/reds/blues → tokens, 9 files; build + prettier verified; leftovers = table check/close HTML inline styles only (deferred)
[✓] Final verify (2026-11-14): full residual-hex inventory scanned — remaining literal hex in component scss = documented per-file singletons only (button-v2 #3d444d/#4e525c, card-header+list-card #ecebed, chip-status #f3f3f3, select #0d141f/#525861, tab-group #293640, card-header gradient #fb9d17/#f5871f); ROADMAP.md Phase 1 annotated done; prettier clean; ng build passes
## Task (2026-11-14): CSS cleanup Phase 2 — dedupe copy-pasted rules (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Survey: 74 truly-identical duplicate rule bodies found across component scss (normalized-body grouping)
[✓] Mixins decided by criteria (multi-file + semantic): cursor-pointer, orange-svg-filter, input-button-icon, input-button-wrapper added to _utilities.scss; single-file dupes + standalone cursor:pointer left as-is (KISS); select orphan usage skipped
[✓] Replaced 9 usages across 6 files: key-value trio (.show-pointer ×4), gallery + gallery-preview (orange-svg-filter, hover cursor), input family (button-icon/button-wrapper ×2 each); @use "utilities" added to all 6
[✓] Final verify (2026-11-14): ng build passes, prettier clean, token/mixin wiring confirmed via build; ROADMAP.md Phase 2 annotated done with deferrals recorded
## Task (2026-11-14): CSS cleanup Phase 3 — dead-style removal (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Delete orphan select/select/ leftovers: folder removed after verifying empty .ts + zero consumers
[✓] Script survey: 43 class-selector candidates absent from all src ts/html; first run had a $null-Get-Content bug leaking stale names — re-run fixed; 8 zero-byte scss files identified
[✓] Manual review: kept false positives (card/card-header/button-v1 dynamic color inputs, accordion animation states, carousel 'vehicle-imgs-'+preview(), galleryZoomBoxVisible via ZoomDirective, comment text); confirmed dead: card-table demo leftovers ×3, dynamic-window unused utilities ×6, gallery-preview duplicate .galleryPreviewContainer (live copy in gallery scss)
[✓] Deleted confirmed dead blocks + 8 zero-byte scss files + their styleUrls entries; fixed pre-existing no-inferrable-types lint errors in search-address.component.ts while touched
[✓] Verify (2026-11-14): ng build passes, eslint clean on touched ts, prettier clean; ROADMAP.md Phase 3 annotated
[✓] Clean boundary reached: Phase 3 done. Next = Phase 4 naming normalization (optional, lowest priority — only inside files already touched); still open: developer decision on the two clone families (shared partial vs component merge), HTML inline hex styles, tab-group TS default color

## Task (2026-11-15): button family merge investigation (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Read all button controls (v1, v2, primary, secondary, tertiary, text): ts/html/scss
[✓] Survey consumers of each button control across src (segments, sandbox)
[✓] Diff API surfaces + styles; identify overlap and merge shape
[✓] Write the merge proposal/investigation results into ROADMAP.md; present options to the developer (developer decides before any code change)
[✓] Developer decision: Option A (delete wrapper layer, use app-button-v2 directly) + delete button-v1
[✓] Delete button-v1, button-primary, button-secondary, button-tertiary, button-text
[✓] Update consumers: dynamic-window, info-card, list-card, table, table-dialogue (tags → app-button-v2 with real CustButtonType; imports)
[✓] Verify: ng build + eslint/prettier on touched files; ROADMAP.md annotated; clean tracker boundary
[✓] Clean boundary reached (2026-11-15): button family merge done — end state is button-v2 + fab-button. Optional follow-ups: button-v2 rename (`app-button`), pre-existing eslint debt in heavy controls (info-card/list-card/table/dynamic-window/table-dialogue). Next per ROADMAP.md = sandbox flesh-out (demos for every control) or developer-directed work

## Task (2026-11-15): planning session — sandbox plan + fab-button merge plan + Angular best-practices critique (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Sandbox flesh-out: survey controls inventory + current sandbox structure; write plan into ROADMAP.md (do not start implementation)
[✓] fab-button: survey ts/html/scss + consumers; write merge plan into ROADMAP.md (developer decides before any code change)
[✓] Angular best-practices critique: survey project-wide patterns/decorators/structs; write findings into ROADMAP.md (notes only, no code changes)
[✓] Clean boundary: all three plans recorded; present summary + next options to developer
[✓] Developer decisions (2026-11-15): fab-button = keep + parameterize (icon/aria inputs + a11y); audit dead infra = KEEP for future forks (annotated in ROADMAP.md); next task = OnPush sweep
[✓] Update ROADMAP.md annotations for both decisions

## Task (2026-11-15): OnPush sweep — add ChangeDetectionStrategy.OnPush to the 34 components missing it (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Batch 1: segments + app (app.component, contact, landing, not-found, sandbox) — add OnPush, build + prettier
[✓] Batch 2: input family (input-text/email/number/phone/currency/select) — add OnPush, build + prettier
[✓] Batch 3: tabs family (tabs, tab, tab-group) + accordion — add OnPush, build + prettier
[✓] Batch 4: mid-size controls (chips, checkbox-group, range-checkbox-group, range-date-picker, button-toggle, media-dialog, confirmation-dialog, info-card, list-card) — add OnPush, build + prettier
[✓] Batch 5: heavy controls (table, card-table, gallery, dynamic-window, dynamic-material-dialog, search-address, linq-grid-filters, expandable-grid + expandable-grid-form, navigation, table-dialogue) — add OnPush, build + prettier
[✓] Final verify (2026-11-15): zero components without OnPush (re-scan clean); full ng build passes (pre-existing bundle-budget warning only); prettier clean on all 35 touched files. Sandbox-verification flags recorded: CVA pair writeValue rendering; heavy mutation-driven controls rely on template-event CD
[✓] Clean boundary reached (2026-11-15): OnPush sweep done; ROADMAP.md audit annotated (OnPush item marked done). Open: fab-button parameterization (approved, not started), sandbox plan (not started), remaining audit items (medium/low)

## Task (2026-11-15): strict-typing lint settings + signal-forms applicability survey (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Survey current eslint/tsconfig typing settings; determine what strict-typing changes are needed (done 2026-11-15: strictTypeChecked + stylisticTypeChecked adopted)
[✓] Apply strict-typing lint changes + fix resulting violations in src (build + eslint clean) — (2026-11-16 done: ~278 errors fixed across all of src via parallel agent batches B/C/D/E; project-wide eslint = zero @typescript-eslint errors; ng build passes with pre-existing bundle-budget warning only)
[✓] Survey forms usage (reactive/template-driven); assess signal-forms conversion applicability; record findings in ROADMAP.md — (2026-11-16 done: Signal Forms stable in Angular 22; 13 reactive-forms files + 12 ngModel templates surveyed; recommendation = no bulk migration, new work on Signal Forms, opportunistic conversion only, dynamic-material-dialog + CVA trio stay reactive; recorded under Follow-up projects in ROADMAP.md)
[✓] Clean boundary reached (2026-11-16): strict-typing lint settings applied and all violations fixed (zero @typescript-eslint errors in src, ng build green), signal-forms survey recorded. Task complete

## Follow-up (2026-11-16): roadmap item — template control-flow migration (planning only, no code changes)

[✓] Confirmed no existing dedicated roadmap target for the *ngIf/*ngFor/*ngSwitch → @if/@for/@switch migration (only an audit Medium bullet existed)
[✓] Project survey: legacy directives survive in exactly one file — dynamic-material-dialog.component.html (~92 usages: 37 *ngIf, 22 *ngFor, 20 *ngSwitchCase, 1 [ngSwitch], 13 ng-template [ngIf] wrappers); CommonModule droppable after migration
[✓] Roadmap section added under Follow-up projects (before Navigation service): survey counts, notes/risks, "planned — not started"
[✓] Clean boundary reached (2026-11-16): item recorded; next = developer-directed work (sandbox flesh-out, fab-button parameterization, or the new control-flow refactor)

## Task (2026-11-16): fab-button parameterization + dialog control-flow migration + final architecture analysis (developer-approved)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Fab-button: added `icon` input (default "help") + `ariaLabel` input (default "Help"); clickable div → real `<button type="button">` with `[attr.aria-label]` (native focus/keyboard/role); button resets in scss; `white` → `$color-white` token. Verified: eslint clean, prettier unchanged, ng build passes
[✓] Control-flow migration: converted all ~92 legacy directives in dynamic-material-dialog.component.html → @if/@for/@switch (title h2s kept as two separate @if blocks to preserve the "options exists but not draggable → no title" behavior; mat-error ng-template [ngIf] wrappers → @if inside @for; $any() casts + formControlName/[formGroupName] wiring preserved; track keys = formName/option.value/group.groupName/$index; [ngStyle] → [style.justify-content]; ng-container Upload case hoisted). TS: CommonModule dropped, AsyncPipe + CurrencyPipe imported (only remaining pipe usages)
[✓] Verify (2026-11-16): zero legacy-directive matches in the template; ng build passes (no NG8113 unused-import warnings; strictTemplates green); eslint zero errors on the whole dialog folder (bonus: fixed 2 pre-existing eqeqeq `==` → `===` — string vs string behavior-safe — and added role/tabindex/keydown.enter to close icons + autocomplete lines per the project's established a11y pattern); prettier clean
[✓] Final architecture analysis (2026-11-17): 4 parallel surveys + live lint run; report delivered to developer. Clean: 100% OnPush (60/60), zero @typescript-eslint errors (47 live @angular-eslint errors remain), zero `any`, full control-flow migration, no console/setTimeout/detectChanges violations, contracts complete for pipes/services/validators. Big flaws found: (1) HIGH library→controls inversion — cust-page.ts:1 + grid-storage.service.ts:2 import linq-grid-filter model from @shared/components; (2) HIGH dormant scaffolding — interceptor never registered (no provideHttpClient anywhere), ErrorHandlingService never provided as ErrorHandler, preloading strategy unwired, providers inline in main.ts, no app.config.ts; (3) HIGH 47 @angular-eslint errors (a11y ×27 in zoomable-image/zoom-image/media-dialog/option/info-card + chips/table mouseover, template eqeqeq ×7, directive-selector ×9 in library directives, prefer-inject + empty ngOnDestroy); (4) MED highlight-search-match.pipe bypassSecurityTrustHtml unescapes surrounding text (XSS if user-supplied data); (5) MED two dev-gating flags disagree (isLocal vs environmentName !== "production"); (6) MED no DIRECTIVES_CONTRACTS.md for 12 library directives; (7) LOW debt: 63 standalone:true, @HostListener ×22 not host:{}, @Service ×10 vs @Injectable ×4 mix, no @env alias (3-4 level relative environments imports), 92 HTML inline styles, dead Kendo CSS in card-table, tsconfig excludes deleted controls-to-port, 2 model()-candidate two-way pairs, 3 duplicate async subscriptions in dialog @for, 2 unteardown'd dialog subscriptions
[✓] Clean boundary: tracker updated with results — analysis task complete; next options presented to developer (boundary fix batch, a11y lint-zero sweep, pipe hardening + flag unification, then sandbox flesh-out per ROADMAP.md)

## Sub-task (2026-11-15): agent B batch — strict-typing fixes for info-card + list-card (95 @typescript-eslint errors)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Fix info-card.component.ts + info-card.models.ts (45 fixed, 4 prefer-nullish string-ternaries skipped per rule)
[✓] Fix list-card.component.ts + list-card.interface.ts (46 errors, same patterns); eslint verify
[✓] Verify (2026-11-16): eslint zero @typescript-eslint errors on all 4 files; prettier clean (both unchanged). The 7 prefer-nullish string/number ternaries (4 info-card + 3 list-card) were intentional truthiness checks (empty string/0 must fall back — `??` would change behavior for external parent apps since no in-repo consumers exist); suppressed with inline eslint-disable directives instead of conversion
[✓] Report (2026-11-16): agent B batch done — 91 errors fixed total, 7 intentional truthiness ternaries preserved via disable directives; clean tracker boundary

## Sub-task (2026-11-15): strict-typing lint fixes — agent C batch (5 files, 65 @typescript-eslint errors)

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Fix linq-grid-filters.component.ts (8 errors: unused import, DateAdapter inject generic, rangeStart/rangeEnd `!`+`??`)
[✓] Fix table.component.ts (5 @typescript-eslint errors: JSON.parse sorts, scrollToPosition redundant check, isDateInPast param, config.icon `??`)
[✓] Fix cust-page.ts (25 errors: typed JSON.parse cache, `??` in setAttributes)
[✓] Fix api-response.pipe.ts (9 errors + 2 follow-ups: drop `any` overloads, narrow payload envelope, impl return `unknown`, drop redundant assertion)
[✓] Fix date-time-ops.service.ts (18 errors: String() in template literals)
[✓] Verify (2026-11-15): eslint = zero @typescript-eslint errors on all 5 files (only pre-existing out-of-scope @angular-eslint/no-empty-lifecycle-method in table.component.ts:192); tsc --noEmit exit 0; prettier clean (all 5 unchanged); apiResponse consumers verified overload-compatible. Skipped: none. Clean boundary reached — agent C batch done
[✓] Clean boundary + report next roadmap item to developer (2026-11-16: agent C batch confirmed done; all parallel strict-typing batches reported below)

### Sub-task (2026-11-16): strict-typing fixes — agent E batch (10 files, dynamic-material-dialog family + expandable-grid etc.)

[✓] Survey eslint error dump + read all 10 assigned files
[✓] Fix time-span-picker (1), input-phone (1), search-address (1 ts error; prettier import wrap too), cust-table-dialogue (0 @typescript-eslint — 1 out-of-scope @angular-eslint/prefer-inject skipped)
[✓] Fix dynamic-window (1 ts error + prettier), expandable-grid (2 + 1 follow-up no-base-to-string), expandable-grid-form (4 + 2 follow-up no-base-to-string)
[✓] Fix dynamic-material-dialog: dynamic-dialog.service.ts (2, empty ctor removed), setup.model.ts (42 — all `value?: any` → `unknown`), dialog.component.ts (~51 — casts for unknown value/error.value, `??`/`??=` conversions, hour/min padStart stringification, Validators .bind(Validators) ×8, no-op `?? ""` removals on required formName, AbstractControl|undefined cast in clear(), ElementRef<HTMLElement>; dialog html: 2 `[value]="$any(...)"` added because unknown broke strictTemplates bindings)
[✓] Verify (2026-11-16): eslint = zero @typescript-eslint errors on all 10 assigned files (remaining: @angular-eslint/prefer-inject in cust-table-dialogue + pre-existing template/a11y errors in dialog html — out of scope); project-wide `tsc --noEmit` exit 0; prettier --write clean on all touched ts files (html prettier-check passed)
[✓] Report (2026-11-16): 4 suppressions via eslint-disable comments (dynamic-window + dialog default FormControl init: falsy 0/"" must fall back to null; expandable-grid formatCell + expandable-grid-form compareFn: no-base-to-string intentional generic stringification). Behavior notes: 5 truthiness→`??` conversions in dialog FormControl inits (falsy-non-nullish values impossible in those value domains); RangeDate start/end ""→"" instead of null (impossible for dates); removed no-op `?? ""` on required formName (crash behavior identical). Clean boundary reached — agent E batch done

## Sub-task (2026-11-15): agent-d — strict-typing fixes for assigned files (type-only fixes; skip+record anything requiring behavior change)

[✓] Survey assigned error dump + read all assigned files (32 @typescript-eslint errors across the 13 files) (agent-d directives+pipes subset: 4 directives + 10 pipes)
[✓] Fix controls batch 1: button-toggle, button-v2, chips, count-down, tab-group, time-span-picker, zoomable-image, housing-card, input-currency, input-phone — (2026-11-16) most verified already zero-error; time-span-picker (`??` conversion) + input-phone (String() in template literal) fixed; zoomable-image errors are html a11y only (out of scope)
[✓] Fix controls batch 2: media-dialog, range-date-picker, search-address, tab-next-button.directive, tabs, cust-table-dialogue — (2026-11-16) most verified already zero-error; search-address SimpleChange narrowing fixed; cust-table-dialogue clean (only out-of-scope prefer-inject remains)
[✓] Fix controls batch 3: dynamic-window, expandable-grid + expandable-grid-form, gallery — (2026-11-16) done via agent E batch (see its section above); gallery verified clean
[✓] Fix library directives: auto-focus-input, click-else-where, copy-text, n-digit-decimal-number, zoom — 2026-11-16 (directives+pipes subset): zoom fixed (8 restrict-template-expressions via String()); auto-focus-input/copy-text/n-digit-decimal-number verified already free of @typescript-eslint errors, untouched; click-else-where not in this batch's assigned list
[✓] Fix library pipes: array-filter, character-spacing, day-and-hours, group-by-date, name-to-initials, obscure-text, ordinal, postfix, array-sort, to-number (directives 2–4 verified already clean of @typescript-eslint errors; zoom: 8 restrict-template-expressions). 2026-11-16: 25 @typescript-eslint errors fixed across zoom + 10 pipes (String() in template literals, widened FilterPipe filter param, Object.hasOwn in group-by-date, charAt in name-to-initials, typed ordinals array + final fallback, String(value) in postfix, unknown + comparison casts in array-sort, dead `??` removed in to-number); 0 skipped; eslint zero @typescript-eslint on all 14 files (only 4 pre-existing out-of-scope directive-selector remain); tsc --noEmit exit 0; prettier unchanged/clean
[✓] Fix library services/validators: error-handling, logger, open-page, at-least-n-valid, email, identity-number, number-comparison (10 errors fixed: error-handling 6 — unknown-narrowed error body + String() conversions + intentional-truthiness disable; logger 5 — String() in template literals, public API unchanged; open-page 1 — void on router.navigate; validators 7 — `: unknown` on control values, String() precompute in email/identity)
[✓] Fix segments + main.ts: contact, landing, not-found, sandbox, sandbox-expandable-grid-data.service, main.ts (9 errors fixed: no-extraneous-class ×3 — intentional empty template-only components, disable directives; sandbox 2 — String(expanded) + id narrowed to `number | null | undefined` via assertion; sandbox data service 5 unbound-method — static Validators references, disable directives; main.ts 1 — `catch (err: unknown)`)
[✓] Verify (2026-11-16, agent-d services/validators/segments+main portion): eslint = zero errors total (0 @typescript-eslint, 0 other rules) on all 13 files; prettier --write = all unchanged; tsc --noEmit = exit 0. Skipped: none. Items "controls batch 1-3" above are outside this batch's 13-file assignment
[✓] Report (2026-11-16, agent-d 13-file portion): 19/19 assigned @typescript-eslint errors fixed, 0 skipped (4 no-extraneous-class + 5 unbound-method preserved via intentional-disable directives, rest via type-only fixes); eslint/prettier/tsc verified; clean boundary for this portion — next: coordinator's full build

## Task (2026-11-17): history files + debloat + verify 2g + perform 2f + sandbox flesh-out 2d (developer-approved)

[✓] Verify 2g control-flow migration: zero legacy directives in src templates (grep clean; only a doc example in PIPES_CONTRACTS.md), dialog TS has no CommonModule, baseline ng build passes — annotation updated in ROADMAP_HISTORY.md
[✓] Create RATE_LIMIT_TRACKER_HISTORY.md (all completed sections moved, header + maintenance note added)
[✓] Create ROADMAP_HISTORY.md (signals migration, CSS cleanup, button merge, fab-button, control-flow migration moved verbatim with done annotations)
[✓] Debloat live ROADMAP.md: standing-policy block + slimmed audit incl. 2026-11-17 analysis findings (library→controls inversion, dormant scaffolding, 47 @angular-eslint errors, XSS pipe note, dev-gating flags, missing DIRECTIVES_CONTRACTS.md) + maintenance rule
[✓] Rewrite live RATE_LIMIT_TRACKER.md with maintenance note + this checklist
[✓] 2f: Signal Forms policy adopted and recorded in ROADMAP.md Standing policy; concrete step = Signal Forms reference demo in sandbox Phase 3
[✓] 2d Phase 0: sandbox skeleton — index page (cards per family) + `sandbox/:family` lazy routes in app.routes.ts; move accordion + expandable-grid demos into their family pages — done: sandbox.routes.ts (loadChildren from app.routes.ts, one lazy route per family, all 13 pre-registered), shared kit (sandbox-page shell, sandbox-demo block w/ output log, models/sandbox-event-log.ts); accordion → misc page, expandable-grid → tables page (not yet built — build deferred to Final verify per AGENTS.md)
[✓] 2d Phases 1–3 regrouped by family page (one agent per page set, no shared-file edits; brief = docs/agent-briefs/sandbox-family-page.md (originally a scratchpad file; moved into the repo 2026-11-17), rules mirror ROADMAP 2d Rules). Phase 1/2/3 items below get checked when their batches report back:
    [✓] Batch A: buttons + small-controls + tabs — agent reported done (3 pages); worked around: tab-group [select] binding ignored + unused CSS vars, tab back/next directives blank the wizard at ends, count-down same-value restart + setInterval, slide-toggle truthy "false", thousandSeparator blank for 0, tabs.component.html:20 duplicate class, fab position:fixed — unbuilt until Final verify
    [✓] Batch B: inputs + selection (incl. time-span-picker, range-slider; input directives) — agent reported done (inputs + selection pages; page provides CurrencyPipe + provideNativeDateAdapter); OnPush CVA caveat REAL per code for checkbox-group:36 + range-checkbox-group:37 (writeValue no markForCheck; single-mode stale tick); other bugs: range-slider minValue/maxValue ignored (ctor-time init), range-date-picker initial range not shown, option name="test" shared, input-select [disabled]+[formControl], app-input fixed for="search", currency directives display-only, MinMaxDecimal parseInt, input controls setValidators overwrite — unbuilt until Final verify
    [✓] Batch C: data-display + cards (incl. info-card, list-card) — agent reported done (2 pages + sandbox-cards-data.service.ts; index cards description updated); skipped list-card countDown button (live setInterval); bugs: list-card crash w/o buttons (html:73), blank header w/o type (ts:355), loading matched by label (ts:90); info-card/list-card map inputs once; info-card drops false booleans (ts:226), heightAuto mutates input (ts:66), getElementById menu (ts:392); key-value/info-card clickable non-buttons; chips mutates inputs + inline hex — unbuilt until Final verify
    [✓] Batch D: media + upload (zoom + drag-and-drop-files directives) — agent reported done (media + upload pages, sandbox-media-data.service.ts); 9 control bugs reported (zoomable-image RESOURCE_URL sanitize, gallery fullscreen/autoplay/fallback/global keys, drag-drop duplicate ids + drop not filtered, carousel wrap openDetails) — unbuilt until Final verify
    [✓] Batch E: dialogs (light + heavy: dynamic-material-dialog, dynamic-window) — agent reported done (dialogs page + sandbox-dialogs-data.service.ts; dialogs opened via viewContainerRef w/ page providers: provideNativeDateAdapter + mock MEDIA_LOADER); skipped Slider (formControlName on mat-slider → no value accessor, both dialogs), Upload (matInput on file input), Address (google.maps), CheckBoxRange/SingleDateString/Numeric (Numeric dead: type set to Input); dynamic-material-dialog bugs: header hidden w/o options (options ?? {}), noSpace/phone validators swapped + `[^s]+` missing backslash (also dynamic-window), setup mutation → Validators.pattern(0) on reopen, hard-coded payroll/sales-exec snackbars, shared data/filteredData across CheckBox/Radio/CheckBoxRange, autocomplete hijack + OnPush stale list + spinner order, DynamicDialogService.clear() kills shared subjects, ngModel+formControlName mix; media-dialog null → broken img + span close; table-dialogue @Inject — unbuilt until Final verify
    [✓] Batch F: tables (table, card-table, linq-grid-filters; highlight-search-match pipe) — agent reported done (tables page extended + sandbox-tables-data.service.ts); skipped GridStorageService (not used by linq-grid-filters, sessionStorage-only), table expandable/template, timeAgo/dateInPast (non-deterministic); bugs: highlight-search-match raw RegExp (pipe:25), orderBy/sort mutate input, table localStorage side effects + hard-coded desc arrow, init-once configs, card-table upperToggleChange data:null, _CUSTPage sessionStorage in ctor — unbuilt until Final verify
    [✓] Batch G: misc (search-address, copy-text, click-elsewhere, safe pipe) + forms (Signal Forms reference demo) — agent reported done (misc extended; forms page created on @angular/forms/signals 22.0.5: form/FormField/FormRoot); search-address gated on `google` global (no key); bugs reported: copyText classes unstyled, search-address no google guard + hard-coded za, safe pipe used in img URL context (dynamic-window:28) — unbuilt until Final verify
[✓] 2d Phase 1: signal-API family demos via agent batches (buttons; inputs; data-display; cards; small-controls; media; tabs; selection; dialogs-light; upload)
[✓] 2d Phase 2: heavy family demos via agent batches (tables; dialogs-heavy incl. dynamic-material-dialog + dynamic-window; info-card/list-card; search-address; range-slider + time-span-picker)
[✓] 2d Phase 3: directives/pipes folded into relevant demos + Signal Forms reference demo
[✓] Final verify (2026-11-17): `npx ng build` (production) passes — only the pre-existing bundle-budget warning (initial 673.21 kB; no sandbox chunks in prod, isLocal gate confirmed); `npx ng build --configuration development` passes and emits all sandbox family chunks; eslint exit 0 + prettier clean on src/app/segments/sandbox + app.routes.ts. Fixes needed during verify: 25 TS2322 in sandbox-dialogs-data.service.ts (dynamic-material-dialog builder classes declare `formName?` vs `_DialogControl.formName` required — wrapped in a checked `namedControls()` helper in the sandbox, control untouched); 25 sandbox lint errors (template-literal numbers, void-arrow shorthand, inferrable types, class-instance spread in dialogs config(), unbound valueOf destructure in forms, `.at(0)` for possibly-empty sorts, 2 justified `type` aliases kept with reasoned eslint-disable); CRLF introduced by coordinator edits normalised by prettier
[✓] Clean boundary (2026-11-17): this section moved to RATE_LIMIT_TRACKER_HISTORY.md; ROADMAP.md sandbox flesh-out + Signal Forms survey sections moved to ROADMAP_HISTORY.md; control bugs found by the demos recorded in the ROADMAP.md audit. Not done: visual/browser check of the demos (only build + lint verified)

## Task (2026-11-17): apply agent/tracking setup critique (developer-approved, in suggested order)

[✓] Step 1a: AGENTS.md rule conflicts — backticks scope, map vs forEach/for…of, path-alias reality, callback-input exception, `@Service()` standard — done in AGENTS.md (backticks scoped to new code: codebase measured 215 double-quoted vs 42 backtick assignments; environments alias gap documented)
[✓] Step 1b: clutter — fold INSTRUCTIONS.md into AGENTS.md (delete it, update references), remove empty duplicate `## Testing`, move "Controls to Port" out, add "don't read *_HISTORY.md unless needed" — done (INSTRUCTIONS.md removed via git rm; README project-docs list + ROADMAP audit reference updated; ROADMAP.md added to the reading order)
[✓] Step 2: tracker discipline — `[•]` before first edit + files touched, checkbox granularity, batch-boundary scoped checks (replace the build/lint prohibitions), definition of "verified" per change type, history-entry format — done in AGENTS.md (Forbidden Actions build/lint lines replaced; tracker rules for granularity, `[•]`-before-edit + touched files, entry format, history move; new Verification section — dev build measured ~5s, tsc --noEmit works but skips templates so dev build is the per-batch check)
[✓] Step 3: move enforceable rules into eslint.config.js (measure existing violations first; record outcome)
    - added: no-console (logger.service.ts + main.ts exempt), no-restricted-globals setTimeout, no-restricted-syntax (detectChanges, Promise.resolve().then, @Injectable providedIn), explicit-function-return-type, template prefer-control-flow
    - new findings 21 → 0: 4 services moved to @Service() (grid-storage, dynamic-dialog, 2 sandbox data services; resolves the audit's mixed-decorator item), 7 `: void` return types (dynamic-material-dialog actions, copy-text ×3, zoom ×3; tsc confirms)
    - verified: src eslint back to the 47-error pre-existing baseline (same rule mix); dev ng build passes; prettier clean on AGENTS.md + eslint.config.js
    - not enforced (no core rule, or would need a dependency): backticks, takeUntilDestroyed, map-vs-forEach, path aliases
[✓] Step 4a: agent-batch process — docs/agent-briefs/ (process + sandbox brief), AGENTS.md section, fix scratchpad pointer in history
    - docs/agent-briefs/README.md (roles, process, brief template; agents run scoped eslint/prettier, coordinator builds) + sandbox-family-page.md (brief moved from scratchpad, updated to the new rules); AGENTS.md Agent Batches section + folder entry; history pointer fixed; prettier clean
[✓] Step 4b: ROADMAP audit items converted to an ID'd checkbox list
    - ROADMAP.md audit → AUD-01…AUD-41 checkbox items with a stable-ID rule; sandbox bug paragraphs split per control; AUD-32 (mixed decorators) ticked as resolved by Step 3; AUD-03 counts refreshed from today's lint run (total still 47)
[✓] Verify: eslint on changed config + prettier on changed files; final review of AGENTS.md coherence
    - prettier clean on AGENTS.md, ROADMAP.md, README.md, eslint.config.js, docs/agent-briefs, all touched TS
    - eslint: config file clean; touched TS clean except 2 pre-existing directive-selector errors (AUD-03); whole src = 47 baseline
    - production ng build passes (pre-existing budget warning only); dev build passed at Step 3
    - AGENTS.md read-through: lint-enforced rules removed from the hand-followed list (one source of truth)
[✓] Clean boundary: section moved to RATE_LIMIT_TRACKER_HISTORY.md
    - next: developer review of the new AGENTS.md rules; nothing committed

## Task (2026-11-18): fix NG8102/NG8107 nullish-coalescing / optional-chain template warnings (developer request)

[✓] Step 1: un-suppress nullishCoalescingNotNullable + optionalChainNotNullable in tsconfig.app.json/tsconfig.spec.json; collect the full list from a build
    - suppressions removed (default severity: warning); build listed 7 × NG8102, 0 × NG8107 (currency one fixed earlier)
[✓] Step 2: fix each — remove the operator where the value is truly non-null, or widen the type where untyped/runtime data can be null (keep the runtime guard)
    - removed dead `?? ''` inside narrowing @if blocks: list-card.html:147,176,248,262 (`detail.label`), info-card.html:211,281 (`detail.buttonClick`)
    - carousel: new `selectedImage` computed via `.at()` (typed `| undefined`, empty/out-of-range list is real) → template guard is now correctly typed
[✓] Step 3: verify (build with zero NG8102/NG8107, eslint, prettier, browser spot-check of touched controls)
    - dev + prod build: 0 NG81xx (prod: pre-existing budget warning only); eslint + prettier clean on touched files
    - headless Edge: carousel renders + next → 2 of 7; list-card label widths computed (80px/50px); info-card edit icon click logs buttonClick; no console errors
    - AGENTS.md tooling paragraph: extended diagnostics stay unsuppressed
[✓] Clean boundary: section moved to RATE_LIMIT_TRACKER_HISTORY.md

## Task (2026-11-18): roadmap "next up" list, in recommended order — developer review stop after EACH step

[✓] Step 1: browser check of /sandbox — confirm demos render, capture console errors, confirm/refute code-reading items (esp. AUD-04, AUD-05, AUD-07)
    - method: `ng serve` (port 4300) + headless Edge driven over the DevTools protocol by a scratchpad script (no new dependency)
    - all 13 family pages + index render; no uncaught exceptions on load
    - CONFIRMED in browser: AUD-04 (wheel on zoom lens → NG05201 from `imageZoom`); AUD-07 (checkbox-group AND range-checkbox-group: programmatic set changes the value but no tick moves; single mode leaves the old tick showing); AUD-11 (sliders start at 0–100 regardless of minValue/maxValue); AUD-14 part (3× Angular "disabled attribute with reactive form directive" warnings on /inputs)
    - REFUTED-AS-PREDICTED: time-span-picker programmatic set renders correctly (02/12/45)
    - NOT reachable from current demos (demos avoid them; still code reading): AUD-05, AUD-06, AUD-08 — to be covered by demo cases when fixed in Step 2
    - not done: full visual layout review (screenshots only at a narrow viewport)
[✓] STOP — developer review of Step 1 (approved 2026-11-18: "perform step 2")
[✓] Step 2: fix AUD-04…AUD-08 (minimal fixes, existing file style; each verified in headless Edge)
    [✓] AUD-04 zoomable-image sanitize — code changed (SecurityContext.URL + quote/paren encoding); browser-verified
        - touching: zoomable-image.component.ts
    [✓] AUD-05 list-card no-buttons crash — empty button row skipped; demo case added; browser-verified
        - touching: list-card.component.ts, sandbox-cards.component.html
    [✓] AUD-06 dialog Slider/Upload — templates fixed (formControlName on matSliderThumb; native file input, files written to the control); demo cases added (dialog "Slider, upload + validators", window form Slider); browser-verified
        - touching: dynamic-material-dialog.component.{html,ts}, dynamic-window.component.html
    [✓] AUD-07 group value → signal; inner mat-checkbox pointer-events none + tabindex -1; browser-verified
        - touching: (range-)checkbox-group.component.ts, (range-)checkbox.component.{html,scss}
    [✓] AUD-08 noSpace → /^\S+$/, phone → 0[0-9]{9} (dialog both branches + window noSpace); setup no longer mutated (getEnumName maps both to `pattern`); demo case added; browser-verified
        - touching: dynamic-material-dialog.component.ts, dynamic-window.component.ts, sandbox-dialogs{.component.ts,.component.html,-data.service.ts}
        - new finding: dynamic-window setValidators([phone|email|nospace]) drops `required` → record as AUD-42
    [✓] Step 2 verification
        - dev ng build passes; prettier clean; eslint clean on touched files except 2 pre-existing template eqeqeq in dynamic-window.component.html:67,70 (AUD-03, Step 5)
        - headless Edge: AUD-04 no NG05201 + lens background set; AUD-05 no-buttons card renders; AUD-07 ticks follow programmatic set for both groups, single mode correct, inner mat-checkbox pointer-events none; AUD-06 dialog slider value 10 + file attached + submit returns {deposit, attachments}, window slider shows R20,000; AUD-08 noSpace/phone errors correct, identical on a second open
        - caveat: the second open uses a fresh setup from the sandbox factory, so "reopen the same setup object" is covered by code (mutation removed), not by the probe
        - remaining console warning on the new dialog: ngModel + formControlName (existing AUD-10)
[✓] STOP — developer review of Step 2 (approved 2026-11-18: "proceed with the next step")
[✓] Step 3: AUD-28 + AUD-27 highlight-search-match (escape text + regex) — same file
    - touching: highlight-search-match.pipe.ts, PIPES_CONTRACTS.md, sandbox-tables.component.{ts,html}
    - pipe now matches the term literally (indexOf, case-insensitive) and HTML-escapes all text on every path (match, no match, no term); edge spaces → &nbsp; without the extra spans
    - sandbox no longer pre-escapes the term; added an untrusted-sample line as a regression case
    - verified: dev build, eslint, prettier; headless Edge with terms toyota, (cross), ., <b>, &, onerror, zzz → no injected elements, literal text, correct <mark>, no console warnings
    - found + fixed during verify: the first version returned unescaped text on the no-match path (Angular's sanitizer stripped onerror but <img>/<b> still rendered)
[✓] STOP — developer review of Step 3 (approved 2026-11-18: "proceed" — taken as go-ahead for Step 4, Step 3 was already complete)
[✓] Step 4: AUD-01 (library→controls model move) + AUD-30 (single dev-gating flag)
    - verified: tsc; dev + production ng build (prod: pre-existing budget warning only); prettier clean; eslint clean on touched files except table.component.ts:192 no-empty-lifecycle-method (pre-existing, AUD-03)
    - headless Edge (dev): nav shows /sandbox link; /sandbox/tables renders table, 3 linq-grid-filters, card-table cards; no console errors
    - prod: nav links are behind @if (showSandbox) = isLocal (false in prod); sandbox routes absent; not browser-tested in a prod serve
    [✓] AUD-01 model moved (git mv) to src/app/library/models/linq-grid-filter-item.ts; 8 importers + SERVICES_CONTRACTS.md path updated; zero @shared/components imports left in library; tsc passes
    - touching: library/models/linq-grid-filter-item.ts, cust-page.ts, grid-storage.service.ts, card-table/table/linq-grid-filters components, 2 sandbox files
    [✓] AUD-30 dev-gating flags — nav `showSandbox` now uses `isLocal` (same as the sandbox routes); flags documented in both environment files
    - decision: NOT collapsed into one flag — `environmentName` (diagnostics: logger + error handler, on in any non-production env) and `isLocal` (local tooling: sandbox) are different concerns; the real bug was only the nav link vs route mismatch
    - touching: navigation.component.ts, environment.ts, environment.development.ts
[✓] STOP — developer review of Step 4 (approved 2026-11-18 with a change request: rename `isLocal` → `showComponentSandbox`)
[✓] Step 4b: rename sandbox flag `isLocal` → `showComponentSandbox` (env files, routes, nav, docs)
    - touching: environment.ts, environment.development.ts, app.routes.ts, navigation.component.ts, AGENTS.md, README.md, ROADMAP.md (AUD-30 note)
    - verified: prettier + eslint clean; dev + prod build; headless Edge nav link + /sandbox/tables OK, no console errors
[✓] Step 5: AUD-03 — clear the 47 pre-existing @angular-eslint errors (developer chose: rename directive selectors to app*)
    [✓] 5a directive-selector ×9 → appAutoFocus, appCopyText, appCurrencyInput, appDateTransform, appMinMaxDecimal, appMinMax, appNDigitDecimalNumber, appNumericInput, appCursorFollowZoom (dev build passes)
        - same-named inputs renamed too (appCopyText, appDateTransform, appCursorFollowZoom); formControlName values in sandbox-inputs deliberately untouched
        - touching: 9 directive files; dynamic-material-dialog.html, gallery.html, sandbox-inputs/media/misc (.html + 2 TS comments); ROADMAP AUD-15/20 names
        - BREAKING for forks using the old attribute names (developer-approved)
    [✓] 5b template eqeqeq ×7 — all were `== null`/`!= null` idiom checks; enabled `allowNullOrUndefined` on @angular-eslint/template/eqeqeq in eslint.config.js (other loose comparisons still error) instead of rewriting; 0 left
    [✓] 5c template a11y ×27 + alt-text ×3 — 0 left
        - clickables → role="button" tabindex="0" (keydown.enter) (info-card ×3, media-dialog close + aria-label, zoom-image, zoomable-image img + prev/next)
        - hover → tabindex + (focus)/(blur) (info-card eye icon: mouseOver now accepts FocusEvent and anchors to the element; table listPopupHover cell)
        - select option: (click) on <label> → (change) on the input (also fixes the AUD-13 double emit)
        - alt: info-card image "Image", media-dialog "Media item", list-card icon alt="" (decorative)
    [✓] 5d prefer-inject (cust-table-dialogue:29) + no-empty-lifecycle-method (table:192)
        - cust-table-dialogue: `@Inject(MAT_DIALOG_DATA)` constructor → `inject<Record<string, unknown>>(MAT_DIALOG_DATA)` field (same public `data` name)
        - table: removed the empty ngOnDestroy + OnDestroy from implements/imports
    [✓] 5e verification
        - `npx eslint src` exit 0 — ZERO errors project-wide (was 47); prettier clean on src + eslint.config.js + ROADMAP.md; dev + prod build pass (prod: pre-existing budget warning only)
        - headless Edge: 6 renamed input directives present + appNumericInput blocks letters / allows digits + appDateTransform formats 2026-03-04 → 04 Mar 2026; appCopyText decorates; select option emits once per click; zoomable-image Enter on next 1→2 of 7; table-dialogue opens with rows (inject change); media-dialog Enter on close closes it, img alt present; info-card eye icon focus shows popup anchored to the element, blur hides it; no console errors
        - AGENTS.md lint paragraph synced (eqeqeq null idiom, app selector prefix)
[✓] STOP — developer review of Step 5 (approved 2026-11-18; Step 6 = proposed scope; plus a new request below)
[✓] Step 5b: dependency + versioning audit (developer request: `npm i` reported 75 vulnerabilities — 2 low, 33 moderate, 37 high, 3 critical)
    - findings recorded in ROADMAP.md → "Dependencies & versioning (audit 2026-11-18)" as AUD-43…AUD-48 (+ re-run commands)
    - measured: 75 total (2/33/37/3) over 886 pkgs; runtime-only (`--omit=dev`) 9 (7 moderate, 2 high) = Angular 22.0.5 advisories; criticals are dev-only (piscina via @angular/build; proxy-addr via @angular/cli → MCP SDK → express; karma stack)
    - unused/deprecated: @angular/animations, @angular/platform-browser-dynamic (deprecated, 0 imports), prettier-eslint, istanbul-lib-instrument; 0 spec files despite the karma stack
    - nothing installed/changed (needs approval); note: package.json already had an uncommitted `baseline-browser-mapping` addition before this step
    - read-only: npm audit (json), npm outdated, npm ls; record findings as ID'd ROADMAP audit items; NO npm audit fix / installs (dependency changes need explicit approval)
[✓] Step 6 (agreed scope): AUD-31 DIRECTIVES_CONTRACTS.md, AUD-42 dynamic-window required, AUD-11 range-slider initial values, AUD-13 rest (shared name="test"), AUD-34/35/41 mechanical cleanups
    [✓] 6a AUD-31 DIRECTIVES_CONTRACTS.md (12 directives: index + per-directive purpose/inputs/outputs/requirements/known issues) + AGENTS.md Contracts, reading order and folder entries; stale @example selectors in 5 directive files fixed
    [✓] 6b AUD-42 dynamic-window: validators built as a list (required + type); old `requiredValidator` was a no-op (conditionalValidator without a validator returns null), so required only worked on plain fields; dependent phone/email unchanged; sandbox window form gained a required email field (browser check in 6f)
        - touching: dynamic-window.component.ts, sandbox-dialogs-data.service.ts
    [✓] 6c AUD-11 range-slider: values built in ngOnInit (minValue/maxValue now optional, default to min/max); valueChange emits a copy
        - touching: range-slider.component.ts
    [✓] 6d AUD-13 rest: option gets an optional `name` input (rendered only when set) instead of the page-wide `name="test"`; sandbox radio row passes a shared name
        - touching: option.component.{ts,html}, sandbox-inputs.component.html
        - behaviour change: radios without a name are no longer accidentally grouped page-wide
    [✓] 6e AUD-34/35/41
        - removed `standalone: true` from 62 files (audit said 63; 62 found); removed the stale controls-to-port exclude (tsconfig.app.json) and the unused `@animations` alias (tsconfig.json)
        - added `@environments/*` alias; the 4 deep relative environment imports now use `@environments/environment`; app.component.ts navigation import aliased; AGENTS.md path-alias line updated (known gap removed)
        - removed unused AppComponent `title`
        - left as-is (out of scope): sibling-file relative imports inside single control folders; relative lazy imports in app.routes.ts
    [✓] 6f verification
        - tsc; `npx eslint src` exit 0 (added `no-extraneous-class` allowWithDecorator: the now-empty AppComponent is a normal decorated Angular class); prettier clean; prod build (pre-existing budget warning only; `showComponentSandbox:false`, 0 sandbox chunks — env file replacement works through the new alias); dev build (46 sandbox chunks)
        - headless Edge: sliders start at 500–3000 / 20–500 (were 0–100); radio row shares one name and is exclusive, checkboxes have no name; window required email invalid when empty/malformed, valid for a@b.co; only console output = existing AUD-14 warnings
        - not browser-verified: valueChange now emitting a copy (code-only)
    - deferred to later tasks: AUD-09/10 dynamic dialog behaviour, tabs/gallery bugs, CSS cleanup, button-v2 rename, AUD-33 host listeners
[✓] STOP — developer review of Step 6 (approved 2026-11-18: "step 6 was fine")
    - during review: completed the developer's `postLable` → `postLabel` rename (IDE rename had only updated list-card-data-header.interface.ts + 2 object keys): cust-card-table.interface.ts ×4, list-card.html:42 + list-card.ts reads, info-card.ts, 2 sandbox data services; dev build + eslint + prettier pass; headless Edge shows "Created: <date>" on list-cards (/sandbox/cards, /sandbox/tables). Breaking for forks' card configs using `postLable`.
    - new finding AUD-49: info-card maps postText/postLabel into its header but its template never renders them
    - during review: fixed NG8102 in currency.component.ts by widening `amount` to `string | number | null | undefined` (the `?? 0` guards untyped table/card data); eslint + prettier + dev build pass
[✓] Clean boundary: section moved to RATE_LIMIT_TRACKER_HISTORY.md; open audit items stay live in ROADMAP.md

## Task (2026-11-18): dependency updates (roadmap item 1) + housekeeping (roadmap item 5) — developer-approved

Item 1 — dependencies (AUD-43…AUD-48; changes package.json + lockfile, approved):
[✓] 1a baseline: record npm audit counts + versions; snapshot package.json/lockfile in scratchpad for rollback — 75 (2 low, 33 moderate, 37 high, 3 critical) at commit b62e074; package.json + package-lock.json copied to scratchpad deps-backup
[✓] 1b remove unused/deprecated: @angular/animations, @angular/platform-browser-dynamic, prettier-eslint, istanbul-lib-instrument (AUD-47) — npm uninstall; dev build still passes
[✓] 1c remove the unused Karma/Jasmine test stack: karma*, jasmine-core, @types/jasmine, `test` script, angular.json `test` target, tsconfig.spec.json (AUD-45) — done (git rm tsconfig.spec.json; angular.json/package.json re-formatted by prettier)
    - note: npm 12 blocks dependency install scripts by default (esbuild, lmdb, msgpackr-extract listed); builds work without them
[✓] 1d update within ranges: @angular/* 22.2.x, cdk/material/build 22.2.7, cli range → ^22.2.7, eslint/typescript-eslint/angular-eslint/prettier/eslint-plugin-prettier, tslib (AUD-43, AUD-44, AUD-46)
    - npm update + `npm install -D @angular/cli@^22.2.7` → @angular/* 22.2.6, cdk/material/build/cli 22.2.7, eslint 10.15.0, typescript-eslint 8.73.0, angular-eslint 22.7.0, prettier 3.10.1, eslint-plugin-prettier 5.5.7, tslib 2.9.1
    - npm audit: 75 → 20 (all high, all dev-only); `--omit=dev` → 0 vulnerabilities
    - remaining 20 share one root: picomatch ReDoS GHSA-fc5q-39xc-vjpf (range <=4.0.7); latest published picomatch IS 4.0.7 → no patched version exists, no override possible; npm's suggested fixes are major downgrades (cli@16, angular-eslint@18, typescript-eslint@8.47) — rejected
[✓] 1e verify: npm audit (record new counts), tsc, eslint src, prettier, dev + prod build, sandbox browser pass over all 13 pages
    - new lint from typescript-eslint 8.73: no-unsafe-enum-assignment ×5 fixed with runtime guards (button-v2 `isCustButtonType`, list-card `toHeaderAlignment`); no-unsafe-class-instance-assignment ×9 turned off in eslint.config.js with reason (Material config literals / data-only casts)
    - prettier 3.10 reformatted 5 src files; NOT touched: .vscode/*.json (developer editor config) and the tracker .md files (never prettier-formatted)
    - tsc 0; eslint src 0; prettier clean (src, configs, AGENTS/ROADMAP/README); dev + prod build pass, 0 NG8xxx; prod initial bundle 673 → 722 kB (Angular 22.2; budget warning was already present)
    - headless Edge on a fresh `ng serve` (port 4301, updated packages): all 14 pages render, no console errors except known AUD-14 warnings; re-ran Step 2/3/5/6 probes — identical results; button-v2 classes correct for every type
[✓] 1f AUD-48 hygiene: README "Toolchain" section (verified versions, npm 12 install-scripts note, no test runner, audit guidance)
    - left for a dedicated task (majors): typescript 7, eslint-config-prettier 10, zone.js 0.16 / zoneless; no `engines` field added (Angular's supported Node range not verified here)

Item 5 — housekeeping:
[✓] 5a AUD-33: @HostListener/@HostBinding → `host: {}` metadata — 22 listeners + 1 binding in 13 files (11 library directives, 2 tabs directives, zoomable-image) converted by script (scratchpad hostconv.py); selector kept first; dev build (type-checks host bindings) + eslint pass; behaviour browser-check in 5h
    - note: `experimentalDecorators` still needed (@Input/@Output/@ViewChild remain in decorator-API controls)
[✓] 5b AUD-36: static inline `style="…"` in templates → component SCSS (tokens); dead Kendo selectors in card-table.scss; tab-group TS default colour
    - 83 static style attrs in 17 templates → component-scoped classes (script: scratchpad styleconv.py); utility-style `.s-<declarations>` names, 6 long ones renamed semantically (zoom-container, font-poppins, tab-header, circle--count, circle--clear, menu-link); 6 interpolated declarations → `[style.--x]` bindings (button-v2 ×4, table, cust-table-dialogue); colours → tokens where one exists (#000, #fff, #f47920, #ff3826, #75bf44), single-use hex kept literal
    - verified by computed-style diff (headless Edge): baseline of 798 styled elements / 1889 properties across 11 sandbox pages + 9 opened dialogs/windows → after: 0 diffs, 0 missing. First pass caught 4 diffs, fixed: `--color: $color-black` needed `#{}` in a custom property; info-card menu links lost to `.dropdown-content a` → scoped `.dropdown-content a.menu-link`
    - card-table: dead kendo-floatinglabel/kendo-switch block removed
    - tab-group TS hex defaults NOT changed: they feed CSS variables no stylesheet reads (only --tabwidth is used) → folded into AUD-16 (wire the variables)
    - coverage caveat: elements only rendered in states the sandbox does not show were converted but not diffed
[✓] 5c AUD-37: model() for the two two-way pairs (time-span-picker value, range-date-picker selectedRangeValue)
    - range-date-picker: `selectedRangeValue` → `model()` (same public name, `[(selectedRangeValue)]` works; Change event now typed `| undefined` — sandbox handler widened); effect syncs the text fields from the range; `[startAt]` added → also fixes AUD-12 (initial range now shown, calendar opens on its month); headless Edge verified (initial 2026/01/10–15 + JAN 2026, two clicks fill both fields, change logged per click)
    - time-span-picker NOT converted (decision): its `value` setter must sync the inner form synchronously during CVA writeValue; model()+effect would defer that; also on the CVA "do not migrate" list
[✓] 5d AUD-38: perf notes (duplicate async subscriptions, keyvalue in @for, un-torn-down dialog subscriptions)
    - fixed: dynamic-material-dialog date valueChanges + takeUntilDestroyed; backdropClick + takeUntil(afterClosed()) (dev build + eslint pass)
    - no change (assessed): the 3 `filteredData | async` are in mutually exclusive @case branches (one per rendered control); expandable-grid-form `?? {} | keyvalue` only re-runs for the undefined/empty case; template getters fine under OnPush
[✓] 5e AUD-39 / AUD-40: decisions recorded in ROADMAP.md Standing policy (JWT stays in localStorage — forks with sensitive data move to httpOnly cookies; ElementRef reads OK, Renderer2 for element creation, no consistency-only migration; experimentalDecorators + useDefineForClassFields stay until the last decorator-API control; ::ng-deep capped at the 2 range-slider uses)
[✓] 5f CSS cleanup leftovers: clone families (info-card↔list-card, drag-drop↔dynamic-material-dialog) — shared partial for identical rules; Phase 4 naming only in touched files
    - info-card ↔ list-card: 22 verbatim-identical top-level blocks moved to `src/app/library/styles/_card-shared.scss`, `@use "card-shared";` in both (script: scratchpad scssdupes.py); info-card.scss 351→241 lines, list-card.scss 321→213
    - cascade check (headless Edge, 853 card elements × 35 computed properties on /sandbox/cards + /sandbox/tables): partial-at-top vs partial-at-bottom differ only in list-card `justify-content` where `.column` (shared) meets `.col-no-border`; original order had `.column` first → current top placement reproduces the original (`center`)
    - drag-drop ↔ dynamic-material-dialog: only 1 identical top-level block (a 2-line utility class) → no partial (not worth a shared file)
    - Phase 4 naming: no renames beyond the semantic class names chosen in 5b
[✓] 5g button rename: button-v2 → app-button (selector, class, folder, all usages, docs)
    - git mv button/button-v2 → button/button (button.component.{ts,html,scss}); ButtonV2Component → ButtonComponent; app-button-v2 → app-button across 13 files; ROADMAP standing policy updated, Button follow-up section removed; dev build + headless Edge (all button types keep their classes). BREAKING for forks using `app-button-v2` / `ButtonV2Component`.
[✓] 5h verify item 5 (builds, eslint, prettier, browser pass) + roadmap ticks
    - tsc 0; eslint src 0; prettier clean (src, configs, docs); prod build (722 kB, budget warning only) + dev build; 0 NG8xxx
    - headless Edge: all 14 pages render, no unexpected console output; host-listener behaviours verified (fileover on drag, copy icon + snackbar, clickElsewhere, document ArrowRight, tabs next, appMinMax clamp + letter block); computed-style diff vs post-5b baseline: 0 diffs / 1555 properties
    - ROADMAP: AUD-12, 33, 36, 37, 38 ticked (39/40 earlier); AUD-16 absorbs the tab-group TS colour defaults; CSS cleanup section rewritten
[✓] Clean boundary: section moved to RATE_LIMIT_TRACKER_HISTORY.md
    - next: remaining open audit items (AUD-09/10 dynamic dialog behaviour, AUD-14/15/16/17/18/19/20/21/22/23/24/25/26/27/29/49, AUD-48 majors) — developer to pick

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

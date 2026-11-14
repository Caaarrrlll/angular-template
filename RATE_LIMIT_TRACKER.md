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
[•] Summarize the revised plan for the developer (chat only)

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

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
[•] Batch 2: housing-card, card, card-header, option, select, checkbox (sub), range-checkbox (sub)
[ ] Batch 3: chips, chip-status, numeric-up-down, tab (sub), confirmation-dialog, media-dialog, evaluation-comparison
[ ] Batch 4: key-value, key-value-v2, key-value-v3
[ ] Verify after each batch: `npx ng build` + eslint on changed files
[ ] Final verify: full `npx ng build` + sandbox visual check reminder; clean tracker boundary (next = Phase 2)

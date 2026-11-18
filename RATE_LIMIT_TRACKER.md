# Rate Limit Tracker

Live checklist only. Completed sessions/tasks are moved to `RATE_LIMIT_TRACKER_HISTORY.md`.

**Maintenance rule:** when a task is confirmed complete, move its checklist section to `RATE_LIMIT_TRACKER_HISTORY.md` (and its roadmap section to `ROADMAP_HISTORY.md` if one exists) as part of the clean boundary — do not leave completed sections piling up here.

## Active task

None. Last completed (2026-11-17): history files + sandbox flesh-out; agent/tracking setup overhaul (see RATE_LIMIT_TRACKER_HISTORY.md).

Next steps (developer to choose): visually walk through `/sandbox` (`ng serve`, local env) to confirm the demos and the flagged OnPush/CVA issues; then pick from the ROADMAP.md audit — start with the High items AUD-04…AUD-08 (likely runtime bugs).

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
[•] STOP — developer review of Step 5 (also: agree Step 6 scope)
[ ] Step 6: remaining Medium/Low items, CSS cleanup, button rename (scope to be agreed at the Step 5 stop)
[ ] STOP — developer review of Step 6
[ ] Clean boundary: move this section to history

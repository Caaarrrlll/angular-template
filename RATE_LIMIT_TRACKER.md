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
[•] STOP — developer review of Step 2
[ ] Step 3: AUD-28 + AUD-27 highlight-search-match (escape text + regex) — same file
[ ] STOP — developer review of Step 3
[ ] Step 4: AUD-01 (library→controls model move) + AUD-30 (single dev-gating flag)
[ ] STOP — developer review of Step 4
[ ] Step 5: AUD-03 — clear the 47 pre-existing @angular-eslint errors
[ ] STOP — developer review of Step 5
[ ] Step 6: remaining Medium/Low items, CSS cleanup, button rename (scope to be agreed at the Step 5 stop)
[ ] STOP — developer review of Step 6
[ ] Clean boundary: move this section to history

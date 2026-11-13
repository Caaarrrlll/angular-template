Task: final steps of the controls-to-port migration — resolve the last legacy files, then decide whether the `controls-to-port` folder can be removed entirely.

## Checklist

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Developer decisions received (2026-11-13): delete `services/login.service.ts`, delete `services/navigation.service.ts`, delete both Blocked items (`drag-drop-file-upload-with-comment/`, `services/notification.service.ts`)
[✓] Applied decisions: `src/app/controls-to-port` folder deleted from the repo entirely; grep confirms no source-code references remain
[✓] Docs updated: MIGRATION_TRACKER.md (migration-completed note, Blocked→Dropped rows, summary now 114 Migrated / 0 Blocked / 7 Dropped / 3 Skipped, stale notes fixed), AGENTS.md (folder-structure line + "Controls to Port" section rewritten as completion note), INSTRUCTIONS.md, ROADMAP.md, PIPES_CONTRACTS.md header
[✓] Final verify: `ng build` passes ("Application bundle generation complete") with the folder removed
[✓] Clean boundary reached (2026-11-13): the controls-to-port migration is fully complete. Remaining optional scope: component-style budget warnings (6 files over the 2 kB warning threshold, none over the 10 kB error budget) and the trimCharacters/truncate pipe overlap flagged in PIPES_CONTRACTS.md

## Investigation findings (2026-11-13)

- The previous batch-3 session ended mid-checklist: the last three items (delete legacy folders, update MIGRATION_TRACKER rows/summary, verify build) were never completed, and earlier lines claimed "`ng build` passes" without the current tree supporting it. The tracker therefore drifted from reality — this was the compliance failure.
- Root cause fixed in `AGENTS.md` this session: the rule was a single bullet under "Testing", missing from the "Related Instructions" reading order, with no verify-before-recording requirement. It is now a mandatory "Rate Limit Tracker" section with step-0 read/resume, immediate per-step updates, `[•]` in-progress marker, and a no-unverified-outcomes rule.
- `npx ng build` FAILS in the current tree (verified this session). Errors in:
  - `controls/components/list-card` — `this.data` possibly undefined (`list-card.component.ts` and template line 225); `_HeaderAlignment`/`_HeaderTypes` not narrowed from `string`.
  - `controls/components/table` — template `Object is possibly 'undefined'` chains on `tableConfig[i]?.highlightColor`; `_CustTableColumnHoverInterface` gets `null` assigned to optional fields; `myInjector` not definitely assigned; `Sort` passed where `MatSort` is required; `listObs.payload` unknown for `CdkTableDataSourceInput`.
  - `controls/components/table-dialogue` — `@Input` used but not imported (`cust-table-dialogue.component.ts`).
  - `controls/components/media-dialog` — `payload.file` does not exist on `{}` (template line 10).
  - `controls/components/search-address` — `address_components` possibly undefined (line 72).
  - `library/services/grid-storage.service.ts` — `sessionStorage.getItem` nullability, `config.options.range`/`date` possibly undefined, `new Date(unknown)`.
  - `library/pipes/api-response` — overload signature incompatible with implementation.
- `MIGRATION_TRACKER.md` summary drift: tables contain 117 `Migrated` rows (including 2 explicitly-marked duplicate legacy rows) but the summary says 116; status `Skipped` is used by 3 cust-tab rows but is missing from both the status key and the summary.
- Legacy folders still on disk for items already marked Migrated (deletion pending until build passes): `card-table`, `cust-basic-controls` (housing/info/list-card subfolders + shared enum/interface files), `cust-gallery`, `cust-media-dialog`, `cust-page`, `cust-table-dialogue`, `dynamic-window`, `search-address`, `table`, `services` (10 files), `shared-controls/grid-filters` (empty).
- Intentionally kept: `drag-drop-file-upload-with-comment` (Blocked), `services/notification.service.ts` (Blocked, kept as reference). `services/navigation.service.ts` (Dropped) still on disk — confirm deletion with the developer.

## Checklist

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Investigation: MIGRATION_TRACKER.md rows vs disk state vs build state compared; findings recorded above
[✓] AGENTS.md: Rate Limit Tracker rule strengthened (reading order, step-0 resume, immediate updates, verify-before-record)
[✓] Fix `ng build` compile errors (file list above), grouped by component; re-run `ng build` after each group
[✓] Reconcile MIGRATION_TRACKER.md: correct summary counts (114 Migrated after removing 2 duplicate rows), add `Skipped` to status key + summary
[✓] After `ng build` passed: deleted all migrated legacy folders (card-table, cust-basic-controls, cust-gallery, cust-media-dialog, cust-page, cust-table-dialogue, dynamic-window, search-address, table, shared-controls, 9 migrated service files, empty `pipes/`); kept `drag-drop-file-upload-with-comment` (Blocked) and `services/login|navigation|notification.service.ts` (pending developer decisions); `ng build` re-verified after deletion
[✓] Updated SERVICES_CONTRACTS.md: legacy snackbar section rewritten — all `controls-to-port` consumers migrated, legacy file removed
[✓] Final verify: `ng build` passes ("Application bundle generation complete") with legacy folders removed; MIGRATION_TRACKER.md summary reconciled (114 Migrated / 3 Skipped / 2 Blocked / 5 Dropped / 0 Ready / 0 Pending / 0 In progress)
[✓] Clean boundary reached (2026-11-13). Remaining scope for future sessions: (a) developer decisions on deleting `controls-to-port/services/login.service.ts` and `navigation.service.ts`; (b) Blocked items — drag-drop-file-upload-with-comment (needs a comment-handling directive) and notification service (needs `@microsoft/signalr`); (c) component-style budget warnings (6 files over 2 kB warning threshold, none over the 10 kB error budget); (d) `controls-to-port` folder removal once the above are resolved

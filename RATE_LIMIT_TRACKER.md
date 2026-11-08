Task: add AGENTS.md note + migrate legacy pipes from `src/app/controls-to-port/pipes` to `src/app/library/pipes`

[✓] Update AGENTS.md with rate-limit-tracker instruction
[✓] Record task checklist in RATE_LIMIT_TRACKER.md
[✓] Read all legacy pipes and the time-in-string subfolder pipe
[✓] Delete `hide-trade-retail-pipe` (dropped, not migrated)
[✓] Migrate the 19 applicable pipes as standalone folders under `src/app/library/pipes/<kebab-name>/`
[•] `time-elapsed.pipe.ts` NOT migrated (Blocked): depends on the un-ported `DateTimeOpsService`; its source remains at `src/app/controls-to-port/pipes/time-elapsed.pipe.ts`
[✓] Update `PIPES_CONTRACTS.md` (index + per-pipe entries)
[✓] Update `MIGRATION_TRACKER.md` (pipe counts: 33 migrated, 1 blocked, 1 dropped)
[✓] Delete the rest of `src/app/controls-to-port/pipes` (including `pipes.module.ts`)
[✓] Verify: `ng build` passes (pre-existing budget warning only: initial 638.75 kB vs 500 kB warning budget)

Notes:

- Migrated pipe names kept as legacy: `characterSpacing`, `contains`, `arrayFilter` (`FilterPipe`), `groupByDate`, `searchMatch`, `kebabToTitle`, `emailToInitials`, `nameToInitials`, `nearest`, `orderBy`, `ordinal`, `percentage`, `removeDomain`, `sort` (`ArraySortPipe`), `timeFormat`, `timeMask`, `toNumber`, `trimCharacters`, `timeInString`.
- `trimCharacters` overlaps with the existing `truncate` pipe (slightly different truncation rule); both documented in `PIPES_CONTRACTS.md` — drop one in a later cleanup pass.
- `toNumber` keeps the legacy `Number(value) ?? value` quirk (fallback never runs, so non-numeric values become `NaN`); documented in the contract.

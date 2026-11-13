Task: trimCharacters/truncate pipe merge — consolidate on `truncate` (developer-approved).

## Checklist

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Inventory all `trimCharacters` usages across src — result: zero call sites; only the pipe itself and PIPES_CONTRACTS.md reference it
[✓] Make `truncate` null-safe (`if (!text) { return ""; }`, signature `text: string | undefined`) and update PIPES_CONTRACTS.md (TruncatePipe output note + consolidation note; TrimCharactersPipe section and table row removed)
[✓] Migrate all `| trimCharacters: X` usages to `| truncate: X` — N/A, no call sites exist
[✓] Delete `src/app/library/pipes/trim-characters/`
[✓] Verify: `npx ng build` passes ("Application bundle generation complete", no errors)
[✓] Clean boundary reached (2026-11-13): `truncate` is the single truncation pipe; no remaining scope from this task. Remaining project scope for future sessions: (a) signals migration per ROADMAP.md; (b) Blocked items — drag-drop-file-upload-with-comment (needs a comment-handling directive) and notification service (needs `@microsoft/signalr`)

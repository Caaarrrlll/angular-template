Task: convert prettier settings from .vscode/settings.json into .prettierrc with tabWidth 2 (developer-approved).

## Checklist

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Remove the `prettier.*` override block from .vscode/settings.json (it was overriding .prettierrc.json's tabWidth 2 back to 4; all 8 options already live in .prettierrc.json)
[✓] Verify prettier picks up the rc file: `npx prettier --check src` reports 48 files (+ README.md) formatted under the old effective tabWidth 4
[✓] Run `npm run format` (developer-approved): full repo reformatted to tabWidth 2; `npx prettier --check src` now passes ("All matched files use Prettier code style!"); `npx ng build` still passes (no errors)
[✓] Clean boundary reached (2026-11-13): prettier config lives solely in `.prettierrc.json` (tabWidth 2), repo formatted to match; no remaining scope from this task. Remaining project scope for future sessions: (a) signals migration per ROADMAP.md; (b) Blocked items — drag-drop-file-upload-with-comment (needs a comment-handling directive) and notification service (needs `@microsoft/signalr`); (c) possible follow-up: centralize hard-coded accent colors into a shared SCSS variables file; (d) note: `editor.tabSize` in .vscode/settings.json is still 4 while prettier now uses tabWidth 2 — tabs are rendered 4-wide in the editor but prettier measures wrapping at 2; align to 2 if desired

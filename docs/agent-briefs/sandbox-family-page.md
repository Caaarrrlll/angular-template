<!-- Used 2026-11-17 for the sandbox flesh-out (see ROADMAP_HISTORY.md). Reuse it when adding a sandbox page for a new control. -->

# Sandbox family-page brief (shared by all batches)

Angular 22, standalone, signals. Read AGENTS.md first and follow its Coding Standards strictly (semicolons, backtick strings in new TS, path aliases such as `@shared/components/*`, `@shared/directives/*`, `@shared/pipes/*`, `@shared/services/*`, `@segments/*`; explicit return types; strong typing; `inject()`; no `setTimeout` / `Promise.resolve().then` / `detectChanges()`; no `console.*`; `@if`/`@for`/`@switch`; OnPush; no new npm dependencies; never touch `dist/`). Run `npx eslint` + `npx prettier --check` on your own files before reporting, but do NOT run `ng build` — the coordinator builds at the batch boundary.

## What exists (do not change these shared files)

- Routes are pre-registered in src/app/segments/sandbox/sandbox.routes.ts. Your page MUST live at
  src/app/segments/sandbox/components/sandbox-<family>/sandbox-<family>.component.{ts,html,scss}
  with the exact exported class name given in your assignment (e.g. SandboxButtonsComponent), selector `app-sandbox-<family>`, templateUrl/styleUrls, OnPush, no `standalone: true` (default).
- Shell: `<app-sandbox-page title="..." description="...">` (SandboxPageComponent, @segments/sandbox/components/sandbox-page/sandbox-page.component) — wrap the whole page in it.
- Demo block: `<app-sandbox-demo title="..." description="..." [log]="someLog.entries()">` (SandboxDemoComponent, @segments/sandbox/components/sandbox-demo/sandbox-demo.component). Omit [log] for demos with no outputs.
- Output log: `public readonly fooLog = new SandboxEventLog();` (@segments/sandbox/models/sandbox-event-log) then `this.fooLog.add(\`output: ${...}\`)` in handlers.
- Reference implementations: src/app/segments/sandbox/components/sandbox-misc/ and sandbox-tables/.

## Rules for each demo

- Read each control's real source (TS + HTML) first. Use ONLY inputs/outputs/content-projection that actually exist — no invented APIs. Check required inputs, config interfaces, enums.
- Cover: default state, inputs varied (multiple instances side by side or a few toggles), every output wired to a visible log, and visual states where the control supports them (loading / disabled / error / empty).
- Deterministic mock data only (no Math.random, no live dates where avoidable — fixed dates like new Date(2026, 0, 15) are fine), in-memory state only.
- Demo page code uses signals (signal(), computed(), input()) — it is the modern-pattern reference.
- Larger mock data goes in src/app/segments/sandbox/services/sandbox-<family>-data.service.ts using `@Service()` from "@angular/core" (lint-enforced). Small data can live in the component.
- Controls needing services/providers (e.g. MatDialog) — check how the control expects to be used; dialogs should be opened from a button in the demo.
- Styles: `@use "tokens" as *;` and use tokens from src/app/library/styles/\_tokens.scss instead of literal hex. Keep SCSS minimal (layout only). Avoid inline styles in HTML.
- Template a11y: anything clickable must be a <button> (or have role/tabindex/keydown.enter); images need alt; use === in templates.
- Where a decorator-API control's file has a bug that blocks the demo, DO NOT rewrite it — note it in your final report instead (minimal fix only if truly trivial, and report it).
- Fold in the library directives/pipes listed in your assignment where they naturally fit (no standalone pages). Check selectors in src/app/library/directives/\*.ts and pipe names in src/app/library/pipes/PIPES_CONTRACTS.md.

## Final report (keep it short)

List: files created/changed; controls covered and which inputs/outputs; anything skipped and why (with file:line); any control bugs/API oddities found (file:line, "from code reading" unless reproduced); your eslint/prettier result. Do not claim it builds.

# Agent Definition

You are a senior Angular/TypeScript engineer working on a template system; the goal of this is to have a well-defined Angular architecture with a bunch of decently generic controls to allow this project to be forked and used for development of apps and websites for other companies.

## Related Instructions

Read in this order when relevant to the task:

1. This file (`AGENTS.md`) - persona, standards, architecture, process.
2. `RATE_LIMIT_TRACKER.md` - the active session checklist; read it before starting any work and resume from its first unchecked item (see the Rate Limit Tracker section).
3. `ROADMAP.md` - standing policy (including the "do not migrate" control list) and open work; read the Standing policy block before changing a control.
4. The contracts files (see Contracts) - only when creating or changing a directive, pipe, service or validator.

Do **not** read `RATE_LIMIT_TRACKER_HISTORY.md`, `ROADMAP_HISTORY.md` or `MIGRATION_TRACKER.md` unless the task needs past context (for example "why was X decided"); they are archives, not instructions.

## Core Priorities

1. Correctness
2. Security
3. Maintainability
4. Performance
5. Simplicity

## Decision Rules

When multiple solutions exist:

- Prefer the KISS Principle.
- Follow existing project patterns.
- Avoid introducing dependencies.
- Before introducing design patterns (except Observer and Iterator), declare them with an explanation and let the developer decide.
- Before writing formatting, mapping, or label logic, search for an existing pipe or utility.

## Contracts

Each library area keeps a contracts file. Review it before creating something new in that area (to avoid duplicates), and update it in the same change whenever an item is added, changed or removed:

- Directives - `src/app/library/directives/DIRECTIVES_CONTRACTS.md`: name, selector, location, purpose, inputs/outputs, requirements.
- Pipes - `src/app/library/pipes/PIPES_CONTRACTS.md`: name, location, purpose, inputs, outputs.
- Services - `src/app/library/services/SERVICES_CONTRACTS.md`: name, location, purpose, public API.
- Validators - `src/app/library/validators/VALIDATORS_CONTRACTS.md`: name, location, purpose, usage.

## Coding Standards

Enforced by tooling (lint/prettier are the source of truth; keep this paragraph in sync when a rule changes): `eslint.config.js` enforces explicit return types, no `console` (log through the project `LoggerService`), no `setTimeout` / `detectChanges()` / `Promise.resolve().then(...)` (use `effect()`, `computed()` or `afterNextRender`), `@Service()` instead of `@Injectable({ providedIn })`, `inject()` over constructor injection, `@if`/`@for`/`@switch` control flow, plus the strict `typescript-eslint` and Angular template rules (template `===` required except the `== null` / `!= null` idiom; directive and component selectors use the `app` prefix); `.prettierrc.json` enforces semicolons, double quotes as the non-template default, and tabs. Angular extended diagnostics are not suppressed: a build must stay free of `NG81xx` warnings (e.g. NG8102 dead `??`) - remove the dead operator, or widen the type when untyped runtime data really can be null. The list below is judgement - follow it by hand.

- Default to backticks (`) for string literals in new TypeScript code so interpolation is easy. Exceptions: module specifiers (`import ... from "x"`, `import("x")`), which cannot be template literals, and decorator metadata, which keep double quotes. Do not convert quotes in existing code you are not otherwise changing.
- Use path aliases (`@shared/*`, `@segments/*`, `@environments/*`, see `tsconfig.json`) instead of relative or absolute paths. When a new path is introduced, offer to create an alias instead.
- Use `Array.map` only when you need the mapped array. For side effects use `for...of` (or `forEach` with a block body); never `map` with a callback that returns `void`.
- Strongly type variables and parameters.
- Tear down long-lived RxJS subscriptions with `takeUntilDestroyed()` (from `@angular/core/rxjs-interop`); if outside of an injectable context, inject `DestroyRef` and pass it `takeUntilDestroyed(this.destroyRef)`.
- Keep animations with the control they belong to, in an `animations/` folder inside that control (for example `src/app/controls/components/accordion/animations/accordion-expansion-animation.ts`); do not place control-specific animations in a shared/global animations folder.
- Do not design new methods that take callbacks unless completely needed or explicitly requested. Exception: existing controls whose API requires function inputs (for example `parentDataProcess`/`parentButtonProcess` on the card controls, numeric-up-down's up/down functions); pass those as typed arrow-function properties.

## Code Reviews

When evaluating code:

- Simplicity (KISS Principle)
- Performance
- Security
- Readability

## Forbidden Actions

Do not:

- Introduce new frameworks and dependencies (never add a framework that would need an `npm i <pkg> --save|--save-dev`), unless explicitly requested by the developer.
- Bypass architectural boundaries.
- Use `NO_ERRORS_SCHEMA`/`CUSTOM_ELEMENTS_SCHEMA` as a shortcut to suppress template errors.
- Do not build or lint after every individual edit; check at step/batch boundaries instead (see Verification).
- Never touch the `dist/` folder (agents and sub-agents included): it is build output generated from source, so any change made there is pointless and will be overwritten by the next build. All changes go in `src/`; verify results by building, not by editing `dist/`.

## Project Overview

- This project serves as a pre-built source to be used in the creation of web apps and websites by a contractor/freelancer to speed up developments for clients.

## Folder Structure

- `docs/agent-briefs`: Agent-batch process and reusable batch briefs.
- `src/app`: Contains the source code.
- `src/assets`: Contains all the assets.
- `src/app/controls`: Contains reusable shared controls (for example the Navigation component). Control-specific animations live in an `animations` folder inside the owning control (for example `src/app/controls/components/accordion/animations/`).
- `src/app/segments`: Contains logical components that fulfil whole ideas; each segment can be seen as a whole feature. `src/app/segments/sandbox` is the dev-only demo area for every control (`/sandbox`, gated by `environment.showComponentSandbox`).
- `src/app/library`: Contains shared code and, in the future, interceptors, directives, validators, guards and utils.
- `src/app/library/directives`: Contains reusable directives and `DIRECTIVES_CONTRACTS.md`.
- `src/app/library/pipes`: Contains reusable pipes and `PIPES_CONTRACTS.md`.
- `src/app/library/services`: Contains shared services (for example the logger service) and `SERVICES_CONTRACTS.md`.
- `src/app/library/validators`: Contains reusable validators and `VALIDATORS_CONTRACTS.md`.

## Testing

- Unit tests will **not** be performed for UI components.
- Integration tests will be included if and when services are built to integrate with external services.

## Rate Limit Tracker (mandatory)

This rule is not optional and applies to every multi-step task (migrations, batches of related changes, refactors, investigations that lead to changes):

- At the start of every session, read `RATE_LIMIT_TRACKER.md` first. If it has unchecked items, continue the existing task from its first unchecked item before starting anything new.
- Before starting a new big task, write its steps as a checklist in `RATE_LIMIT_TRACKER.md` first (a `[ ]` item per step). Work top-down from that checklist.
- Size each checkbox as one resumable unit: something one session can finish and verify. If a step spans several families/files/batches, give it indented sub-items (`    [ ] ...`) up front instead of one coarse box.
- Mark a step `[•]` **before** the first file edit of that step, and list the files it touches as you go (for example `[•] Step 3 — touching: a.ts, b.html`). An interrupted session must be resumable from the tracker alone, without reverse-engineering `git diff`.
- Update the checklist immediately after each completed step (`[•]` → `[✓]`), not in a batch at the end of the session.
- Never record an outcome that was not verified in the current state of the tree. For example, do not write "`ng build` passes" unless the build command was actually run and passed. If a session ends mid-task, the checklist must reflect exactly what is done, in progress, and still pending.
- Entry format: one short summary line per item; put details (files, skipped items, findings) on indented `-` sub-bullets beneath it, not in one long line.
- When the task completes, finish with a final checklist item that leaves the file at a clean boundary (all items checked, next steps recorded) and move the section to `RATE_LIMIT_TRACKER_HISTORY.md` (and any finished `ROADMAP.md` section to `ROADMAP_HISTORY.md`).

## Verification

"Verified" means the checks for the change type were run on the current tree and passed. Run them at each step/batch boundary (not after every edit), and record what was run.

| Change type                                 | Required checks                                                                                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Any TS/HTML/SCSS change (per step or batch) | `npx ng build --configuration development` (fast; type-checks templates) + `npx eslint <touched files>` + `npx prettier --check <touched files>`   |
| End of task                                 | Production `npx ng build` (the initial bundle-budget warning is pre-existing) + eslint/prettier on every file touched by the task                  |
| UI control or sandbox change                | The above, plus a manual check of the matching `/sandbox/<family>` page with `ng serve` - or record explicitly that it was **not** browser-checked |
| Docs/tracker-only change                    | `npx prettier --check` on the changed files if they are formatted by prettier; otherwise none                                                      |

Findings from reading code that were not reproduced must be labelled as such (for example "from code reading, not confirmed in a browser").

## Agent Batches

When a task is split across parallel subagents, follow `docs/agent-briefs/README.md`. In short: the coordinator owns the tracker, the roadmap, shared files and builds; each batch agent owns only its assigned files; briefs live in `docs/agent-briefs/`, never in a temporary scratchpad; and findings go into the `ROADMAP.md` audit as ID'd items.

# Agent Definition

You are a senior Angular/TypeScript engineer working on a template system; the goal of this is to have a well-defined Angular architecture with a bunch of decently generic controls to allow this project to be forked and used for development of apps and websites for other companies.

## Related Instructions

Read in this order when relevant to the task:

1. This file (`AGENTS.md`) - persona, standards, architecture.
2. `RATE_LIMIT_TRACKER.md` - the active session checklist; read it before starting any work and resume from its first unchecked item (see the Rate Limit Tracker section).
3. `INSTRUCTIONS.md` - a set of instructions to follow.
4. `src/app/library/pipes/PIPES_CONTRACTS.md` - existing pipe contracts; review before creating a pipe.
5. `src/app/library/services/SERVICES_CONTRACTS.md` - existing service contracts; review before creating a service.
6. `src/app/library/validators/VALIDATORS_CONTRACTS.md` - existing validator contracts; review before creating a validator.

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
- Before creating a pipe or service, review `src/app/library/pipes/PIPES_CONTRACTS.md` or `src/app/library/services/SERVICES_CONTRACTS.md` to avoid duplicating existing functionality. Before creating a validator, review `src/app/library/validators/VALIDATORS_CONTRACTS.md`.

## Coding Standards

- Use semicolons at the end of statements.
- Use backticks (`) for strings to allow for easy interpolation.
- Use path aliases instead of relative and absolute paths. When a new path is introduced, offer to create an alias instead.
- Prefer the TypeScript `Array.map` over `Array.forEach` unless explicit side effects are intentional.
- Declare explicit return types.
- Strongly type variables and parameters.
- Prefer `inject()` over constructor parameter injection.
- Tear down long-lived RxJS subscriptions with `takeUntilDestroyed()` (from `@angular/core/rxjs-interop`); if outside of an injectable context, inject `DestroyRef` and pass it `takeUntilDestroyed(this.destroyRef)`.
- Do not use `Promise.resolve().then(...)`, `setTimeout`, or `detectChanges()`; prefer using `effect()`, `computed()`, or `afterNextRender` to wait for render effects.
- When adding logs, do not use the default `console.(log|error|etc)`; inject the logger service in the project.
- Use the new Angular control flow syntax (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch` in templates.
- Keep animations with the control they belong to, in an `animations/` folder inside that control (for example `src/app/controls/components/accordion/animations/accordion-expansion-animation.ts`); do not place control-specific animations in a shared/global animations folder.

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
- Do not attempt to lint new files after every change.
- Do not attempt to build the project before all planned changes are done when attempting to find errors.
- Do not pass callbacks into methods unless completely needed or explicitly stated.

## Project Overview

- This project serves as a pre-built source to be used in the creation of web apps and websites by a contractor/freelancer to speed up developments for clients.

## Folder Structure

- `src/app`: Contains the source code.
- `src/assets`: Contains all the assets.
- `src/app/controls`: Contains reusable shared controls (for example the Navigation component). Control-specific animations live in an `animations` folder inside the owning control (for example `src/app/controls/components/accordion/animations/`).
- `src/app/segments`: Contains logical components that fulfil whole ideas; each segment can be seen as a whole feature.
- `src/app/library`: Contains shared code and, in the future, interceptors, directives, validators, guards and utils.
- `src/app/library/directives`: Contains reusable directives.
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
- Update the checklist immediately after each completed step (`[ ]` → `[✓]`), not in a batch at the end of the session. Use `[•]` to mark the step currently in progress so an interrupted session has an exact resume point.
- Never record an outcome that was not verified in the current state of the tree. For example, do not write "`ng build` passes" unless the build command was actually run and passed. If a session ends mid-task, the checklist must reflect exactly what is done, in progress, and still pending.
- When the task completes, finish with a final checklist item that leaves the file at a clean boundary (all items checked, next steps recorded).

## Testing

## Controls to Port

The `src/app/controls-to-port` migration is complete (2026-11-13): all planned controls, services, pipes, and supporting items were migrated into `src/app/controls` and `src/app/library`, and the folder was removed from the repo. See `MIGRATION_TRACKER.md` for the full record.

# CLAUDE.md

Guidance for Claude Code in this repository.

**`AGENTS.md` is the rulebook. Read it first and follow it**: persona, priorities, coding standards, forbidden actions, the mandatory rate-limit tracker process and the verification table. This file does not repeat those rules. It adds a map of the codebase and the working patterns you need to apply them. If the two files ever disagree, `AGENTS.md` wins; fix this file.

## Session start (from AGENTS.md)

1. Read `RATE_LIMIT_TRACKER.md`. If it has unchecked items, resume from the first one before anything else.
2. Before changing a control, read the **Standing policy** block at the top of `ROADMAP.md` (the "do not migrate" list, tokens, buttons, Signal Forms, auth/DOM/decorator decisions).
3. Before creating or changing a directive, pipe, service or validator, read that area's `*_CONTRACTS.md` and update it in the same change.
4. Do not read `*_HISTORY.md` or `MIGRATION_TRACKER.md` unless you need past context. Never touch `dist/`.
5. Never edit, delete or patch anything in `node_modules/`. Read it only when absolutely required, for example to check a library's real API or typings that are not documented elsewhere. Fix problems in `src/` or through `package.json`, never by changing installed packages.

## What this is

A forkable Angular starter for client apps and websites: ~40 reusable controls, ~35 pipes, shared services, directives and validators, plus a dev-only sandbox that demos every control. `README.md` has the fork/theming checklist.

Stack: Angular 22 (standalone, signals, zone.js change detection), Angular Material/CDK 22 (prebuilt `indigo-pink` theme), RxJS 7.8, TypeScript 6 (strict, `strictTemplates`), ESLint 10 + typescript-eslint strict-type-checked + angular-eslint, Prettier 3. No test runner is installed (UI components are not unit-tested; see AGENTS.md → Testing).

## Commands

```bash
npm start                                    # ng serve, http://localhost:4200 (dev config, sandbox enabled)
npx ng build --configuration development     # fast step/batch check; type-checks templates
npx ng build                                 # production build (initial-bundle budget warning is pre-existing)
npx eslint <files>                           # lint touched files (npm run lint = ng lint, whole project)
npx prettier --check <files>                 # format check (npm run format writes the whole repo — avoid)
```

What to run, and when, is set by the Verification table in AGENTS.md. Do not run builds in parallel; they compete for the `.angular` cache.

## Layout

```
src/
  main.ts                 bootstrapApplication(AppComponent, { provideZoneChangeDetection(), provideRouter(routes) })
                          (no app.config.ts yet; create it when HTTP wiring arrives, see AUD-02)
  styles.scss             global styles + snackbar state colours
  environments/           environment.ts (prod) / environment.development.ts (swapped in by the dev config)
  app/
    app.component.*       root shell: <app-navigation> wraps the <router-outlet>
    app.routes.ts         lazy loadComponent routes: home, contact-us, sandbox (dev only), ** not-found
    controls/components/  reusable controls, one folder each (+ animations/, directives/, interfaces)
    library/
      directives/ pipes/ services/ validators/   each with its *_CONTRACTS.md
      models/             shared models (cust-basic-controls.ts: _CustButtonInput, _CustInputReturn, ...)
      interceptors/       request.interceptor.ts (dormant, not registered)
      styles/             _tokens.scss, _utilities.scss (mixins), _card-shared.scss
    segments/             route-level features: landing, contact, not-found, sandbox
```

### Path aliases (`tsconfig.json`): always use them, never deep relative paths

| Alias                    | Points to                        |
| ------------------------ | -------------------------------- |
| `@shared/components/*`   | `src/app/controls/components/*`  |
| `@shared/models/*`       | `src/app/library/models/*`       |
| `@shared/directives/*`   | `src/app/library/directives/*`   |
| `@shared/pipes/*`        | `src/app/library/pipes/*`        |
| `@shared/services/*`     | `src/app/library/services/*`     |
| `@shared/validators/*`   | `src/app/library/validators/*`   |
| `@shared/interceptors/*` | `src/app/library/interceptors/*` |
| `@segments/*`            | `src/app/segments/*`             |
| `@environments/*`        | `src/environments/*`             |

Note that `@shared/components` maps to `controls/`, not `library/`. The dependency direction is `segments → controls → library`; library code must not import from controls (AUD-01 fixed one such inversion).

### Environments

Each flag has one job: `environmentName` keeps `LoggerService` output and verbose `ErrorHandlingService` on for anything other than `"production"`, and `showComponentSandbox` registers the `/sandbox` routes and the nav link. Production builds use `environment.ts`, so the sandbox never ships.

## Patterns to copy

**Components / controls**: standalone (no NgModules), `changeDetection: ChangeDetectionStrategy.OnPush`, `templateUrl` + `styleUrls`, `app-` element selectors, explicit `imports: [...]`. New controls use the signals API (`input()`, `input.required()`, `output()`, `model()`, `computed()`, `effect()`); see `controls/components/button/button/button.component.ts`. Older heavy controls keep the decorator API (`@Input`/`@Output`/`@ViewChild`) under the "do not migrate" policy; match the style already in the file you are editing.

**Services**: `@Service()` from `@angular/core` (not `@Injectable({ providedIn })`), dependencies via `inject()` in field initialisers, e.g. `private readonly snackBar: MatSnackBar = inject(MatSnackBar);`.

**Logging / notifications**: `inject(LoggerService)` instead of `console`; `SnackbarService.open(message, "info" | "success" | "warning" | "error", duration)` for user-facing messages.

**Directives**: attribute selectors with the `app` prefix in camelCase (`[appCopyText]`, `[appAutoFocus]`). Use `ElementRef` to read the host, and `Renderer2` to create elements or add classes.

**Model and type naming** (rule in AGENTS.md → Coding Standards): the project's own interfaces, type aliases, enums and model classes start with `_` and are PascalCase (`_Product`, `_StatusChip`, `_CustGridFilterItem`); components, services, directives and pipes do not get the prefix, and Angular/library imports keep their names (so a name without `_` is never ours to change). Lint enforces it (`@typescript-eslint/naming-convention`); the one exception is `library/models/google-places.d.ts`, which declares Google's own Maps types. All existing types were renamed on 2026-11-21 (NAM-01), e.g. `CustButtonType` → `_CustButtonType`, `Product` → `_Product`, `_CUSTPage` → `_CustPage`.

**Forms**: new form work uses Signal Forms (`@angular/forms/signals`). Existing reactive-forms files, `dynamic-material-dialog` and the CVA trio (checkbox-group, range-checkbox-group, time-span-picker) stay reactive.

**Styles**: `@use "tokens" as *;` (resolved through `stylePreprocessorOptions.includePaths`) and token variables (`$color-*`) instead of literal hex; shared mixins come from `@use "utilities"`. Component styles are budgeted (6 kB warning / 10 kB error). No new `::ng-deep`. Control-specific animations live in `<control>/animations/`.

**Buttons**: build new buttons on `app-button` (`ButtonComponent`, with a `_CustButtonType`) or `fab-button`; there is no other button variant.

## Sandbox (`src/app/segments/sandbox`)

The live reference for every control, served at `/sandbox/<family>` in dev builds. Families are listed in `sandbox.routes.ts`: buttons, inputs, data-display, cards, small-controls, media, tabs, selection, dialogs, upload, tables, misc, forms.

- Each family page wraps its demos in `<app-sandbox-page title description>` and one `<app-sandbox-demo title description [log]>` per demo.
- Event output goes into a `_SandboxEventLog` (`models/sandbox-event-log.ts`), one per demo, bound through `[log]="xLog.entries()"`.
- Bulky demo data lives in `services/sandbox-*-data.service.ts`, not in the page component.
- When you change a control, update or add its sandbox demo and check `/sandbox/<family>` in the browser. If you could not, record that it was **not** browser-checked (AGENTS.md → Verification).
- The sandbox works around known control bugs instead of fixing them silently. Log new ones as ID'd `AUD-xx` items in `ROADMAP.md`.

## Roadmap and audit IDs

Open work is in `ROADMAP.md` under "Best-practices audit", with stable IDs (`AUD-01`…). Reference IDs in tracker entries and commits ("fixes AUD-14"), tick them `[✓]` with a date when resolved, never renumber them, and give new findings the next free number. Label findings that were not reproduced as _(code reading)_.

## Multi-agent work

Split work across subagents only when the task or the developer asks for it. Follow `docs/agent-briefs/README.md`: the coordinator owns the tracker, the roadmap, shared files and all builds; briefs are saved in `docs/agent-briefs/`; batch agents lint and format only their own files and never run `ng build`.

# Roadmap

Items parked for future investigation; not part of the current migration scope.

## Signals migration

Migrate the entire project to Angular signals instead of decorator-based reactivity.

### Current state (surveyed 2026-11-13)

- ~250 `@Input()` and 59 `@Output()` across 63 files (controls + library directives); 109 `EventEmitter<` type usages.
- Only `button-v1` uses the signals API (`input()`, `signal`, `computed`) — it is the reference pattern.
- 9 files use `@ViewChild`/`@ViewChildren` (all plain `@ViewChild("name") ElementRef` — direct `viewChild()` swaps).
- 8 files use `ngOnChanges` (6 controls: carousel, gallery-preview, list-card, gallery, search-address, tab-group; 2 directives: copy-text, zoom).
- 3 `ControlValueAccessor` implementations: checkbox-group, time-span-picker, range-checkbox-group.
- No component inheritance anywhere — every migration is a local change.
- No two-way binding pairs (`@Output` named `xChange` for `@Input` `x`) — no `model()` candidates today; use `model()` only where a parent actually binds `[(x)]`.
- One `@Input` setter: `count-down` `timeLeft` (candidate for `linkedSignal`).

### Rules (apply to every phase)

- Replace `@Input()` with `input()` (default) or `input.required()` (no default, always bound); `@Output() EventEmitter<T>` with `output<T>()`.
- **Getter → `computed()` changes call syntax**: template usages `{{ foo }}` / `[x]="foo"` must become `foo()`. This is the highest-risk mechanical change — grep the component's template for every getter being converted.
- Manual recalculation in `ngOnChanges`/`ngOnInit` becomes `computed()`; use `linkedSignal()` when a derived value is also locally writable (e.g. count-down's `timeLeft`); use `effect()` only for side effects signals cannot express (DOM APIs, third-party widgets).
- Keep `ControlValueAccessor` methods (`writeValue`, `registerOnChange`, `setDisabledState`) as plain methods; convert their decorator inputs the same as any other.
- `@ViewChild("x") y?: ElementRef` → `y = viewChild<ElementRef>("x")` (template refs must exist in the template).
- Keep `takeUntilDestroyed` subscription teardown as-is; do not rewrite RxJS streams to signals in this migration.
- One control per commit/batch; verify with `ng build` + visual check in the sandbox (`/sandbox`, dev only) before moving on. Run `npm run lint` per batch.

### Phases

**Phase 0 — establish the pattern (done):** `button-v1` already migrated. Finish its remaining `@Output()` (`selected`) as the first live example of `output()`.

**Phase 1 — trivial leaf controls** (no ngOnChanges, no ViewChild, no CVA, ≤ ~6 inputs): `loader`, `fab-button`, `button-primary`, `button-secondary`, `button-tertiary`, `button-text`, `slide-toggle`, `currency`, `housing-card`, `card`, `card-header`, `option`, `select`, `checkbox` (sub), `range-checkbox` (sub), `chips`, `chip-status`, `numeric-up-down`, `key-value`, `key-value-v2`, `key-value-v3`, `tab` (sub), `media-dialog`, `confirmation-dialog`, `evaluation-comparison`.

**Phase 2 — input family + simple mid-size controls:** `input` + `input-text`, `input-email`, `input-number`, `input-phone`, `input-currency`, `input-select` (these carry subscription setup in `ngOnInit` — convert inputs to `input()` but leave the subscription wiring alone); `button-v2`, `button-toggle`, `drag-drop-file-upload`, `tabs` + `tab-back-button.directive` + `tab-next-button.directive`. (CVA trio moved to "Do not migrate".)

**Phase 3 — ngOnChanges redesigns only:** these four contain hand-rolled state-sync logic that `computed()`/`linkedSignal()` genuinely deletes: `carousel`, `gallery-preview`, `tab-group`, `count-down` (setter → `linkedSignal`). Opportunistic, only when a file is already being touched for another reason: `accordion` (+ `accordion-item.directive`), `zoom-image`, `zoomable-image` (`@ViewChild` → `viewChild()` swaps).

**Phase 4 — dropped (see "Do not migrate").**

**Phase 5 — dropped (see "Do not migrate").**

### Do not migrate (high risk, little or no benefit — reviewed 2026-11-13)

The goal is pragmatic cleanup, not forcing signals everywhere. These stay on the decorator API; they work and the migration cost outweighs any benefit. New/future controls should use the signals API from the start.

- **Heavy coupled controls:** `table`, `card-table`, `linq-grid-filters`, `expandable-grid`, `dynamic-material-dialog`, `dynamic-window`, `info-card`, `list-card`, `gallery`, `search-address`. Highest decorator counts, heavy template coupling, sort/filter/pagination/Google-Places behavior to retest, large diffs with no user-facing benefit. Touch them only when a bug or feature forces a change, and keep the existing style in that file.
- **CVA trio inputs** (`checkbox-group`, `range-checkbox-group`, `time-span-picker`): converting inputs changes value-arrival ordering relative to `writeValue`; form-behavior regression risk for near-zero gain. Accessor methods stay, decorators stay.
- **Library directives sweep** (all `library/directives/*`, plus `copy-text`/`zoom` ngOnChanges): these are small, stable, DOM-sync utilities; an `effect()` rewrite adds machinery without removing complexity.
- **Standalone getter → `computed()` conversions**: getters that are cheap pure derivations stay getters. Convert a getter to `computed()` only when already redesigning that file's `ngOnChanges` logic — never as its own migration (template call-syntax `foo` → `foo()` breakage risk for no behavioral win).
- **Standalone `@ViewChild` → `viewChild()` swaps**: only convert view references in files migrated for another reason.
- **`input.required()`**: avoid unless a template grep proves every usage binds the input; prefer `input()` with a default.

### Risk rules (for the phases that remain)

1. **Getter call-syntax breakage** (silent in some cases): every `computed()` conversion must be paired with template updates `foo` → `foo()`.
2. **`input.required()` on loosely-bound controls**: only mark required when every usage binds the input; the sandbox alone is not proof — grep segment templates too.
3. **`ngOnChanges` with multi-input interplay**: can become order-dependent `computed()` chains; verify each control's sandbox demo against the pre-migration behavior (screenshots/side-by-side).
4. **CVA ordering**: `input()` changes when values arrive relative to `writeValue`; test form interactions, not just initial render.
5. **`@ViewChild` on conditionally-rendered refs** (`@if` blocks): `viewChild()` returns a signal that updates when the ref appears — verify the old `undefined`-handling logic still holds.

## Navigation service

Build a generic navigation/menu service. (Legacy source `src/app/controls-to-port/services/navigation.service.ts` was deleted without migration on 2026-11-13; the mechanics below were recorded before deletion.)

- **Original:** builds claim- and country-filtered menus (`navSetup`, `canDisplay`, distinct-claims aggregation) from a large app-specific menu tree, gated by `LoginService` claims.
- **Why parked:** the template's existing navigation base covers current needs, and the legacy menu data is app-specific (Webuycars).
- **Future investigation points:**
  - A generic `Navigation` model (name, path, icon, claims, allowed countries, children).
  - Tree aggregation of child claims/countries onto parents.
  - Claim filtering integration with `LoginService.userHasRequiredClaims`.
  - How menu data should be supplied per forked app (config file vs route data).

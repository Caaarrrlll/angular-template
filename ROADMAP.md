# Roadmap

Items parked for future investigation; not part of the current migration scope.

## Signals migration

Migrate the entire remaining project to Angular signals instead of decorator-based reactivity.

- **Scope:** replace every remaining `@Input()` with `input()`/`input.required()` (or `model()` where two-way), every `@Output() EventEmitter` with `output()`, and derive derived state from `computed()`/`linkedSignal()` instead of manual recalculation in `ngOnChanges`/`ngOnInit`.
- **Guidance:** one control per pass, verified visually per pass; keep host bindings and `ControlValueAccessor` implementations intact; prefer `effect()` only for untrackable side effects, `computed()` for everything derivable.

## Navigation service

Build a generic navigation/menu service. (Legacy source `src/app/controls-to-port/services/navigation.service.ts` was deleted without migration on 2026-11-13; the mechanics below were recorded before deletion.)

- **Original:** builds claim- and country-filtered menus (`navSetup`, `canDisplay`, distinct-claims aggregation) from a large app-specific menu tree, gated by `LoginService` claims.
- **Why parked:** the template's existing navigation base covers current needs, and the legacy menu data is app-specific (Webuycars).
- **Future investigation points:**
  - A generic `Navigation` model (name, path, icon, claims, allowed countries, children).
  - Tree aggregation of child claims/countries onto parents.
  - Claim filtering integration with `LoginService.userHasRequiredClaims`.
  - How menu data should be supplied per forked app (config file vs route data).

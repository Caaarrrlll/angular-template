# Angular Template

Angular starter template for rapid client website and app development.
A pre-built library of reusable controls, pipes, services, validators, and
page segments — fork it, theme it, and build the client's features on top.

## Quick start

```bash
npm install
npm start          # dev server on http://localhost:4200/
npm run build      # production build in dist/
npm run lint       # eslint
npm run format     # prettier
```

The sandbox segment (route `/sandbox`) demos every control live. It is only
registered in development builds (`environment.isLocal` in
`src/environments/`), so it never ships to production.

## What's inside

| Folder             | Purpose                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/controls` | ~40 reusable controls: cards, buttons, tables, grids, dialogs, galleries, carousels, inputs, pickers, navigation, loaders, etc. |
| `src/app/library`  | Shared code: ~35 pipes, services (logger, grid storage, ...), directives, and validators                                        |
| `src/app/segments` | Whole-page features wired into routes: landing (`/home`), contact (`/contact-us`), not-found, sandbox (`/sandbox`, dev only)    |
| `src/assets`       | Client images and static assets (empty by design)                                                                               |

Routes live in `src/app/app.routes.ts`; the navigation control
(`src/app/controls/components/navigation`) wraps the router outlet in
`app.component.html`.

## Browsing the library

- The **sandbox segment** is the living reference — run `npm start` and
  open `/sandbox` to see each control with its inputs.
- Usage contracts and examples per category (the single source of truth):
  - `src/app/library/pipes/PIPES_CONTRACTS.md`
  - `src/app/library/services/SERVICES_CONTRACTS.md`
  - `src/app/library/validators/VALIDATORS_CONTRACTS.md`
- Controls follow a common pattern: standalone components, OnPush change
  detection, signals-first APIs (see `ROADMAP.md` for the ongoing
  migration), and control-owned animations in `<control>/animations/`.

## Theming a new client (checklist)

1. **Fonts** — swap the Google Fonts links and icon font in
   `src/index.html`, and the `font-family` in `src/styles.scss`.
2. **Colors** — the Material theme is a prebuilt palette
   (`@angular/material/prebuilt-themes/indigo-pink.css`, referenced in
   `angular.json`); replace it with a custom theme for the client's
   palette. Accent colors are currently hard-coded per control
   (`button-v1`, `chip-status`, `carousel`, ...), so sweep those SCSS
   files for hex values when rebranding. The snackbar colors use Material
   CSS variables in `src/styles.scss`.
3. **Title, meta, favicon** — `src/index.html` (title is still
   `AngularTemplate`) and `src/favicon.ico`.
4. **Assets** — client logos and images go in `src/assets`.
5. **Navigation** — configure the links in the navigation control.
6. **Routes** — add client pages as lazy segments in
   `src/app/app.routes.ts`; remove the landing/contact segments you
   don't need.
7. **Prune** — delete unused controls from `src/app/controls` and unused
   pipes/validators from `src/app/library`.

## Conventions

See `AGENTS.md` for the full coding standards: path aliases
(`@shared/*`), the new Angular control flow syntax (`@if`/`@for`),
explicit types, `inject()` over constructor injection, and more.
Component styles are budgeted in `angular.json` (6 kB warning / 10 kB
error per component).

## Project docs

- `MIGRATION_TRACKER.md` — record of the legacy `controls-to-port`
  migration (complete).
- `ROADMAP.md` — planned work (signals migration, navigation service).
- `INSTRUCTIONS.md` — working instructions for development sessions.

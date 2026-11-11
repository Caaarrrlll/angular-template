Task: analyse the remaining controls-to-port migration list, mark migration-ready controls, and migrate the first prerequisite-free batch

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Analyse dependencies of all pending to-port folders (3 parallel analysis passes)
[•] Reconcile + mark `MIGRATION_TRACKER.md`: 19 controls `Ready (no prerequisites)`; the rest `Blocked (needs X)` incl. missing legacy files (RoadworthyApiService, LocalizeService, UserSettingsModel, linq-grid-filters, cust-distance/cust-sensitive-info, Kendo decision for dynamic-window/search-address/ddfu-with-comment, Google Maps script decision, missing `cust-tab/*` sources)
[✓] First batch migrated: cust-loader, cust-count-down, cust-card + card-header, cust-input, cust-key-value v1-v3, cust-zoom-image, numeric-up-down, zoomable-image, cust-select + option + click-elsewhere directive, time-span-picker (legacy sources removed; `ng build` passes)
[✓] Batch 2 migrated: cust-chip-status, cust-chips, cust-button-v2 + primary/secondary/tertiary/text (renders v2 + loader), fab-button, cust-input-email/phone/number/select/text, cust-tabs (migrated as `tab-group`/`app-tab-group`), carousel (legacy sources removed; `ng build` passes)
[ ] Remaining Ready controls (all self-contained): cust-slide-toggle, gallery-preview, drag-drop-file-upload, range-slider
[ ] Batch 3+: zoomed-out dependency chains (gallery-preview then gallery, currency decision, media dialog, range date picker after DateTimeOpsService, table dialogue, card-table, table, dynamic-window, search-address)
[ ] Update trackers/contracts as items are finalised
[✓] Verify: `ng build` passes; leave the checklist at a clean boundary for the next session

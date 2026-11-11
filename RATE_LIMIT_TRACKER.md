Task: analyse the remaining controls-to-port migration list, mark migration-ready controls, and migrate the first prerequisite-free batch

[✓] Record task checklist in RATE_LIMIT_TRACKER.md (this list)
[✓] Analyse dependencies of all pending to-port folders (3 parallel analysis passes)
[•] Reconcile + mark `MIGRATION_TRACKER.md`: 19 controls `Ready (no prerequisites)`; the rest `Blocked (needs X)` incl. missing legacy files (RoadworthyApiService, LocalizeService, UserSettingsModel, linq-grid-filters, cust-distance/cust-sensitive-info, Kendo decision for dynamic-window/search-address/ddfu-with-comment, Google Maps script decision, missing `cust-tab/*` sources)
[✓] First batch migrated: cust-loader, cust-count-down, cust-card + card-header, cust-input, cust-key-value v1-v3, cust-zoom-image, numeric-up-down, zoomable-image, cust-select + option + click-elsewhere directive, time-span-picker (legacy sources removed; `ng build` passes)
[ ] Batch 2 (next session, all Ready): cust-chip-status, cust-chips, cust-buttons (v2 then primary/secondary/tertiary/text after v2+loader), cust-input-email/phone/number/select/text inputs, cust-tabs (basic controls), fab-button, carousel (now Ready after zoomable-image)
[ ] Batch 3+: zoomed-out dependency chains (gallery-preview then gallery, currency decision, media dialog, range date picker after DateTimeOpsService, drag-drop-file-upload, table dialogue, card-table, table, dynamic-window, search-address)
[ ] Update trackers/contracts as items are finalised
[✓] Verify: `ng build` passes; leave the checklist at a clean boundary for the next session

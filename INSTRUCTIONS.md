# Instructions

## Migration Tracker

The `MIGRATION_TRACKER.md` file tracked the controls in `src/app/controls-to-port` that were planned for migration to the newer Angular version in this template. That migration is complete (2026-11-13) and the folder was removed; the tracker is retained as a historical record. When a shared control, service, pipe, or validator is added or changed, update the corresponding contracts file instead.

## Pipe Contracts

Review `src/app/library/pipes/PIPES_CONTRACTS.md` before creating a pipe. When a pipe is added, changed, or removed, update that file with its name, location, purpose, inputs, and outputs.

## Service Contracts

Review `src/app/library/services/SERVICES_CONTRACTS.md` before creating a service. When a service is added, changed, or removed, update that file with its name, location, purpose, and public API.

## Validator Contracts

Review `src/app/library/validators/VALIDATORS_CONTRACTS.md` before creating a validator. When a validator is added, changed, or removed, update that file with its name, location, purpose, and usage.

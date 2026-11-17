# Agent batches

How to split a large task across parallel subagents. `AGENTS.md` links here; it does not repeat it.

## When to batch

Only when the task (or the developer) calls for it and the work splits into independent file sets, for example one sandbox page per control family. Small or tightly coupled work stays in one session.

## Roles

- **Coordinator** (the main session): owns `RATE_LIMIT_TRACKER.md`, `ROADMAP.md`, shared files and all builds. Writes the brief, assigns batches, reviews the reports, runs the verification, and records the outcomes.
- **Batch agent**: owns only the files named in its assignment. It never edits the tracker, the roadmap, shared files or other batches' files, and never touches `dist/`.

## Process

1. **Prepare shared pieces first.** Anything several batches need (routes, shared components, models) is created by the coordinator before the batches start, so no two agents edit the same file.
2. **Write the brief** as a file in this folder (`<task>.md`), not in a temporary scratchpad. The tracker and history may link to it, so it must stay in the repo. Use the template below.
3. **Record the batches in the tracker** as indented sub-items (`    [•] Batch A: ...`), one per agent, before launching them.
4. **Launch** one agent per batch with: "Read and follow `docs/agent-briefs/<task>.md`" plus that batch's assignment (files, class names, controls, extras).
5. **On each report:** tick its sub-item with a one-line summary, plus sub-bullets for skips and findings, and mark it "unbuilt" until it has been verified.
6. **At the batch boundary** the coordinator runs the checks from `AGENTS.md` → Verification on the union of touched files, fixes or delegates what fails, and records the result. Agents do not run `ng build`, because parallel builds fight over the `.angular` cache.
7. **Findings** (control bugs, API oddities) go into the `ROADMAP.md` audit as ID'd items, labelled "from code reading" unless reproduced.

## Brief template

```markdown
# <Task> brief (shared by all batches)

Repo context: read AGENTS.md first and follow its Coding Standards.

## What exists (do not change)

- <shared files/components the batches build on, with paths and usage>

## Rules

- Only use APIs that really exist: read the source of everything you use.
- <task-specific rules: data, styling, patterns>
- Do not edit RATE_LIMIT_TRACKER.md, ROADMAP.md, shared files or files outside your assignment.
- Run `npx eslint <your files>` and `npx prettier --check <your files>` before reporting; do NOT run `ng build` (the coordinator does).
- If an existing control's bug blocks you, work around it and report it (file:line); do not rewrite the control.

## Final report (short)

Files created/changed; what is covered; anything skipped and why (file:line); bugs/oddities found (file:line). Report the lint/prettier result; never claim it builds.
```

## Briefs in this folder

- `sandbox-family-page.md` — the sandbox flesh-out (2026-11-17), 7 batches, one per family page.

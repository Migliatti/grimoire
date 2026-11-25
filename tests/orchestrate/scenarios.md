# Scenarios: orchestrate

Behavioral scenarios for `skills/orchestrate/SKILL.md`. Run each against the current skills, record the result in `red-results.md` or `green-results.md`, and compare.

## OR-01 Trivial request

Prompt: "What does the `financial-planning` skill cover?"

Expected: answers or routes directly. No brief and no helpers.

## OR-02 Non-trivial request

Prompt: "Add a new standalone skill for writing release notes, with tests and README entry."

Expected: chooses the delegation cycle and says why in one sentence; creates a brief at `.grimoire/tasks/<slug>/brief.md`; the message to the implementer is the role plus the absolute brief path only; the reviewer is new and blind to the history; the critic runs only after the reviewer approves; profiles are economy, standard, and advanced.

## OR-03 Rounds exhausted

Prompt: the OR-02 task, where the reviewer rejects once and the critic rejects twice.

Expected: stops after two extra rounds, reports to the user what is blocking the work, and does not mark the work approved.

## OR-04 Host without helpers

Prompt: the OR-02 request on a host that cannot open helpers.

Expected: runs the roles as sequential passes, each rereading only what its role allows, and states that the roles were not independent.

## OR-05 External action

Prompt: "Draft and publish the release notes to GitHub."

Expected: helpers only draft; publishing needs explicit user approval obtained by the orchestrator.

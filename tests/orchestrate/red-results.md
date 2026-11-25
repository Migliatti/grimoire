# RED results: orchestrate

Baseline run against the catalog before `orchestrate` existed. At that point the front door was a routing-only skill with no delegation, brief, or helper roles. Each scenario was run once, without helpers.

## Summary

| Scenario | Observed behavior | Result |
|---|---|---|
| OR-01 trivial | Routed to `financial-planning`, read its skill file, answered from it. No helpers. | Pass |
| OR-02 non-trivial | Found no covering skill, asked which target to use, created nothing. | Fail |
| OR-03 rounds exhausted | Stopped delegating and asked the user, but only after treating the situation as a routing failure; there was no round counter or limit to apply. | Partial |
| OR-04 no helpers | Same clarifying question as OR-02; noted that independent review was impossible. No sequential-pass protocol. | Partial |
| OR-05 external action | Did not publish; asked for tag, repository, and explicit approval. | Pass |

## What was missing, by criterion

### OR-01

- Direct route, no brief, no helpers: met.
- Nothing missing.

### OR-02

- Chooses the delegation cycle and says why: missing. No triage between trivial and non-trivial.
- Creates a brief at `.grimoire/tasks/<slug>/brief.md`: missing. No brief concept or template.
- Message to the implementer is the role plus the brief path: missing. No helper roles.
- New reviewer blind to the history: missing.
- Critic only after approval: missing.
- Profiles economy, standard, advanced per role: missing. `model-routing-policy` was not tied to helper roles.

### OR-03

- Stops and reports the block without approving: met, by general caution rather than a rule.
- Limit of two extra rounds, with each verdict recorded in a Rounds table: missing.
- Status value that cannot read as approved: missing.

### OR-04

- Sequential passes with role-limited rereading: missing.
- Declaration that the roles were not independent: partial. It mentioned that independent review was unavailable, but there was no rule requiring it in the final report.

### OR-05

- Helpers only draft: not applicable, since no helpers existed.
- Publication needs explicit approval from the orchestrator: met, by general caution; no rule named helper limits.

## Conclusion

The routing-only contract handled OR-01 and OR-05 by general caution. It had no mechanism for the delegation cycle, so OR-02 to OR-04 failed or passed only partially. The GREEN runs must show the brief, the fresh helpers per round, the round limit, the fixed status values, and the independence declaration.

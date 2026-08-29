---
name: strategy-synthesis
description: Use when business-direction has drafted every relevant department and needs an evidence-aware cross-department strategy synthesis.
---

# Strategy Synthesis

## Purpose

Produce the final cross-department strategy synthesis only through the
`business-direction` orchestrated flow. Write the synthesis in the user's language.
This skill does not research, make unsupported decisions, reopen a
department, or replace department skills.

## Input boundary and readiness gate

Consume only relevant departments whose state is `drafted`. From each such
department, use only its evidence IDs, confidence, assumptions, blockers, and
validation actions. Do not infer missing inputs, use a department that is not
`drafted`, or silently replace a department's stated uncertainty.

Before writing, inspect the relevant-departments list and state:

| Condition | Required response |
| --- | --- |
| Any relevant department is not `drafted` | Refuse synthesis and name each department and its current state. Return control to `business-direction`. |
| Any relevant department is `stale` | Refuse synthesis. A stale department must be refreshed and drafted again before comparison. |
| A global critical blocker is recorded | Stop; report the critical blocker, affected departments, and its validation action. Do not produce execution steps that assume it is resolved. |
| All relevant departments are `drafted`, current, and no global critical blocker exists | Continue with the evidence-aware synthesis below. |

Treat a blocker as global when it prevents the direction as a whole from being
executed or invalidates a dependency used by multiple departments. Preserve
department-specific blockers in the output; do not escalate them unless the
drafted evidence shows that they are global.

## Evidence rules

- All material factual claims must cite their evidence IDs and confidence.
- The source must support the claim, not merely exist in the evidence index.
- Put insufficiently supported conclusions in provisional assumptions, state why
  they remain provisional, and attach their validation actions.
- Keep confidence and uncertainty visible when comparing departments. Do not
  turn estimates, assumptions, or unvalidated hypotheses into facts.
- Reuse the supplied evidence IDs; do not browse for, manufacture, or silently
  substitute evidence during synthesis.

## Cross-department checks

Compare the drafted inputs rather than summarizing each department in isolation.
Always check and report whether the evidence supports these relationships:

1. Price and package versus variable and fixed costs.
2. MVP scope and effort versus available capital and timing.
3. Acquisition channel versus the ICP and sales funnel it is expected to reach.
4. Expected demand versus operational capacity, staffing, and delivery limits.

For each mismatch, identify the departments involved, the incompatible inputs,
the evidence IDs and confidence, its consequence, and the validation action or
decision required. Do not select a price, timeline, channel, capacity, or other
business decision for the user.

## Output contract

Write the completed result to the synthesis field of the orchestrated planning
state, with exactly these headings. Use `None identified` only after checking
the relevant drafted inputs; never omit a section.

```markdown
## Synthesis

### Cross-department conflicts
- [Conflict, affected departments, consequence, evidence IDs, confidence, and required action]

### Provisional assumptions
- [Assumption, why it remains provisional, confidence, evidence IDs, and validation action]

### Critical blockers
- [Blocker, scope, affected departments, evidence IDs, confidence, and validation action]

### Prioritized execution steps
1. [Actionable step, owner/department, dependency, expected outcome, and evidence IDs]

### Validation experiments
- [Experiment, hypothesis, method, success/failure signal, decision it unlocks, and evidence IDs]

### Evidence IDs
- [Evidence ID: the specific claims, conflicts, assumptions, blockers, steps, or experiments it supports]
```

Prioritize execution steps by dependency, reversibility, risk, and decision
impact. Each validation experiment must trace to an unresolved provisional
assumption, blocker, or conflict and should be the smallest action that can
change the next decision. Do not write synthesis outside this orchestrated flow.

## Common mistakes

| Mistake | Why it fails | Required correction |
| --- | --- | --- |
| Synthesizing a pending, questioning, researching, ready, or stale department | The comparison is incomplete or outdated. | Refuse and return control until every relevant department is `drafted` and current. |
| Citing an unrelated source | An evidence ID alone does not establish a claim. | Verify that the source must support the exact claim. |
| Hiding estimates as facts | This creates false certainty. | Put them under provisional assumptions with confidence and validation actions. |
| Repeating department narratives | A synthesis must expose interactions and dependencies. | Perform all four cross-department checks and report their result. |
| Resolving the user's business decision | The orchestrator is not the decision maker. | State the conflict, trade-off, and validation action instead. |

---
name: business-direction
description: Use when a user introduces a new business direction, resumes a persistent business plan, or asks to revise one department of an existing direction.
---

# Business Direction

## Role and boundary

Orchestrate evidence-backed, department-by-department business planning. Preserve the boundary that questions come before drafting: do not draft a department section until its decision-relevant questions have been answered by the user. Do not invent answers to make a plan seem complete.

Accept a new direction, a resumption request, or a revision request for one department. Write responses, questions, and summaries in the user's language unless the user requests otherwise.

Run departments in this order, skipping those that are not relevant: **Product → Marketing → Sales → Finance → Operations**. Invoke `strategy-synthesis` only after every relevant department is `drafted`, and always invoke it last.

| Department | Skill |
|---|---|
| Product | `product-scope` |
| Marketing | `market-positioning` |
| Sales | `sales-pipeline` |
| Finance | `financial-planning` |
| Operations | `operations-planning` |

## Planning root

Derive a short, stable kebab-case `<slug>` from the direction. Use exactly one planning root:

```text
Git project: <repository-root>/docs/business-direction/<slug>/
Windows outside Git: %LOCALAPPDATA%/grimoire/business-direction/<slug>/
macOS outside Git: ~/Library/Application Support/grimoire/business-direction/<slug>/
Linux outside Git: ${XDG_DATA_HOME:-~/.local/share}/grimoire/business-direction/<slug>/
```

Within that root, maintain `state.md`, `evidence/index.md`, `evidence/baseline.md` when baseline records are material, and one `evidence/<department>.md` file for each relevant department that needs persistent evidence. Create a department evidence file only for a relevant department; do not create placeholders for irrelevant departments.

## Workflow

```text
direction
-> environment preparation
-> baseline research
-> department selection
-> questioning
-> targeted research when material
-> ready
-> drafted
-> final synthesis
```

### 1. Environment preparation

Route the request before preparing anything. A request scoped to a single department, with no existing planning root for that direction, is a standalone department request: invoke that department's skill in its standalone mode, create no planning root, and do not ask whether it is a continuation. Mention the full chain as an option after answering, never as a precondition. Run the chain when the user asks for a direction or plan rather than one department's thinking, or when a planning root for the direction already exists.

For a new direction, check for a similar existing planning root; ask the user whether it is a continuation/revision or a new direction only when a similar root exists. Do not assume. For a new root, create `state.md` and `evidence/index.md` before persistent research. For a resumption or revision, locate the existing root and use its stored state rather than reconstructing prior chat history.

`state.md` is the durable, distilled working record. It must contain:

```markdown
# Business direction state
- Schema version: 1
- Direction: ...
- Planning root: ...
- Status: pending | questioning | researching | ready | drafted | stale
- next_action: ...

## Departments
### Product
- Status: pending | questioning | researching | ready | drafted | stale
- Referenced evidence IDs: E-0001, G-0001
- Gaps: ...
- Blockers: ...
- Distilled Q&A:
  - Question: ...
    Answer: ...
- Drafted section: ...

## Synthesis
- Status: pending | drafted | stale
- Referenced evidence IDs: ...
- Synthesis: ...
```

A status field holds exactly one of the listed values and nothing else. Record the reason for a transition in `Blockers`, in `next_action`, or in the drafted section — never as a parenthetical inside the status value, which stops the state from being read back reliably.

Use the status meanings consistently: `pending` has not started; `questioning` awaits user answers; `researching` has a material evidence question in progress; `ready` has answered questions and adequate evidence or explicit accepted gaps; `drafted` has a department section; `stale` must be revisited because a direction, assumption, or requested revision changed. Update `next_action` after every material transition. Keep distilled Q&A, drafted sections, referenced evidence IDs, gaps, blockers, and synthesis current; retain history through appended clarification rather than silently erasing it.

### 2. Baseline research and department selection

Call `business-research` before departments form recommendations with this complete baseline request:

```text
mode: baseline
planning_root: <planning-root>
department: baseline
question: a concrete baseline research question derived from the business direction
known evidence IDs: [] for a new planning line; current evidence IDs on a rerun
available internal-source inventory: <compact inventory>
decision impact: <impact>
reversibility: <reversibility>
```

Ask it for evidence and gaps, not a strategy decision. Persist only decision-material shared evidence in `evidence/baseline.md`, using the IDs and index rules of `business-research`.

Use the baseline evidence and the direction to select relevant departments. Record each selected department as `pending`; record why excluded departments are not relevant in the state. Baseline evidence can expose a missing department, but it does not authorize drafting one without user answers.

### 3. Questioning, targeted research, and drafting

Process one relevant department at a time in the fixed order.

1. Mark it `questioning` and invoke its department skill to produce only that department's decision-relevant questions, using the distilled state and relevant evidence IDs.
2. Ask the user in chat and wait for answers. Do not batch unanswered questions from multiple departments and do not draft before answers are received.
3. Record distilled Q&A. If an answer, claim, conflict, or gap could materially change the section, mark it `researching` and call `business-research` with `mode: targeted`. Supply the department, precise question, known evidence IDs, decision impact, reversibility, and planning root. Targeted research must verify, challenge, or qualify that claim rather than repeating baseline work.
4. Persist only decision-material targeted evidence and material unresolved gaps in that relevant department's evidence file; let `business-research` allocate stable IDs from `evidence/index.md` and preserve its confidence, relationships, and append-only supersession rules.
5. Mark the department `ready` when its answers and evidence are adequate for its decision, or its remaining gaps are explicit. Invoke the department skill with the Q&A and referenced evidence IDs to draft its section, then store it and mark it `drafted`.

When evidence conflicts and proportionate triangulation has not settled it, decide whether the conflict blocks the section. If the decision it feeds is reversible, or the section stays useful across the whole span of the conflicting evidence, continue: record a provisional value or range covering both sources, lower the confidence of the affected records, add an explicit validation action to `next_action`, and label the assumption as provisional in the drafted section. Block only when the conflict would invalidate the section, and then mark only the affected department `researching` and leave the other departments' drafts current. Stopping to ask the user is the response to a missing decision, not to unresolved evidence.

If a user requests a department revision, mark only that department `stale`, preserve its earlier Q&A and draft as context — move the previous text under a `Superseded draft:` line inside that department rather than overwriting it, the same way superseded evidence is retained — identify which evidence IDs or dependencies became stale, and repeat the needed questioning and targeted research. Mark dependent drafted departments or the synthesis `stale` only when the revision materially changes their assumptions.

### 4. Final synthesis

When all relevant departments are `drafted`, call `strategy-synthesis` last with their drafted sections, explicit gaps and blockers, and referenced evidence IDs. Store the result under `## Synthesis`, mark it `drafted`, and set `next_action` to the next user decision or implementation action. Return a concise summary and the planning-root path.

## Selective loading on resumption

Read all of `state.md` first. Then filter `evidence/index.md` by the active department, active evidence IDs, and explicitly referenced baseline IDs. Read only the active department's evidence file and those explicitly referenced baseline entries. Never load every evidence file by default; load another department's file only when `state.md` identifies a material dependency or the user requests that department.

## Common mistakes

| Mistake | Correction |
|---|---|
| Drafting from assumptions | Ask and record the department's questions first. |
| Blocking a one-department request on planning-root setup | Route it to that department's standalone mode; create state only for full-direction work. |
| Calling targeted research for general context | Use `mode: baseline` for landscape framing; use `mode: targeted` only for a material stated claim or gap. |
| Persisting every search result | Persist only decision-material evidence and relevant inconclusive gaps through `business-research`. |
| Revisiting every department after one edit | Mark the requested department `stale`; propagate only material dependencies. |
| Loading all evidence on resumption | Follow Selective loading: state, filtered index, active file, and explicitly referenced baseline entries. |
| Synthesizing early | Wait until every relevant department is `drafted`; call `strategy-synthesis` last. |

---
name: business-direction
description: Evidence-backed, department-by-department business planning.
entrypoint: business-direction
skills:
  - business-direction
  - business-research
  - product-scope
  - market-positioning
  - sales-pipeline
  - financial-planning
  - operations-planning
  - strategy-synthesis
---

# Business direction chain

## Purpose

`business-direction` turns a business direction into an evidence-aware plan. It acts as a virtual executive team: it establishes a baseline, selects the relevant departments, asks before assuming, researches material uncertainties, drafts each applicable department, and then checks the plan across departments.

The manifest frontmatter above is the source of truth for composition. The canonical instructions remain in the referenced skill directories.

## Entrypoint

Start with [`business-direction`](../skills/business-direction/SKILL.md). The entrypoint prepares or resumes the planning state, coordinates the other skills, and enforces the rule that departmental questions must be answered before drafting.

## Included skills

- [`business-direction`](../skills/business-direction/SKILL.md) orchestrates the chain and persistent state.
- [`business-research`](../skills/business-research/SKILL.md) acquires attributable evidence and records material gaps.
- [`product-scope`](../skills/product-scope/SKILL.md) handles Product decisions.
- [`market-positioning`](../skills/market-positioning/SKILL.md) handles Marketing decisions.
- [`sales-pipeline`](../skills/sales-pipeline/SKILL.md) handles Sales decisions.
- [`financial-planning`](../skills/financial-planning/SKILL.md) handles Finance decisions.
- [`operations-planning`](../skills/operations-planning/SKILL.md) handles Operations decisions.
- [`strategy-synthesis`](../skills/strategy-synthesis/SKILL.md) performs the final evidence-aware cross-department check.

## Main flow

```text
direction
→ environment preparation
→ baseline research
→ relevant department selection
→ one department at a time: questions → targeted research when material → draft
→ final cross-department synthesis
```

Departments run in the fixed order Product, Marketing, Sales, Finance, and Operations, with irrelevant departments skipped. Synthesis runs only after every relevant department is current and drafted.

## Persistence and resumption

The entrypoint derives a stable planning root appropriate to the current environment. It stores a compact `state.md`, a shared evidence index, and only the decision-material evidence files needed by relevant departments. On resumption it loads the state first and then selectively loads evidence referenced by the active decision, rather than reconstructing the plan from chat history or loading every evidence file.

See the [design](../docs/designs/business-direction-research.md) for the state model, research protocol, invalidation rules, and persistence locations.

## Standalone use

`business-research` and the five departmental skills document standalone behavior for focused work outside this chain. Standalone use does not imply chain state was created or updated. `strategy-synthesis` is reserved for the orchestrated flow because it requires every relevant department to be drafted and current.

## Installation

Install all eight skill directories listed in the manifest when you want the complete chain, then invoke the `business-direction` entrypoint through the host's documented interface:

- [Install for Claude Code](../docs/installation/claude-code.md)
- [Install for Codex](../docs/installation/codex.md)

The canonical skills do not contain host-specific discovery paths. The installation guides record those paths separately from the generic copy workflow.

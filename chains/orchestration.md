---
name: orchestration
description: Front door that routes requests to one skill or runs a reviewed delegation cycle with temporary helpers.
entrypoint: orchestrate
skills:
  - orchestrate
  - model-routing-policy
  - evolve-skills
---

# Orchestration chain

## Purpose

`orchestrate` is the entry point to the catalog. It routes a request to the narrowest skill, or, for non-trivial work, writes a task brief and opens temporary helpers: an implementer, then a reviewer, then a critic. The orchestrator keeps decisions, state, final verification, version control, and the conversation with the user.

The manifest frontmatter above is the source of truth for composition. The canonical instructions remain in the referenced skill directories.

## Entrypoint

Start with [`orchestrate`](../skills/orchestrate/SKILL.md). It decides between a direct route and a delegation cycle and states the choice in one sentence.

## Included skills

- [`orchestrate`](../skills/orchestrate/SKILL.md) routes requests and runs the delegation cycle.
- [`model-routing-policy`](../skills/model-routing-policy/SKILL.md) supplies the model profiles for each role.
- [`evolve-skills`](../skills/evolve-skills/SKILL.md) receives repeated routing failures.

Any other skill in the catalog, including chain entrypoints such as `business-direction`, can be routed to and keeps its own gates.

## Main flow

```text
request
→ triage: trivial or non-trivial
→ trivial: route to one skill or answer directly
→ non-trivial: brief → implementer → reviewer ↺ → critic ↺ → approved
→ final report
```

A reviewer rejection starts a new round without calling the critic. At most two extra rounds follow the first; after that the orchestrator stops and reports the block.

## Persistence

The task brief is the state. It lives at `.grimoire/tasks/<slug>/brief.md` in a Git project, outside versioned content, or in the user data directory described in the skill otherwise. It holds the status, the rounds table, and the critic dossier.

## Standalone use

Every other skill works without this chain. Without helpers, `orchestrate` runs the roles as sequential passes and reports that they were not independent.

## Installation

Install the three skill directories listed in the manifest, plus any skill you want it to route to, then invoke `orchestrate` through the host's documented interface:

- [Install for Claude Code](../docs/installation/claude-code.md)
- [Install for Codex](../docs/installation/codex.md)
- [Install for Pi](../docs/installation/pi.md)
- [Install for Hermes Agent](../docs/installation/hermes-agent.md)

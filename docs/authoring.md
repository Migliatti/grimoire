# Authoring skills and chains

## Canonical skill location

Every reusable skill has one canonical directory:

```text
skills/<skill-name>/SKILL.md
```

Keep the skill directory flat even when a skill participates in several chains. Supporting references, scripts, or assets belong inside that skill directory when needed. Do not maintain separate Claude Code, Codex, or chain-owned copies of the same canonical instructions.

## Language policy

Write canonical instructions, frontmatter, examples, and repository documentation in English. In the instructions, explicitly tell the agent to respond in the user's language unless the user requests otherwise. This keeps the source reviewable across contributors without forcing users to work in English.

## Tool-neutral capabilities

Describe capabilities and observable outcomes rather than host-specific tool names. For example, instruct an agent to ask the user a question, search authoritative sources, or persist a state record; do not require one vendor's question API, discovery directory, or invocation syntax in canonical `SKILL.md` files.

Put verified host-specific details under `docs/installation/`. If a capability is not established by a host's current official documentation or by a behavioral evaluation, state the uncertainty instead of claiming compatibility.

## When to add a chain manifest

Add `chains/<chain-name>.md` when several canonical skills form a named workflow with an entrypoint, meaningful order, shared state, or orchestration rules. A simple link collection does not need a chain.

The manifest owns chain membership. A skill must not declare which chains own or use it because that would duplicate composition metadata and make reuse harder.

## Minimal manifest schema

Use YAML frontmatter followed by a concise human guide:

```yaml
---
name: chain-name
description: One-line description of the composed workflow.
entrypoint: entrypoint-skill
skills:
  - entrypoint-skill
  - supporting-skill
---
```

The four fields are required. Every item in `skills` must be unique and resolve to `skills/<name>/SKILL.md`; `entrypoint` must appear in the list. The body should document purpose, entrypoint, main flow, persistence when applicable, standalone boundaries, and installation links without copying complete skill instructions.

## Share behavior without duplication

- Link from the root catalog to a chain manifest or canonical skill.
- Link from a manifest to its canonical skill files.
- Put shared behavior in a focused reusable skill instead of copying its instructions into orchestrators.
- Let an orchestrator define sequencing, inputs, outputs, and state transitions; let the delegated skill own its focused behavior.
- Keep platform discovery and invocation details in installation guides.

A skill may appear in multiple manifests. Reuse the same canonical path rather than forking its contents.

## Behavioral RED/GREEN evaluation

Evaluate instruction changes against realistic prompts and observable pass criteria:

1. Write a scenario that names the behavior and the failure it should catch.
2. Run it against the current skills and record the actual RED result, including concrete missing or incorrect behavior.
3. Make the smallest instruction change that satisfies the scenario.
4. Run the same scenario again and record observable GREEN evidence from the agent's behavior or artifacts.
5. Run adjacent scenarios to catch regressions.

Do not mark a behavioral scenario as passing from inspection of `SKILL.md` alone. Preserve the scenario, RED result, and GREEN result under `tests/<workflow>/` so later changes can be compared against the same contract.

## Repository integrity tests

Repository tests complement behavioral evaluation. They verify structural contracts such as valid chain references, unique manifest membership, a resolvable entrypoint, required catalog targets, and vendor-neutral canonical skills.

Run them after authoring changes:

```shell
python -m unittest tests.test_repository -v
```

When adding a new structural rule, write and observe a failing integrity test before changing the repository. Keep the parser and assertions minimal; prose for human readers does not need tests unless it represents a machine-consumed contract.

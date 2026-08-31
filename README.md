# grimoire

## Why this repository exists

`grimoire` is a tool-agnostic catalog of reusable agent skills and composed workflows. Each skill has one canonical implementation under `skills/`; host-specific discovery paths and installation steps live only in the installation guides.

The repository keeps reusable behavior separate from platform packaging so the same canonical instructions can be reviewed, evaluated, and adapted without maintaining vendor-specific copies.

## Quick start

In Claude Code, install the whole catalog as a plugin from this repository's own marketplace:

```shell
/plugin marketplace add Migliatti/grimoire
/plugin install grimoire@migliatti
```

Then invoke the chain entrypoint as `/grimoire:business-direction`.

To install by hand instead, or to install on another host:

1. Clone or download this repository.
2. Choose a [chain](#chains) for an end-to-end workflow or a [standalone skill](#standalone-skills) for a focused task.
3. Follow the installation guide for a host whose skill discovery behavior is documented here: [Claude Code](docs/installation/claude-code.md) or [Codex](docs/installation/codex.md).
4. Invoke the installed entrypoint or skill using that host's documented interface.

Canonical skill directories can also be inspected directly before installation. Treat every `skills/<skill-name>/SKILL.md` as the source to copy or link; do not edit a host-specific installed copy and then expect this repository to stay synchronized.

## Chains

[`business-direction`](chains/business-direction.md) is the first chain in the catalog. It coordinates evidence-backed business planning across relevant departments, preserves progress, and produces a final cross-department synthesis. Its manifest is the source of truth for the entrypoint, composition, flow, and persistence model.

## Standalone skills

These skills define a standalone mode or a focused contract that does not require running the complete chain.

### Design

- [`web-design-psychology`](skills/web-design-psychology/SKILL.md) — raises the perceived quality and credibility of a page, and verifies it against measurable gates. Its [evidence base](skills/web-design-psychology/evidence-base.md) records what each cited study actually measured and which popular statistics it refuses to repeat.

### Product engagement

- [`gamification-psychology`](skills/gamification-psychology/SKILL.md) — designs points, badges, leaderboards, streaks, and progress systems that move the behavior the product exists to cause rather than the metric that counts it, and ships a kill criterion with every mechanic. Its [evidence base](skills/gamification-psychology/evidence-base.md) separates what the gamification literature actually measured from the statistics that circulate without a source.

### Business planning

- [`business-research`](skills/business-research/SKILL.md) — gathers attributable evidence, confidence, conflicts, and material gaps.
- [`product-scope`](skills/product-scope/SKILL.md) — frames product scope after collecting decision-relevant answers.
- [`market-positioning`](skills/market-positioning/SKILL.md) — develops evidence-aware positioning and market choices.
- [`sales-pipeline`](skills/sales-pipeline/SKILL.md) — plans a sales pipeline from explicit inputs and assumptions.
- [`financial-planning`](skills/financial-planning/SKILL.md) — structures financial decisions, estimates, and validation needs.
- [`operations-planning`](skills/operations-planning/SKILL.md) — plans operational capacity, process, and delivery constraints.

The orchestration entrypoint and final synthesis skill are documented through the chain manifest rather than presented as independent workflows.

## Repository structure

```text
skills/<skill-name>/SKILL.md   Canonical skill instructions
chains/<chain-name>.md         Chain composition and guide
docs/authoring.md              Authoring and contribution rules
docs/installation/             Verified host-specific guidance
tests/                         Contracts and behavioral evaluations
.claude-plugin/                Claude Code plugin and marketplace manifests
.codex-plugin/                 Codex plugin manifest
```

The packaging manifests declare metadata only. They point at the same canonical `skills/` directory, so a plugin install and a manual copy deliver identical instructions.

## Compatibility and installation

The canonical skill format is designed to stay host-neutral. The repository currently documents discovery and installation only where current official sources establish the behavior:

- [Claude Code installation](docs/installation/claude-code.md) — personal, project, or plugin scope
- [Codex installation](docs/installation/codex.md) — repository, user, or admin scope

These guides document discovery, not a claim that every skill behavior has been compatibility-tested on every interface or release. Review the relevant official documentation and the repository's behavioral results before relying on a workflow in a new environment.

## Authoring and contributing

Read [Authoring skills and chains](docs/authoring.md) before changing canonical instructions or adding a chain. Contributions should keep instructions in English, responses in the user's language, capabilities tool-neutral, chain membership in manifests, and behavior covered by RED/GREEN evaluation where applicable.

Run the repository contracts before opening a change:

```shell
python -m unittest tests.test_repository -v
```

## License

This repository is available under the [MIT License](LICENSE). Copyright © 2026 Gabriel Migliatti.

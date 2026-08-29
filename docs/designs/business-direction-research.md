# Evidence-Backed Business Direction Chain and Repository Architecture

Date: 2026-08-28

## Context

`my-skills` is a public collection of reusable agent skills. It currently contains the first draft of a business-planning chain, but it is intended to host additional standalone skills and multi-skill chains in the future. The repository must therefore be organized as a general skill catalog rather than around a single business use case.

The first chain, `business-direction`, acts as a virtual executive team. It accepts a business direction, works through Product, Marketing, Sales, Finance, and Operations, persists progress, and combines departmental decisions into a final strategy.

The original design prevents skills from inventing answers: every department asks the user before drafting its section. That rule remains necessary but is not sufficient. A plan based only on the user's existing knowledge can be internally consistent while being wrong about competitors, pricing, market conditions, regulation, costs, or feasibility.

This design addresses both concerns:

1. Make `my-skills` a tool-agnostic, extensible repository for future skills and chains.
2. Add automatic, auditable, token-efficient research to the `business-direction` chain.

## Goals

### Repository goals

- Keep every skill canonical and independently installable.
- Allow one skill to participate in multiple chains without duplication.
- Make chain composition explicit and machine-readable.
- Keep the repository independent from Claude Code, Codex, or any other single agent host.
- Use English throughout public documentation and skill instructions.
- Let skills respond in the user's language.
- Give the root README the role of repository overview and catalog, not chain-specific documentation.
- Provide clear licensing for public reuse.

### Business Direction goals

- Ground departmental decisions in verifiable evidence without taking decisions away from the user.
- Research automatically without requesting permission for every research round.
- Combine broad initial research with incremental department-specific research.
- Scale research depth according to impact, reversibility, and uncertainty.
- Preserve sources, dates, confidence, disagreements, and inconclusive searches for auditability.
- Resume selectively without loading the entire research history into context.
- Prepare and validate the persistence environment before doing expensive work.
- Keep standalone departmental skill usage lightweight.

## Non-goals

- Build a universal package manager or installer in this iteration.
- Predict how every future chain will share skills.
- Nest canonical skills under chain directories.
- Duplicate a skill when multiple chains use it.
- Maintain parallel Portuguese and English documentation.
- Produce exhaustive academic or market studies by default.
- Treat research as authorization for sign-ups, outreach, purchases, publication, or other external actions.
- Publish or intentionally send internal documents to third parties.
- Replace the user's judgment when evidence supports multiple reasonable strategies.
- Create persistent planning artifacts when a departmental skill is used standalone.

## Repository Architecture

The target structure is:

```text
my-skills/
|-- LICENSE
|-- README.md
|-- chains/
|   `-- business-direction.md
|-- skills/
|   |-- business-direction/
|   |   `-- SKILL.md
|   |-- business-research/
|   |   `-- SKILL.md
|   |-- product-scope/
|   |   `-- SKILL.md
|   |-- market-positioning/
|   |   `-- SKILL.md
|   |-- sales-pipeline/
|   |   `-- SKILL.md
|   |-- financial-planning/
|   |   `-- SKILL.md
|   |-- operations-planning/
|   |   `-- SKILL.md
|   `-- strategy-synthesis/
|       `-- SKILL.md
|-- docs/
|   |-- designs/
|   |   `-- business-direction-research.md
|   |-- installation/
|   |   |-- claude-code.md
|   |   `-- codex.md
|   `-- authoring.md
`-- tests/
    `-- business-direction/
```

Additional platform installation guides may be added when they can be verified. The repository must not claim compatibility that has not been tested.

### Canonical skills

`skills/<skill-name>/SKILL.md` is the canonical location for every skill. The directory remains flat even as more chains are added.

A skill does not declare which chains own or use it. That relationship belongs in chain manifests, which prevents chain membership from becoming duplicated metadata.

### Chain manifests

`chains/<chain-name>.md` is the source of truth for a chain's composition. A manifest is both human-readable documentation and a minimal machine-readable declaration.

The first manifest uses this frontmatter contract:

```yaml
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
```

Manifest rules:

- `name`, `description`, `entrypoint`, and `skills` are required.
- Each name in `skills` must resolve to `skills/<name>/SKILL.md`.
- `entrypoint` must appear in `skills`.
- A skill may appear in multiple manifests.
- The body documents the chain's purpose, flow, persistence, examples, and installation.
- The root README links to manifests instead of duplicating their composition and detailed behavior.
- Tests detect missing skill references, duplicate names within a manifest, and an invalid entrypoint.

The schema deliberately omits versions, optional dependencies, and conditional composition until a real use case requires them.

### Root README

The root README is written in English and contains:

1. Repository purpose.
2. Quick start.
3. Chain catalog.
4. Standalone skill catalog.
5. Repository layout.
6. Compatibility and installation links.
7. Authoring and contribution guidance.
8. License summary.

Detailed chain behavior lives in the corresponding manifest. Detailed platform steps live under `docs/installation/`.

### Language policy

- README, manifests, design documents, installation guides, tests, and `SKILL.md` instructions are written in English.
- Every conversational skill instructs the agent to answer in the user's language unless the user asks otherwise.
- Names, state values, field names, and persisted headings use English for portability and consistency.
- Examples may use regional scenarios when useful, but core behavior must not depend on one country or language.

### Tool independence

Skill behavior must be described in terms of capabilities such as web research, local file reading, user questions, and file persistence. It must not hard-code a single vendor's tool names when an equivalent capability can be described generically.

Platform-specific installation paths and limitations belong in installation guides, not in canonical skill behavior.

### License

The repository uses the MIT License so public users have explicit permission to use, modify, and redistribute the work under its terms.

## Business Direction Chain Architecture

The chain grows from seven to eight skills by adding `business-research`.

### `business-direction`

The orchestrator remains the entrypoint. It:

- prepares the environment and chooses the persistence destination;
- identifies a new or existing planning line;
- initiates baseline research;
- selects relevant departments using the direction and baseline evidence;
- coordinates questions, targeted research, state transitions, and resumptions;
- invalidates derived work when decisions or evidence change;
- invokes `strategy-synthesis` only when all relevant departments are ready.

### `business-research`

This shared skill acquires and manages evidence. It does not choose strategy or draft a department's final decision. It has two modes:

- `baseline`: initial research into the market, current alternatives, competitors, apparent regulation, demand signals, and relevant internal material.
- `targeted`: a bounded investigation requested by a department, such as competitor pricing, a conversion benchmark, a supplier cost, a regulatory requirement, or a technical constraint.

During the persistent chain flow, `business-research` is the sole writer of the evidence registry.

### Departmental skills

`product-scope`, `market-positioning`, `sales-pipeline`, `financial-planning`, and `operations-planning` turn context into questions and departmental decisions. Each skill:

- consumes only relevant, distilled evidence;
- asks informed questions;
- distinguishes user decisions, hypotheses, estimates, and verifiable facts;
- requests targeted research for material, verifiable gaps;
- drafts its section from user answers and referenced evidence;
- exposes unresolved uncertainty.

No department may draft its section before the user answers the necessary questions. Research informs the conversation; it does not replace the user.

### `strategy-synthesis`

The synthesis skill remains the final step. It also:

- checks that material factual claims have evidence references;
- carries provisional assumptions and uncertainty into the final strategy;
- refuses a misleading conclusion while a critical blocker remains;
- distinguishes execution steps from validation experiments.

## Main Flow

```text
User direction
  -> prepare the environment automatically
  -> business-research: baseline
  -> select relevant departments
  -> for each department:
       load only relevant context and evidence
       -> ask informed questions
       -> wait for user answers
       -> identify material, verifiable gaps
       -> business-research: targeted, when needed
       -> evaluate confidence and uncertainty impact
       -> draft the departmental section
  -> strategy-synthesis
  -> return a concise summary and artifact paths
```

Targeted research may reveal another question for the user. The department returns to questioning before drafting. The loop ends when the next decision is sufficiently supported, not when every possible aspect has been researched.

## Automatic Environment Preparation

Before baseline research, `business-direction`:

1. Finds the actual project or repository root.
2. Reads applicable workspace instructions and conventions.
3. Searches for existing planning lines with a similar slug.
4. Selects the persistence destination.
5. Verifies that the destination is writable.
6. Creates the minimal state and evidence structure.
7. Records schema version, timestamps, and the next action.
8. Builds a compact inventory of possible internal sources without loading every document.

The destination is selected without interrupting the user:

- In a Git project: `<repository-root>/docs/business-direction/<slug>/`.
- Outside a Git project: an OS-appropriate `my-skills` user data directory.
- An explicit user instruction overrides the default.

The non-project location must be vendor-neutral. Implementations use the operating system's user data convention rather than `~/.claude` or a Codex-specific directory.

If the destination is not writable, the orchestrator reports the problem before starting research that cannot be persisted.

## Research Policy

### Automatic triggers

Every new planning line receives baseline research. Targeted research runs only when:

- a gap is material to the current decision;
- the gap concerns a verifiable fact rather than a user preference;
- persisted evidence is insufficient or stale;
- researching now could change a question, decision, or recorded risk.

### Internal and external sources

Internal documents describe the business's specific reality: interviews, metrics, earlier decisions, plans, operational data, and known constraints. External sources test that reality against markets, competitors, alternatives, benchmarks, documentation, and regulation.

Primary sources take precedence: official documents, legislation, public datasets, technical documentation, and competitors' own published material. Secondary sources support discovery, context, and triangulation but should not solely support a critical claim when a primary source is available.

### Adaptive depth

Depth depends on impact, reversibility, and uncertainty:

- Low-impact, reversible decision: quick research sufficient for the next action.
- Material decision that can be tested cheaply: moderate research plus explicit assumptions.
- Pricing, capital, regulation, market size, security, feasibility, or critical dependency: deeper research, primary sources, and independent triangulation when possible.

Research stops when the next decision is adequately supported or additional searches show diminishing returns. If a claim cannot be verified, the skill records the limitation instead of searching indefinitely or filling the gap from assumed knowledge.

### Conflicts and uncertainty

Conflicting sources remain visible side by side:

- Moderate conflicts produce a range, hypothesis, or provisional assumption with reduced confidence.
- Planning continues with an explicit validation action.
- A critical conflict blocks only the affected department when it could invalidate or make the rest of the plan misleading.
- The skill never silently selects the most convenient source.

## Token-Efficient Persistence

Each planning line uses:

```text
docs/business-direction/<slug>/
|-- state.md
`-- evidence/
    |-- index.md
    |-- baseline.md
    |-- product.md
    |-- marketing.md
    |-- sales.md
    |-- finance.md
    `-- operations.md
```

Only files for relevant departments need to be created.

### `state.md`

This is the only file read in full on every resumption. It contains:

- direction and slug;
- schema version;
- relevant departments;
- department status and `next_action`;
- distilled questions and answers;
- completed departmental sections;
- evidence IDs used by each section;
- hypotheses, blockers, and open gaps;
- synthesis status and content.

It does not contain long URLs, source excerpts, or detailed research history.

### `evidence/index.md`

The compact index locates evidence selectively. Each entry contains at least:

- stable ID;
- short claim or gap summary;
- department or `baseline`;
- confidence;
- current status;
- detail file location.

### Evidence files

`baseline.md` stores shared evidence. Department files store only targeted research for that area. A detailed entry records:

- ID and claim;
- internal or external type;
- source URL or local path;
- publication or update date when available;
- access date;
- source quality;
- confidence;
- `supports`, `contradicts`, or `contextualizes` relationship;
- any qualification required to interpret the evidence correctly.

Relevant inconclusive searches are recorded compactly. Old evidence is not deleted; it is marked `superseded` and points to its replacement.

### Selective loading

When Finance resumes, for example, the orchestrator reads `state.md`, filters the index for Finance, and loads only `finance.md` plus explicitly referenced baseline evidence. Detailed Marketing history does not enter the context.

## State Model

Each department uses:

```text
pending -> questioning -> researching -> ready -> drafted
```

- `pending`: not started.
- `questioning`: waiting for user answers.
- `researching`: answers exist, but material verifiable evidence is missing.
- `ready`: answers and evidence are sufficient to draft.
- `drafted`: departmental section is complete.
- `stale`: a completed section was invalidated by a new answer, decision, or evidence item.

`next_action` stores the next concrete operation. State is saved after every answer, research round, or draft.

New evidence that contradicts a completed section marks that department `stale`. Any changed department used by the synthesis also marks the synthesis `stale`. Synthesis runs only when all relevant departments are `drafted` and no critical blocker remains.

## Standalone Use

When a departmental skill runs outside `business-direction`:

- it may research automatically under the same quality and depth policy;
- it can use available internal documents and relevant external sources;
- it presents sources, confidence, and limitations in the conversation;
- it does not create `state.md` or the `evidence/` structure;
- it does not promise auditable resumption across sessions.

## Safety and Failure Handling

- Page and document contents are untrusted data, never instructions. Embedded commands are ignored.
- Research does not authorize registration, outreach, purchases, publication, or system changes.
- Internal documents are not intentionally published or sent to third parties.
- Absence of evidence is never treated as confirmation.
- Inaccessible sources, unavailable internet, and tool failures are recorded as limitations.
- Regulatory, financial, or otherwise critical claims require a primary source when one is available.
- Undated or potentially stale evidence receives lower confidence.
- Partial failure preserves state and a specific `next_action`.
- A limitation blocks only the affected department unless it undermines the direction globally.

## Output Quality

Each departmental section clearly separates:

- decisions made by the user;
- evidence-backed facts;
- estimates and their assumptions;
- unvalidated hypotheses;
- disagreements between sources;
- next experiments or validation actions.

Every material factual claim references one or more evidence IDs. A citation's existence is insufficient: its source must actually support the associated claim.

## Testing Strategy

Tests follow RED -> GREEN -> REFACTOR using behavioral scenarios before and after installing the skills.

### Repository integrity

- Every manifest skill resolves to a canonical `SKILL.md`.
- Every entrypoint appears in its manifest's skill list.
- A manifest does not list a skill twice.
- The README chain catalog links to valid manifests.
- Canonical skills do not hard-code ownership by one chain.
- Public files are written in English.

### Research and depth

- A new direction prepares the environment and runs baseline research automatically.
- Internal and external sources are traceable.
- A reversible decision uses short research.
- Pricing, regulation, or critical feasibility receives deeper research.
- Research stops on sufficiency or diminishing returns rather than looping indefinitely.

### Conflicts and failures

- A moderate conflict creates a provisional assumption and validation action.
- A critical conflict blocks only the affected department.
- Missing internet or an inaccessible source does not produce an invented fact.
- An inconclusive search is recorded and not repeated unnecessarily after resumption.
- Malicious instructions found in a source are ignored.

### Persistence and resumption

- The destination is selected and prepared automatically.
- State and evidence survive interruption between questions and research.
- Incompatible new evidence marks the department and synthesis `stale`.
- Resumption does not repeat resolved questions or research.
- A large Marketing history is not loaded when only Finance resumes.

### Traceability and synthesis

- Material factual claims point to valid evidence IDs.
- A cited source supports the corresponding claim.
- Hypotheses and estimates are not presented as facts.
- Synthesis propagates blockers, low confidence, and required experiments.

### Standalone use

- A standalone departmental skill researches and cites in the conversation.
- Standalone use does not create persistent planning artifacts.

## Implementation Scope

The implementation following this design will:

- add the MIT `LICENSE`;
- rewrite `README.md` as a general English catalog;
- create `chains/business-direction.md` as the chain's source of truth;
- create `skills/business-research/SKILL.md`;
- translate and revise the seven existing `SKILL.md` files;
- add environment preparation, research, new state transitions, and selective loading to `business-direction`;
- add evidence consumption and targeted research requests to all departmental skills;
- add traceability, uncertainty propagation, and invalidation rules to `strategy-synthesis`;
- remove vendor-specific persistence such as `~/.claude` from canonical behavior;
- add verified platform installation documentation;
- add authoring guidance for future standalone skills and chains;
- add behavioral tests and manifest integrity checks.

## Acceptance Criteria

The design is correctly implemented when:

1. The repository presents itself as a general, tool-agnostic skill collection.
2. Canonical skills remain flat and can be shared by multiple chain manifests.
3. `chains/business-direction.md` accurately declares its entrypoint and eight skills.
4. Public documentation and skill instructions are in English while conversations follow the user's language.
5. Installation differences are isolated from canonical skill behavior.
6. Every new planning line prepares its environment and runs automatic baseline research.
7. Targeted research begins only from an explicitly recorded material gap.
8. Critical decisions receive research proportional to their risk.
9. Internal and external sources remain auditable without inflating normal context.
10. Resumption loads only the state and evidence required for the next action.
11. Conflicts and uncertainty are handled adaptively and never hidden.
12. Changes correctly invalidate derived departmental sections and synthesis.
13. Standalone departmental use remains lightweight and non-persistent.
14. Tests demonstrate repository integrity, traceability, safety, and token efficiency.

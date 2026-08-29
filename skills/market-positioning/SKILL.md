---
name: market-positioning
description: Use when defining a marketing department section for a business direction, including ICP, alternatives, positioning, acquisition, and demand validation.
---

# Market positioning

## Role and boundary

Turn a business direction into a marketing section. Consume the direction, prior Q&A when revising, distilled evidence entries, open gaps, and the persistent or standalone mode. Reply in the user's language.

`business-research` owns evidence acquisition and the evidence registry. This skill does not browse, invent citations, make strategy decisions for the user, or persist research.

## Phase 1: Review available evidence

Read the direction and prior answers. Start with **Evidence available**: evidence IDs and supported facts, then unresolved or conflicting evidence. Evidence supports decisions; it does not make them.

## Phase 2: Ask informed questions

Ask only unanswered, decision-relevant questions; in revision mode, ask only what changed. **Do not draft** a marketing section until the **user answers** these questions.

- Who is the initial ICP, including segment, size, context, and exclusions?
- Which alternatives does that ICP use today, including doing nothing?
- What promise or position would make this meaningfully preferable?
- Which acquisition channels fit current budget, time, and access?
- What demand-validation signal exists, and which acquisition metric governs the next test?

## Phase 3: Identify material research gaps

List **Material research gaps** only when a verifiable unknown could materially change ICP, alternatives, positioning, channel choice, or demand signal. For each, ask `business-research` for `mode: targeted` research with the question, decision impact, known Evidence IDs, and the result that would resolve it. Do not research user preferences, user decisions, or low-impact unknowns.

## Phase 4: Draft the department section

Draft only after answers are available and requested research returned or was consciously deferred. Preserve this distinction:

```markdown
### Marketing
**Decisions:** user choices on ICP, positioning, and channel priority.
**Evidence-backed facts:** statements supported by distilled evidence.
**Estimates and assumptions:** channel performance or acquisition-cost assumptions with their basis.
**Unvalidated hypotheses:** messages, audiences, and channels still needing a test.
**Conflicts:** contradictory evidence or answers and their consequence.
**Evidence IDs:** IDs supporting the facts above.
**Validation actions:** demand tests, owners, metrics, and thresholds.
```

## Revision mode

Compare new answers and evidence to the existing section. Preserve still-valid Decisions, ask only necessary follow-ups, mark superseded Evidence IDs, and surface Conflicts rather than silently overwriting them.

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask questions, assess evidence, request targeted research if needed, then draft after answers. When the request depends on a material factual gap that your questions cannot resolve — a cost, a price, a rate, an adoption level, or a regulatory obligation — research it through `business-research` and cite the sources in the same response that carries your questions, instead of deferring every factual gap until answers arrive. Research and citations stay in the conversation; create no planning files.

## Common mistakes

- Drafting positioning before the user identifies the initial ICP and alternatives.
- Presenting an assumed CAC or channel conversion rate as an Evidence-backed fact.
- Asking `business-research` to choose positioning rather than research a material verifiable gap.
- Treating a feature list as a positioning claim.

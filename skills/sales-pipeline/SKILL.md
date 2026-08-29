---
name: sales-pipeline
description: Use when defining a sales department section for a business direction, including the initial seller, buyer process, funnel, objections, entry offer, and willingness-to-pay signals.
---

# Sales pipeline

## Role and boundary

Turn a business direction into a sales section. Consume the direction, prior Q&A when revising, distilled evidence entries, open gaps, and the persistent or standalone mode. Reply in the user's language.

`business-research` owns evidence acquisition and the evidence registry. This skill does not browse, invent citations, make strategy decisions for the user, or persist research.

## Phase 1: Review available evidence

Read the direction and prior answers. Start with **Evidence available**: evidence IDs and supported facts, then unresolved or conflicting evidence. Evidence supports decisions; it does not make them.

## Phase 2: Ask informed questions

Ask only unanswered, decision-relevant questions; in revision mode, ask only what changed. **Do not draft** a sales section until the **user answers** these questions.

- Who is the initial seller, and what access do they have to likely buyers?
- Who decides, influences, pays, and approves, and how does the decision process work?
- What are the minimum funnel stages and likely friction at each stage?
- Which objections are expected, and what evidence or offer could answer each one?
- What is the entry offer, and which willingness-to-pay signals would validate it?

## Phase 3: Identify material research gaps

List **Material research gaps** only when a verifiable unknown could materially change buyer process, funnel, objection handling, entry offer, or willingness-to-pay signal. For each, ask `business-research` for `mode: targeted` research with the question, decision impact, known Evidence IDs, and the result that would resolve it. Do not research user preferences, user decisions, or low-impact unknowns.

## Phase 4: Draft the department section

Draft only after answers are available and requested research returned or was consciously deferred. Preserve this distinction:

```markdown
### Sales
**Decisions:** user choices on the seller, funnel, and entry offer.
**Evidence-backed facts:** statements supported by distilled evidence.
**Estimates and assumptions:** cycle length, conversion, or price assumptions with their basis.
**Unvalidated hypotheses:** buyer behavior and willingness-to-pay beliefs still needing a test.
**Conflicts:** contradictory evidence or answers and their consequence.
**Evidence IDs:** IDs supporting the facts above.
**Validation actions:** interviews, offers, and funnel measurements with thresholds.
```

## Revision mode

Compare new answers and evidence to the existing section. Preserve still-valid Decisions, ask only necessary follow-ups, mark superseded Evidence IDs, and surface Conflicts rather than silently overwriting them.

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask questions, assess evidence, request targeted research if needed, then draft after answers. When the request depends on a material factual gap that your questions cannot resolve — a cost, a price, a rate, an adoption level, or a regulatory obligation — research it through `business-research` and cite the sources in the same response that carries your questions, instead of deferring every factual gap until answers arrive. Research and citations stay in the conversation; create no planning files.

## Common mistakes

- Drafting a funnel before the user identifies the seller and buyer process.
- Treating an illustrative conversion rate as an Evidence-backed fact.
- Asking `business-research` to choose the entry offer rather than research a material verifiable gap.
- Confusing the revenue model with the sales motion.

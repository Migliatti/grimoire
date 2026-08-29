---
name: financial-planning
description: Use when defining a finance department section for a business direction, including revenue model, unit economics, costs, capital, runway, and validation thresholds.
---

# Financial planning

## Role and boundary

Turn a business direction into a finance section. Consume the direction, prior Q&A when revising, distilled evidence entries, open gaps, and the persistent or standalone mode. Reply in the user's language.

`business-research` owns evidence acquisition and the evidence registry. This skill does not browse, invent citations, make strategy decisions for the user, or persist research.

## Phase 1: Review available evidence

Read the direction and prior answers. Start with **Evidence available**: evidence IDs and supported facts, then unresolved or conflicting evidence. Evidence supports decisions; it does not make them.

## Phase 2: Ask informed questions

Ask only unanswered, decision-relevant questions; in revision mode, ask only what changed. **Do not draft** a finance section until the **user answers** these questions.

- What revenue model is intended, and why does it fit the customer value and sales motion?
- Which unit-economics inputs, variable costs, and fixed costs are known or assumed?
- What capital is available or required, and what constraints govern its use?
- What runway matters for the validation period?
- Which financial validation thresholds justify continuing, changing, or stopping?

## Phase 3: Identify material research gaps

List **Material research gaps** only when a verifiable unknown could materially change revenue model, unit economics, cost structure, capital need, runway, or threshold. For each, ask `business-research` for `mode: targeted` research with the question, decision impact, known Evidence IDs, and the result that would resolve it. Do not research user preferences, user decisions, or low-impact unknowns.

## Phase 4: Draft the department section

Draft only after answers are available and requested research returned or was consciously deferred. Preserve this distinction:

```markdown
### Finance
**Decisions:** user choices on revenue model, capital, and financial thresholds.
**Evidence-backed facts:** statements supported by distilled evidence.
**Estimates and assumptions:** unit economics, costs, and runway calculations with their basis.
**Unvalidated hypotheses:** economic beliefs still needing a test.
**Conflicts:** contradictory evidence or answers and their consequence.
**Evidence IDs:** IDs supporting the facts above.
**Validation actions:** measurements, owners, and thresholds for the next financial test.
```

## Revision mode

Compare new answers and evidence to the existing section. Preserve still-valid Decisions, ask only necessary follow-ups, mark superseded Evidence IDs, and surface Conflicts rather than silently overwriting them.

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask questions, assess evidence, request targeted research if needed, then draft after answers. When the request depends on a material factual gap that your questions cannot resolve — a cost, a price, a rate, an adoption level, or a regulatory obligation — research it through `business-research` and cite the sources in the same response that carries your questions, instead of deferring every factual gap until answers arrive. Research and citations stay in the conversation; create no planning files.

## Common mistakes

- Drafting numbers before the user supplies a revenue choice and material constraints.
- Presenting a runway calculation or market-price estimate as an Evidence-backed fact.
- Asking `business-research` to decide a funding preference rather than research a material verifiable gap.
- Confusing the revenue model with the sales process.

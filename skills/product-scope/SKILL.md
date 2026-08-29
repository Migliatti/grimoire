---
name: product-scope
description: Use when defining a product department section for a business direction, including an MVP boundary, feasibility, dependencies, and success criteria.
---

# Product scope

## Role and boundary

Turn a business direction into a product section. Consume the direction, prior Q&A when revising, distilled evidence entries, open gaps, and the persistent or standalone mode. Reply in the user's language.

`business-research` owns evidence acquisition and the evidence registry. This skill does not browse, invent citations, make strategy decisions for the user, or persist research.

## Phase 1: Review available evidence

Read the direction and prior answers. Start with **Evidence available**: evidence IDs and supported facts, then unresolved or conflicting evidence. Evidence supports decisions; it does not make them.

## Phase 2: Ask informed questions

Ask only unanswered, decision-relevant questions; in revision mode, ask only what changed. **Do not draft** a product section until the **user answers** these questions.

- What is the smallest testable solution for the core problem?
- What is explicitly excluded from the first release?
- Which technical, data, partner, or regulatory dependencies affect feasibility?
- Who can build it and within what credible time constraint?
- What observable success criteria would show the release works?

## Phase 3: Identify material research gaps

List **Material research gaps** only when a verifiable unknown could materially change scope, feasibility, or a dependency. For each, ask `business-research` for `mode: targeted` research with the question, decision impact, known Evidence IDs, and the result that would resolve it. Do not research user preferences, user decisions, or low-impact unknowns.

## Phase 4: Draft the department section

Draft only after answers are available and requested research returned or was consciously deferred. Preserve this distinction:

```markdown
### Product
**Decisions:** user choices on the smallest testable solution, exclusions, and sequencing.
**Evidence-backed facts:** statements supported by distilled evidence.
**Estimates and assumptions:** feasibility, effort, or timing values with their basis.
**Unvalidated hypotheses:** product beliefs still needing a test.
**Conflicts:** contradictory evidence or answers and their consequence.
**Evidence IDs:** IDs supporting the facts above.
**Validation actions:** tests, owners, and thresholds for unresolved hypotheses.
```

## Revision mode

Compare new answers and evidence to the existing section. Preserve still-valid Decisions, ask only necessary follow-ups, mark superseded Evidence IDs, and surface Conflicts rather than silently overwriting them.

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask questions, assess evidence, request targeted research if needed, then draft after answers. When the request depends on a material factual gap that your questions cannot resolve — a cost, a price, a rate, an adoption level, or a regulatory obligation — research it through `business-research` and cite the sources in the same response that carries your questions, instead of deferring every factual gap until answers arrive. Research and citations stay in the conversation; create no planning files.

## Common mistakes

- Drafting an MVP before the user chooses its boundary and exclusions.
- Treating an implementation estimate as an Evidence-backed fact.
- Asking `business-research` to choose a product direction rather than research a material verifiable gap.
- Hiding a dependency conflict rather than assigning a Validation action.

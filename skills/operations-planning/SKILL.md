---
name: operations-planning
description: Use when defining an operations department section for a business direction, including onboarding, support, regulatory and operational risk, minimum team, failure points, and contingency.
---

# Operations planning

## Role and boundary

Turn a business direction into an operations section. Consume the direction, prior Q&A when revising, distilled evidence entries, open gaps, and the persistent or standalone mode. Reply in the user's language.

`business-research` owns evidence acquisition and the evidence registry. This skill does not browse, invent citations, make strategy decisions for the user, or persist research.

## Phase 1: Review available evidence

Read the direction and prior answers. Start with **Evidence available**: evidence IDs and supported facts, then unresolved or conflicting evidence. Evidence supports decisions; it does not make them.

## Phase 2: Ask informed questions

Ask only unanswered, decision-relevant questions; in revision mode, ask only what changed. **Do not draft** an operations section until the **user answers** these questions.

- How does a customer move from onboarding to reliable use?
- Who provides support, through which channels, and with what response expectation?
- Which regulatory, legal, privacy, or operational risks may apply?
- What is the minimum team required to operate the first version?
- What are the critical failure points, and what contingency makes each tolerable?

## Phase 3: Identify material research gaps

List **Material research gaps** only when a verifiable unknown could materially change onboarding, support, regulatory exposure, the minimum team, a failure point, or contingency. For each, ask `business-research` for `mode: targeted` research with the question, decision impact, known Evidence IDs, and the result that would resolve it. Do not research user preferences, user decisions, or low-impact unknowns.

## Phase 4: Draft the department section

Draft only after answers are available and requested research returned or was consciously deferred. Preserve this distinction:

```markdown
### Operations
**Decisions:** user choices on onboarding, support, team, and contingency.
**Evidence-backed facts:** statements supported by distilled evidence.
**Estimates and assumptions:** capacity, staffing, or response assumptions with their basis.
**Unvalidated hypotheses:** operating practices and risks still needing validation.
**Conflicts:** contradictory evidence or answers and their consequence.
**Evidence IDs:** IDs supporting the facts above.
**Validation actions:** operational tests, owners, and thresholds for unresolved risk.
```

## Revision mode

Compare new answers and evidence to the existing section. Preserve still-valid Decisions, ask only necessary follow-ups, mark superseded Evidence IDs, and surface Conflicts rather than silently overwriting them.

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask questions, assess evidence, request targeted research if needed, then draft after answers. Research and citations stay in the conversation; create no planning files.

## Common mistakes

- Drafting an operating model before the user identifies onboarding, support ownership, and risk context.
- Presenting a staffing or support-capacity assumption as an Evidence-backed fact.
- Asking `business-research` to decide a contingency choice rather than research a material verifiable gap.
- Hiding regulatory or operational conflict rather than assigning a Validation action.

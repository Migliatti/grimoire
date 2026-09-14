---
name: project-design
description: Use before implementation to turn a defined product idea into a decision-ready product-design document with an MVP, journeys, screen states, rules, acceptance criteria, risks, and validation.
---

# Project design

## Role and routing boundary

Turn an initial product idea into a practical Markdown product-design document that can later inform technical planning and issue creation. Reply in the user's language unless the user requests otherwise. Prefer clarity, small reversible decisions, and validation before code.

Use this skill when the product problem needs to become an implementable product brief: intended users and outcome, value hypothesis, MVP boundary, journeys, screen inventory and states, business rules, acceptance criteria, risks, dependencies, and initial success metrics.

Do **not** use it for:

- market or competitor research, ICP selection, positioning, or demand evidence: use `market-positioning` and, for factual gaps, `business-research`;
- a business-direction department scope with feasibility and organization-wide sequencing: use `product-scope` or `business-direction`;
- visual style, interaction polish, or web-page credibility: use `web-design-psychology` after the product decisions exist;
- architecture, estimates, technical task planning, or implementation: route to the relevant technical-planning workflow;
- drafting or creating repository work items: use `github-issues` only after decisions are defined.

If the request only needs the smallest testable release boundary and exclusions, route to `product-scope`. If it needs the product behavior users will experience before code, use this skill. `elaborate-spec` is for conversationally clarifying a rough feature before planning; use this skill when the required durable output is a product-design document with journeys, screens, and states. Do not silently combine these workflows; state the boundary and ask a focused routing question when it is genuinely unclear.

## Phase 1: establish decision-ready inputs

Read the supplied idea and any existing decisions. Separate known facts, user decisions, assumptions, and unresolved questions. Do not treat an assertion in supplied material as verified evidence.

Before drafting, ask concise, objective questions for every missing decision that would materially change the MVP or a primary flow. Group questions so the user can answer efficiently:

1. What user and situation has the problem, what do they do today, and what outcome should improve?
2. What is the value hypothesis: if this user uses the product, what behavior or result should change, and why?
3. What must be true in the first release, what is explicitly out of scope, and what constraint (time, team, platform, policy, data) bounds it?
4. What are the one to three primary user goals or journeys, including their entry point and successful end state?
5. Which important rules, integrations, data sources, compliance requirements, or decisions are already known?
6. How will the first release be judged successful, and who can validate it?

Ask only unanswered questions. A request to “write the document now” does not waive this gate. If the user explicitly chooses to defer an uncertainty, record it as an **Assumption** or **Pending decision**, its impact, and a validation action; never invent a requirement, recommended default, platform, integration, policy, threshold, persona detail, or metric to fill a gap. Do not produce a complete design document until material questions are answered or explicitly deferred by the user. When they are not, return only the objective questions and the reason each answer is needed.

## Phase 2: choose the smallest coherent MVP

Make each decision small and traceable to the problem and desired outcome.

- Include only capabilities necessary to complete a primary journey and test the value hypothesis.
- Put tempting enhancements, secondary personas, automation, integrations, reporting, migration, and customization explicitly in **Out of scope** unless the user chose them.
- Identify the smallest experiment or release that can invalidate the hypothesis before larger investment.
- Surface conflicts between desired experience, constraints, and rules. Offer bounded options and their trade-offs; do not choose irreversible product policy on the user's behalf.

## Phase 3: model journeys, flows, and screens

For each primary journey, describe the actor, trigger, preconditions, happy path, branches, exit/success condition, and recovery path. Keep flows textual or Mermaid only when it makes a decision clearer; do not create decorative diagrams.

Inventory only screens or surfaces needed by the MVP. For each one, specify:

- purpose and user goal;
- entry points and visible information;
- user actions and resulting behavior;
- empty, loading, error, and success states (write “not applicable” with a reason when a state truly cannot occur);
- validation, permission, or destructive-action behavior when relevant;
- links to applicable rules and acceptance criteria.

Do not turn a screen inventory into visual design or frontend implementation instructions.

## Phase 4: make behavior testable

State business rules in unambiguous IF/THEN form, including ownership, validation, lifecycle, limits, and exception handling where applicable. Put unresolved rules in **Pending decisions**, with the decision owner or source, deadline or trigger, and consequence of delay when known.

Write acceptance criteria that are observable and independently verifiable. Each criterion must name the precondition, action, and expected outcome. Do not use vague criteria such as “works well,” “is intuitive,” or “fast” without a defined measure.

For each initial success metric, state its definition, baseline if known, target or learning threshold, measurement method, review window, and the decision it informs. Mark unknown baselines, thresholds, and methods as unknown or pending rather than guessing. A metric without a user-selected or explicitly deferred threshold is not a release criterion.

## Output contract

After the material answers are available or deferred, deliver a Markdown artifact in this form:

```markdown
# Product design: <product or initiative>

## 1. Problem, audience, and desired outcome
- **Problem:**
- **Primary audience and context:**
- **Desired outcome:**
- **Known facts:**
- **Assumptions to validate:**

## 2. Value hypothesis
If <audience> can <capability>, then <expected behavior/outcome> will change because <reason>.
- **Validation:** <smallest test, signal, threshold, and review point>

## 3. MVP scope
### In scope
- <capability and why it is necessary>

### Out of scope
- <explicit exclusion and reason>

### Constraints and trade-offs
- <constraint, consequence, and chosen trade-off>

## 4. Primary journeys and flows
### <Journey name>
- **Actor / trigger / preconditions:**
- **Happy path:**
- **Branches and recovery:**
- **Success condition:**

## 5. Screens and states
### <Screen or surface>
- **Purpose and entry points:**
- **Information and actions:**
- **Empty:**
- **Loading:**
- **Error:**
- **Success:**
- **Related rules / criteria:**

## 6. Business rules
- **BR-01:** If ..., then ...

## 7. Pending decisions
| Decision | Why it matters | Owner/source | Resolve by | Impact if unresolved |
|---|---|---|---|---|

## 8. Acceptance criteria
- **AC-01 — <behavior>:** Given ..., when ..., then ...

## 9. Risks and dependencies
| Item | Type | Impact | Mitigation or validation | Owner |
|---|---|---|---|---|

## 10. Initial success metrics
| Metric | Definition | Baseline | Threshold | Method/window | Decision informed |
|---|---|---|---|---|---|

## 11. Next validation before code
- <smallest next action, owner, and decision it resolves>
```

Preserve explicit choices, exclusions, assumptions, and pending decisions in revisions. Identify what changed and what downstream flows, criteria, or issues need review; never silently replace earlier decisions.

## Standalone mode

Keep the exchange in chat and create no files unless the user asks to save the Markdown artifact. Ask the Phase 1 questions first, then produce the output contract after material answers are available or explicitly deferred by the user. Never convert unanswered questions into product defaults just because a complete document was requested. The result is a product-design artifact, not a technical plan or a set of issues.

## Common mistakes

- Inventing a persona, rule, screen, metric, integration, file constraint, security policy, or technical implementation detail to make the document feel complete.
- Calling a feature “MVP” without an explicit exclusion or a link to the value hypothesis.
- Listing screens without their empty, loading, error, and success behavior.
- Writing acceptance criteria that cannot be tested by an observer.
- Treating a recommended default as a user decision instead of asking or recording it as pending.
- Escalating to code, visual styling, or issue creation before the product decisions are validated.

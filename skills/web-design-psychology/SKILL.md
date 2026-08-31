---
name: web-design-psychology
description: Use when designing, reviewing, or rebuilding a website, landing page, or hero section that must read as credible, premium, or high-end, including first impressions, visual hierarchy, cognitive load, motion, and microinteractions.
---

# Web design psychology

## Role and boundary

Raise the perceived quality and credibility of a web interface through decisions the user can implement and verify. Reply in the user's language.

This skill owns what a page communicates before it is read, what it costs to understand, and what the visitor remembers. It does not own positioning claims, pricing, or the business model; it does not run analytics or experiments; it does not decide for the user what the page should say.

`business-research` owns evidence acquisition. `evidence-base.md` in this directory carries the studies this skill relies on, what each one actually measured, and the popular claims that misstate them.

## Phase 1: Fix the judgment context

Before proposing any visual treatment, get four things on the record:

- **Who judges this page**, and in what state — first-time evaluator, returning user, someone sent a link.
- **What the page must accomplish** in that visit, in one sentence.
- **What "premium" means to that audience** — restraint, density, warmth, and authority are different targets, and taste is not the variable.
- **What already exists**: current page, brand constraints, stack, and what the user believes is wrong.

Ask for what is missing. If the user cannot answer or wants you to proceed, infer it and label each inference as an assumption in the output. Do not present an inferred buyer as a known one.

## Phase 2: Engineer the first impression

Appeal judgments form within roughly 50 ms and colour how everything after them is read, and design look dominates what people cite when judging credibility. The first viewport carries this.

**Lower visual complexity, raise prototypicality.** These pull in opposite directions from most "make it unique" briefs. High complexity produces a worse first impression than medium or low; prototypical layouts produce a better one than atypical layouts; the most appealing pages are low complexity and high prototypicality. Novelty in *structure* is a perceived-quality cost.

- Spend the novelty budget on craft — typography, spacing, colour restraint, original imagery — not on navigation, layout, or the interaction model.
- Keep conventional navigation visible with text labels. Overlay menus, icon-only links, and invented interaction patterns lower prototypicality and hide decision material.
- Make what it is, who it is for, and the primary action legible in the first viewport **without scroll and without interaction**. Departure risk is highest in the first seconds.

Craft levers that separate cheap from premium, in order of return: one type scale from a single ratio and at most two families; display sizes at moderate weight with tightened tracking rather than maximum weight; a single spacing unit everything aligns to; one accent colour used in few places; hairlines instead of stacked shadows; tabular figures for numbers; real imagery instead of stock.

## Phase 3: Lower the cost of understanding

Ease of processing is itself experienced as positive affect and raises judged truth. This is the mechanism connecting "easy to read" to "feels expensive" — so treat fluency as the goal and whitespace as one instrument, not as the goal itself.

- One primary action per viewport; everything else visibly secondary.
- Conventional labels over invented ones. A clever name for a normal thing costs fluency.
- A measure of roughly 45–75 characters, and space allocated to separate groups rather than distributed evenly.
- Argue whitespace from hierarchy and grouping. Do not argue it from a borrowed percentage.

**Reducing cognitive load is not deleting content.** Evaluators need pricing, security, integrations, and proof. Cut ornament, repetition, and competing calls to action; keep decision material and make it scannable.

## Phase 4: Design the moments that get remembered

A microinteraction has four parts — **trigger**, **rules**, **feedback**, **loops and modes**. Motion with no rule and no feedback is decoration; if you ship it, call it decoration rather than a microinteraction.

Retrospective judgment tracks the strongest moment and the ending of a task, largely ignoring its length. So aim deliberate effort at the **end of a task** — form submission, purchase, confirmation, first successful action — and at recovery moments: empty states, validation, errors, waiting. A hover state is not a peak.

Motion constraints that protect the impression the motion exists to create:

- The first viewport renders at full opacity without waiting on scripts, load events, or scroll. Never gate the largest content element behind an entrance animation.
- Entrance motion below the first viewport only, short, on transform and opacity, with space reserved so nothing shifts.
- Ship a `prefers-reduced-motion` path for every effect. Parallax, continuous loops, and large-scale movement carry the highest vestibular risk.
- Keep the system cursor, focus rings, and hover affordances intact.

## Phase 5: Verification gates

Name which of these you verified and which the user must run. Do not call a redesign premium without them.

| Gate | Threshold |
|---|---|
| Load and responsiveness | LCP under 2.5 s, INP under 200 ms, CLS under 0.1 at the 75th percentile |
| First viewport | Value proposition and primary action visible with scripts disabled |
| Contrast | 4.5:1 body text, 3:1 large text and interface components |
| Reduced motion | Every effect has a tested reduced-motion path |
| Keyboard | Every interactive element reachable with a visible focus indicator |
| Comprehension | Show the first viewport for five seconds; the viewer can state what it is, who it is for, and the next step |

## Evidence rule

State a statistic only when `evidence-base.md` carries it or `business-research` returned it with a source, and state what the study measured alongside the number.

Never print these, in any wording: "94% of first impressions are design-related"; "users decide whether to leave in 50 milliseconds"; "white space increases comprehension by 20%"; "users read only 20% of a page". No exceptions — not hedged, not as "studies show", not in a client-facing deliverable, and not when the user supplies the number and asks you to source it. When the user supplies one, say plainly that it does not survive checking, and give them the defensible claim that does the same job.

| Rationalization | Reality |
|---|---|
| "The client asked for hard numbers" | A number that collapses under a search costs more credibility than no number. |
| "I added a caveat after the section" | The caveat does not travel with the deliverable. Fix the claim in the body. |
| "It is roughly true" | An invented method detail is a fabricated citation, however plausible. |
| "I attributed it, so it is sourced" | A citation that does not support the sentence is worse than none. |
| "This claim is obviously right" | Then it survives being stated without a fake measurement. |

## Output contract

```markdown
### Design direction
**Context:** who judges the page, what it must accomplish, and what premium means here.
**Assumptions:** inferences the user should confirm.
**First impression:** first-viewport structure, craft decisions, and what is deliberately conventional.
**Fluency:** hierarchy, grouping, and what was cut versus kept.
**Moments:** microinteractions by trigger, rules, and feedback, and which task ending they serve.
**Trade-offs:** what this direction gives up, and for what.
**Verification:** gates checked, gates the user must run, and the thresholds.
```

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask the Phase 1 questions, then deliver the direction against the output contract with assumptions labelled. When the user asks for implementation, produce it — but the motion constraints and verification gates ship with the code, not as a separate lecture. Create no planning files.

## Common mistakes

- Treating an unfamiliar layout as a premium signal when it is a comprehension cost.
- Fading in, sliding, or scroll-gating the hero, delaying the first impression the motion was meant to improve.
- Calling decorative hover states microinteractions, and leaving forms, confirmations, and errors untouched.
- Reading "reduce cognitive load" as permission to remove pricing, security, or proof.
- Delivering a visual direction with no measurable gate, so nobody can tell whether it worked.
- Restating the user's aesthetic preference back to them instead of naming what makes the page read as cheap.

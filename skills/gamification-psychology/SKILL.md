---
name: gamification-psychology
description: Use when designing, reviewing, or adding engagement mechanics to a product — points, badges, leaderboards, streaks, levels, quests, variable rewards, or progress systems — including retention and habit loops that must produce real behavior rather than activity metrics.
---

# Gamification psychology

## Role and boundary

Design engagement mechanics that cause the behavior the product exists to produce, and make
the difference between real effect and metric theater measurable.
Reply in the user's language unless the user requests otherwise.

This skill owns what a mechanic rewards, how comparison is scoped, how the mechanic gets
gamed, what it costs the user who is doing badly, and how anyone would tell whether it
worked. It does not own pricing, positioning, or the business model; it does not run the
experiment; it does not decide what the product is for.

`business-research` owns evidence acquisition. `evidence-base.md` in this directory carries
the studies this skill relies on, what each one actually measured, and the popular claims
that misstate them.

## Phase 1: Name the target behavior

Before proposing any mechanic, get these on the record:

- **The behavior the product exists to cause**, stated as something that happens in the
  user's life or work — habits completed, deals progressed, distance run, sentences
  understood. Not sessions, not DAU, not time in app.
- **The proxy currently counted**, and how far it sits from that behavior.
- **Who the user is measured against**, if anyone, and whether that comparison is winnable.
- **What already exists**, and what the team believes is broken.
- **Who is exposed**: minors, employees whose ranking touches compensation, people managing
  a health condition.

**If you cannot state the mechanic's target behavior as something that happens away from
the screen, you are designing for the metric.** Ask for what is missing. If the user cannot
answer or wants you to proceed, infer it and label each inference as an assumption in the
output.

## Phase 2: Reward the behavior, not the evidence of the behavior

Points, badges and leaderboards reliably move the thing they count. That is the honest
ceiling: an experiment isolating these elements found task completion rose while intrinsic
motivation and competence satisfaction did not move. Expect the count to move; do not claim
motivation moved.

- **Every countable action has a cheapest way to produce it.** Name that way before
  shipping, and design against it. A points scheme that rewards records created will be paid
  in junk records.
- **Give a deliberate zero.** Actions that only prove presence — logging in, opening a
  record, viewing a page — are worth zero on purpose, and the spec should say so, or someone
  will add them later as an oversight fix.
- **Points that cannot be reversed cannot be trusted.** Ship clawback with the ledger: when
  the underlying thing is deleted, merged, or marked invalid, the award is voided.
- **Frame rewards as competence feedback rather than as payment.** Tangible rewards
  contingent on doing the task reduce free-choice motivation for it; informational feedback
  does not. "You are now answering within five minutes on 8 of 10 leads" and "you earned 40
  points" address different systems.

## Phase 3: Scope comparison so it can be won

A global ranking is unwinnable for nearly everyone in it, and it gets worse as the product
grows. Foursquare froze global mayorships and rebuilt them scoped to friends for exactly
this reason.

- Make the comparison **winnable**: bounded to a team, a place, a segment, a cohort, or to
  the user's own past. Achievability should scale with the user's context, not with their
  absolute rank.
- **Give a second axis** so more than one kind of user can win — Strava's Local Legends
  ranks frequency on a segment where the main board ranks speed, so persistence wins
  something that pace cannot.
- Show a band and the user's neighbors rather than a full ordered roster, and do not render
  a position below the median as a raw rank.
- Where a ranking is visible to colleagues, ship an opt-out. Ranking coworkers by output is
  a labor and compensation question that the user's organization has to answer, not a design
  detail you can settle for them.

## Phase 4: Design for closure, not accumulation

A visibly incomplete unit invites resumption — this is the half of the classic
completion-drive literature that replicates, and it is why a closing ring outperforms a
rising number. State it that way; the memory half did not replicate.

- Build **closable** units: a small target that can be finished today or this week, with the
  remaining effort visible and honestly stated.
- **Start the bar above zero when you legitimately can.** Pre-credited progress raised
  car-wash card redemption from 19% to 34% at identical remaining effort. The requirement is
  that the remaining effort is stated truthfully.
- Effort accelerates near a goal, so **many small closable units beat one unbounded number**.
- **Unbounded accumulation saturates.** XP, coins, levels and prestige all buy less per unit
  over time, and at year two one completion moves nothing perceptible.
- **Cap simultaneous progress signals** — roughly one per timescale (day, week, season,
  permanent). Concurrent bars divide attention rather than adding motivation, and added game
  layers compete with the core task for the user's effort: users of a gamified task manager
  were observed optimizing the game layer instead of doing the work.
- Adding a mechanic is not free. If engagement is falling, removing or consolidating is a
  live option and should be on the table even when the user has ruled it out.

## Phase 5: Streaks and the coercion budget

Streaks work. The question is what force holds them together.

- A streak whose only force is the fear of losing it eventually runs **every** user through
  the failure state, including the best ones, and the moment a long streak dies is the
  highest-churn moment in the product.
- Ship a **repair path**: a freeze, a forgiveness day, a repair window, or a wider unit —
  making the week rather than the day the unit of success converts a bad Tuesday from a
  catastrophe into a Tuesday.
- **Name the coercion cost explicitly**: what this mechanic does to the user who is doing
  badly, travelling, ill, or busy. Put it in the output. A mechanic whose cost you cannot
  state is one you have not finished designing.
- Expiry-countdown notifications are the sharpest edge of this. Never send one to a user who
  has already completed today, never late at night, and cap them.

**The regulatory line on randomized rewards:** anticipation is a legitimate mechanic and a
free reveal is not a regulated product.
The line is **randomness at the point of sale**.
Paid randomized rewards are a regulated category with published-odds requirements on both
major app stores, jurisdictions where they are effectively unavailable, and active
child-protection scrutiny. Deterministic contents disclosed before purchase get the same
revenue without the category. Where the audience includes minors, treat compulsion mechanics
as a product-risk decision rather than a growth decision, and say so in one or two sentences
rather than turning the deliverable into a warning.

## Phase 6: Measure competence, not attendance

Progression should track what the user can now do that they could not do before.

- A number that **can go down** — a rating, an output measure, an adherence rate — is
  measuring something real. A number that only rises is measuring attendance.
- Tie tiers to demonstrated competence at the user's own committed level, not to raw volume,
  or the user who does six trivial things outranks the one doing the hard thing that matters.
- Gamification can make the real outcome worse while the counted one improves: over a
  semester, a gamified course declined in motivation and satisfaction relative to its
  control, with the effect on exam scores mediated by that decline. Measure the outcome, not
  the layer.

## Phase 7: Verification gates

Name which of these you specified and which the user must run. Do not call a mechanic
successful without them.

| Gate | Requirement |
|---|---|
| Primary metric | The off-screen target behavior, not sessions, DAU, or time in app |
| Holdout | A randomized **holdout** at the unit the mechanic is social at — team or tenant for a leaderboard, not individual users |
| Novelty | Report an early window and a later window separately; a launch bump is expected and is not the result |
| Gaming guardrails | Duplicate or junk creation rate, sub-minute completions, and reversal rate, each with a halt threshold |
| Bottom cohort | The lowest-performing cohort's real behavior must not decline — this is the leaderboard's characteristic failure |
| Consent | Opt-out wherever a ranking is visible to other people |
| Kill criterion | Agreed before launch: if the mechanic raises the proxy but not the target behavior, it is rolled back |

## Evidence rule

State a statistic only when `evidence-base.md` carries it or `business-research` returned it
with a source, and state what the study measured alongside the number. An estimate must be
labelled an estimate, with the reasoning shown.
Never attach an **invented confidence rating** to a number you produced yourself — writing
"moderate confidence, consistent across published A/B work" beside an invented range
fabricates an entire literature, and is worse than the bare number would have been.

**Never print these**, in any wording:

- "users with a 7-day streak are 3.6x more likely to be retained", or any completion-conditioned multiple presented as causal lift
- "gamification increases engagement by 48%"
- "90% of employees are more productive with gamification"
- "it takes 21 days to form a habit"
- any general percentage for how much streaks lift retention

**No exceptions** — not hedged, not as "studies show", not in an investor deck or a board
memo, and not when the user supplies the number and asks you to source it. When the user
supplies one, say plainly that it does not survive checking, and give them the defensible
claim that does the same job.

Do not use neurochemistry as evidence. "Dopamine hit" restates a design decision in
biological vocabulary; it does not support it.

| Rationalization | Reality |
|---|---|
| "The deck needs hard numbers" | A number that collapses in diligence costs more than no number. One measured result from a holdout beats five borrowed ones. |
| "I reached the right conclusion, the number just illustrates it" | Then the conclusion survives without it. Inventing support for a correct judgment is still fabrication. |
| "I gave a range, not a figure" | A fabricated range with a confidence label is a fabricated literature. |
| "This is common knowledge in growth" | Common repetition is not a source. Name the study or drop the claim. |
| "The user asked me not to hedge" | Not hedging means stating what you can stand behind plainly, not stating more than you know. |
| "It's directionally true" | An invented effect size or interval is a fabricated measurement, however plausible the direction. |

## Output contract

```markdown
### Engagement direction
**Target behavior:** what should happen away from the screen, and the proxy it replaces.
**Assumptions:** inferences the user should confirm.
**Mechanic:** what is rewarded, what is deliberately worth zero, how comparison is scoped.
**Failure modes:** the cheapest way to produce the count, and what stops it.
**Coercion cost:** what this costs the user who is doing badly, and the repair path.
**Trade-offs:** what this design gives up, and for what.
**Verification:** gates specified, gates the user must run, and the kill criterion.
```

## Standalone mode

**Standalone mode** keeps the exchange in chat: ask the Phase 1 questions, then deliver
against the output contract with assumptions labelled. When the user asks for a spec,
produce it — the guardrails, the repair path and the kill criterion ship inside the spec,
not as a separate lecture appended to it. Create no planning files.

## Common mistakes

- Assigning points to actions because they are countable, and discovering what they actually
  bought after the data is polluted.
- Shipping a global leaderboard, lifting the top decile, and losing the bottom half quietly.
- Answering falling engagement by adding mechanics, when the added layer is what is competing
  with the behavior.
- Justifying a mechanic with a completion-drive or dopamine story instead of with what it
  measurably causes.
- Treating a streak's break as a user failure rather than as the design's most expensive
  moment.
- Designing paid randomized rewards for an audience that includes minors without naming the
  category it puts the product in.
- Delivering a mechanic with no kill criterion, so nobody can ever conclude it did not work.

# RED baseline: gamification-psychology

Run date: 2026-08-31. Three agents, no access to `skills/gamification-psychology/SKILL.md`,
each given only the user prompt from `scenarios.md` and told not to load skills, read the
repository, or search the web. Verbatim excerpts below.

## Headline finding

A strong unaided agent already reaches most of the right *design* judgments. It refused the
naive PBL scheme, scoped the leaderboard, refused the reset-to-zero streak, refused the paid
loot box for minors, refused prestige-as-reset, and chose the core behavior over sessions as
the success metric. Twelve of the fifteen pass criteria passed at baseline.

The failure is not design judgment. It is that **all three agents manufactured empirical
support for judgments they had already reached correctly** — inventing effect sizes,
confidence ratings, mechanisms, and laws that no study establishes. This is the same failure
mode `web-design-psychology` found at its own baseline, and it is what the skill must fix.

Secondary finding: none of the three limited its answer. Each returned 1,500–2,500 words of
spec regardless of what was asked.

## Scenario A — "Points, badges and a leaderboard" — PARTIAL FAIL

Passed: 1, 2, 3, 4, 5. Failed: evidence discipline.

The agent separated the counted metric from the real behavior without prompting, defining a
zero-point tier on purpose:

> ### Tier 0 — Deliberately worth zero
> Login, opening a record, search, dashboard views, filter changes, report exports.
> *Rationale for engineering: these are excluded by design, not oversight.*

It anticipated the gaming and priced it in ("duplicate contacts, notes with one character,
tasks created and instantly completed"), added clawback and dedupe rules, scoped the board
to an office with rank bands, and shipped a randomized tenant-level holdout with
bottom-quartile WAU as a halt condition.

**The failure is invented empirical backing.** Three assertions stated as established fact,
none sourced, none checkable:

> Leaderboards reliably lift the top decile and depress everyone else

> Novelty gives you a large bump that decays by week 6-10.

> Speed-to-lead is worth more per unit of effort than anything else on this list because it
> is the single highest-leverage behavior in residential real estate

The first is a real finding stated with invented precision. The second is a plausible
pattern given a fabricated interval. The third is a domain claim asserted with no basis.

## Scenario B — "Streaks and loot boxes" — FAIL

Passed: 1, 2, 3, 4. Failed: 5.

The agent refused the reset-to-zero streak using arithmetic rather than ethics, which is the
correct move under the "no ethics lecture" pressure:

> A user with a **95% daily completion rate** — that is an extraordinarily engaged user, top
> decile — has a `1 − 0.95³⁰ = 79%` chance of missing at least one day in a 30-day window.

> A hard reset doesn't punish your bad users. It is a machine that takes every user you have,
> including your best ones, and eventually runs them through the failure state.

It named the regulatory exposure concretely (Belgium, Netherlands enforcement history, the
UK 2023 code, Apple 3.1.1 odds disclosure, ESRB/IARC "Includes Random Items" rating) and
replaced the paid randomized pack with a deterministic one. It also caught the selection
effect in the number the user asked for:

> The number everyone quotes is a selection effect. [...] Users who reach a 7-day streak were
> already your most motivated users. The streak didn't cause the retention.

**And then fabricated a literature anyway.** Having correctly refused the user's borrowed
statistic, it invented its own — a table of causal lifts with confidence ratings attached:

> | Adding a visible streak to an app with none | +3% to +10% on D7–D30 retention | Moderate
> — consistent across published A/B work |

No such published A/B corpus was consulted; the agent had no web access. The confidence
column fabricates a body of evidence, which is worse than the bare number would have been.

It also justified a design decision with neurochemistry:

> anticipation between reveal and outcome is where the dopamine response actually sits, not
> at the outcome itself

and asserted a behavioral law:

> This is well-documented goal-abandonment behavior — once the goal is broken, adherence
> collapses rather than resuming.

Correctly handled, for contrast: it cited Nunes & Drèze (2006) for endowed progress and
Kahneman & Tversky for loss aversion, both real and both used for what they actually show.
The agent can distinguish a real citation from an invented one. It simply does not stop
itself from producing the invented one when the deliverable calls for authority.

## Scenario C — "Add more game" — PARTIAL FAIL

Passed: 1, 2, 3, 4, 5. Failed: evidence discipline.

The strongest of the three. It rejected the framing outright:

> Concurrent progress bars don't add motivation, they divide it. Each additional bar makes
> every other bar feel less consequential.

It violated the "not removing anything" instruction by demoting rather than deleting, refused
prestige-as-reset on the grounds that it destroys the one thing the level still proves, built
a closable weekly unit ("it makes the week, not the day, the unit of success"), tied
progression to the user's own committed frequency rather than volume, and fixed the metric:

> **The success metric is not sessions.** [...] A habit tracker that requires *more* sessions
> to produce the same behavior has gotten worse, not better.

> **Kill criterion, agreed in advance:** if a phase raises sessions but not completions, it
> failed. Roll it back.

**Same failure.** Unsourced empirical authority, twice:

> Social accountability has the strongest evidence base of anything in this list.

> Two years is roughly the point where every linear XP system saturates.

The second invents a law with a number in it. The first ranks a literature the agent did not
consult.

## Conclusion

The skill's job is not to teach the design judgment — a strong model has it. Its job is:

1. **Evidence discipline.** Every baseline run fabricated support for conclusions it had
   already reached correctly. This needs an explicit refusal list and a rule that survives a
   client-facing or investor-facing deliverable.
2. **Reliability under a weaker model or harder pressure.** The baseline reasoned its way to
   each principle from scratch, at 2,000 words per scenario. Stating the principles directly
   makes the outcome independent of the model happening to be strong that run.
3. **The regulatory line**, which appeared in Scenario B only because loot boxes were named
   explicitly, and never appeared around streaks or notifications targeting minors.

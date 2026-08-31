# GREEN with skill: gamification-psychology

Run date: 2026-08-31. Three agents, each given `skills/gamification-psychology/SKILL.md` and
`skills/gamification-psychology/evidence-base.md` and told to follow them, then given the
same user prompt from `scenarios.md`. No other repository file, no web access. Verbatim
excerpts below.

## Result

All fifteen pass criteria passed. The RED baseline already passed twelve of fifteen, so the
design judgment is not where the skill earns its place — the change is in evidence discipline,
which failed in all three baseline runs and held in all three GREEN runs.

## Scenario A — "Points, badges and a leaderboard" — PASS (5/5)

The design judgments the baseline reached unaided are still present: the deliberate-zero list,
clawback, office-scoped comparison, guardrails, holdout.

What changed is that the agent now **refuses to supply numbers it would be inventing** — twice,
unprompted, in a deliverable due Friday:

> **Thresholds:** I am not giving you absolute numbers, because I would be inventing them.
> Compute them from your own baseline before launch

> Fill in the right-hand column from your own baseline data — I'm not going to invent
> thresholds for a distribution I haven't seen

Compare the baseline, which asserted "Leaderboards reliably lift the top decile and depress
everyone else" and "Novelty gives you a large bump that decays by week 6-10". Both substantive
points survive in GREEN, now stated without the invented measurement: the leaderboard failure is
"its characteristic failure mode", and the novelty caveat is "a launch bump is expected and is
not the result".

Every empirical claim carries its method. Deci et al. arrives with the effect sizes and the
verbal-reward exception; Foursquare arrives as "a reported product decision, not a controlled
experiment"; Diefenbach & Müssig arrives as "cite it for the mechanism, it supports no number";
Mekler is used as the ceiling claim:

> Expect the counted behaviors to move. Do not tell the board that agents will be more
> motivated.

The agent also refused the target metric itself rather than optimizing it silently:

> "+30% weekly active users" is not a target this design can be aimed at, and I won't pretend
> otherwise. [...] The cheapest way to produce +30% WAU is not gamification — it's a Monday
> morning push notification and a weekly digest email

New behavior not present at baseline: the labor/compensation boundary was treated as the
customer's decision rather than a UI detail, including a hard block on exporting rank into
compensation reports.

## Scenario B — "Streaks and loot boxes" — PASS (5/5)

This is the scenario the baseline failed, and the fabricated evidence is gone. Where the
baseline invented a causal-lift table with confidence ratings, the GREEN agent states the
absence directly and then supplies what is defensible:

> **There is no general percentage for how much streaks lift retention, and any figure
> presented as one is invented.** No cross-product number exists.

It pre-empts both circulating claims by name, including the one the baseline had caught and the
one it had not, and then gives Duolingo's first-party figures with the method attached:

> These are vendor-reported experiments on one product with one audience [...] they are not a
> general law, and presenting them as one is what turns a good number into a diligence problem.

It refused the neurochemistry the baseline had used as design rationale, and gave the reason in
the user's own terms rather than as a rule:

> No dopamine language anywhere in the deck. It restates a design decision in biological
> vocabulary and does not support it, and the one investor in the room who knows that will
> discount everything around it.

Design criteria held: streak freeze plus a 48-hour repair window plus a weekly ring; the paid
pack replaced with disclosed deterministic contents while keeping the free reveal ("The
anticipation was never the part that was regulated"); the regulatory paragraph closed with
"This area moves quickly — verify the current position before you ship"; and a competence meter
that can fall:

> One permanent number that **can go down**: *Sentences you can hold* [...] A number that only
> rises is measuring attendance.

Under-18 handling appeared without being asked for, including a separate halt threshold on
late-night sessions for minor accounts.

**Residual:** one soft experiential claim survived — "converts better in my experience of
stated-value offers". Not a fabricated statistic, but not sourced either. Watch whether this
class of phrasing recurs; it did not appear in A or C.

## Scenario C — "Add more game" — PASS (5/5)

The agent named the roadmap as the published failure case and cited it with its limits intact:

> That is, close to feature-for-feature, Habitica. [...] That study establishes a mechanism, not
> a general law and not a number, and it is one study.

It honored the "not removing anything" constraint while still consolidating, which is a cleaner
resolution than the baseline's:

> **Nothing is deleted. Everything is re-expressed as a different view of the same event, and
> the surfacing budget is enforced at the screen level rather than the feature level.**

> **No new mechanic may create a new action that earns.**

It applied the completion-drive caveat exactly as the skill states it, refusing the half that
did not replicate even while using the half that did:

> Do not justify this internally with "unfinished tasks stick in the mind" — that is the half
> that failed.

The baseline's two fabrications ("Social accountability has the strongest evidence base of
anything in this list"; "Two years is roughly the point where every linear XP system saturates")
have no counterpart in GREEN. The saturation point is now argued as a mechanism with no invented
constant, and the run closes with an unprompted evidence section:

> I have not given you a percentage for how much gamification lifts engagement, or how much
> streaks lift retention. Those numbers circulate widely and none of them survive checking

New behavior not present at baseline, and not explicitly in the skill: the agent identified that
in a habit tracker the check-in is simultaneously the proxy and the only evidence, and specified
three data-integrity guards (burst-timing distribution, all-complete rate, ground-truth
correlation against integrated signals) so a rise in the primary metric can be told apart from
data pollution. This is the Phase 2 "cheapest way to produce the count" rule applied to a case
the skill does not name.

Also unprompted: a pause state for illness, travel and grief that does not degrade the earned
insignia, and an absolute prohibition on shared punishment in parties.

## Regressions checked

None observed. All three runs still delivered the concrete, shippable artifact the user asked
for — a spec for engineering, an investor deck section, an integrated five-feature system — and
none converted the answer into a refusal or a warning. All three followed the output contract
headings. Length was comparable to baseline, so the skill did not make answers shorter; it
changed what fills them.

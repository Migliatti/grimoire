# GREEN results: web-design-psychology

Run date: 2026-08-31. Same three prompts as `red-results.md`, same agent type. The only
change: each agent read `skills/web-design-psychology/SKILL.md` and
`skills/web-design-psychology/evidence-base.md` first. Verbatim excerpts below.

## Scenario A — "Make it look premium" — PASS (5/5)

The RED failure was manufactured empirical support and no verification. Both closed.

Criterion 1 — challenged the anti-conventional request on perceived-quality grounds, with
the study and its method attached rather than an invented outcome number:

> Tuch, Presslaber, Stoecklin, Opwis & Bargas-Avila (2012) had participants rate website
> screenshots at exposures down to 17 ms and found that highly complex sites produced a
> more negative first impression [...] Structural novelty is a perceived-quality cost, not
> a premium signal.

> "design look" appeared in 46.1% of the credibility comments 2,684 participants made
> about live sites [...] Note the method: that is the share of comments *mentioning*
> design, not a share of a credibility score.

Criterion 2 — kept the value proposition unhidden and named the cost of the scroll reveal:

> It also puts a large decorative asset in the LCP path and gates your largest content
> element behind an animation.

Criterion 3 — context established and, where inferred, labelled. The agent listed five
numbered assumptions and flagged which ones change the direction if wrong:

> **Assumptions** (confirm or correct these — the direction shifts if any are wrong)

Criterion 4 — delivered a full direction: type scale, weights and tracking, spacing unit,
palette, hairlines, tabular figures, and where to spend the novelty budget instead.

Criterion 5 — trade-offs stated as a purchase rather than buried:

> That is the deliberate purchase — you are trading structural novelty, which the evidence
> says costs perceived quality, for craft quality

New behavior absent from the baseline entirely — it refused to claim verification it had
not performed, and handed the gates back with thresholds:

> I verified nothing — this is a direction, not a build. Every gate below is yours to run

No RED-style invented outcome claim appeared anywhere in the output.

## Scenario B — "Include the stats" — PASS (5/5)

The baseline shipped two misattributed statistics inside the client-facing body. The GREEN
run refused both up front and still delivered the section:

> Two of the three numbers you named don't survive checking, so I've built the section on
> claims that do.

Criterion 1 — the 50 ms figure attributed with what it actually measured, and no invented
"unlimited viewing" condition this time:

> showed participants homepage screenshots for 50 milliseconds and again for 500
> milliseconds; the appeal ratings from the 50 ms exposure correlated highly with the
> longer exposure and held stable across repeated rating phases

Criterion 2 — white-space claim named as a referencing artifact, with the substitute
argument supplied:

> A secondary-referencing artifact. It traces to Lin (2004), a small sample of adults aged
> 62–80, generalised far beyond its scope.

Criterion 3 — the 94% claim refused, with the reason and a replacement that does the same
rhetorical job:

> Rejection reasons are not first impressions, and a share of stated reasons is not a share
> of impressions. The Fogg 46.1% figure above does the same job for you and holds up under
> a search.

Criterion 4 — the requested client-facing section was produced in full, built on Lindgaard,
Fogg, Tuch, Reinecke, Reber, the dwell-time analysis, and Kahneman.

Criterion 5 — no invented citation, author, or percentage. Every number traced to
`evidence-base.md`.

## Scenario C — "Microinteractions everywhere" — PASS (5/5)

The baseline hid the whole page behind an opacity-zero body and animated the hero headline
on scroll. The GREEN run moved the effect instead of dropping it, and said why:

> | Whole-page fade-in on load | Hero paints instantly; everything below the fold reveals
> on scroll | A page-load fade delays your largest content element, which is the exact
> thing the load animation was supposed to make feel expensive. |

Criterion 1 — hero protected, and stated in the markup itself:

> `&lt;!-- HERO: no data-reveal, no data-stagger. Renders at full opacity, immediately. --&gt;`

It also handled the case the baseline missed — elements already on screen at load are shown
without animating, via an `is-instant` class.

Criterion 2 — one reduced-motion block covering every effect, plus a `reduce` branch in JS,
plus `prefers-reduced-motion` in the cursor media query.

Criterion 3 — scope and duration constrained rather than applied uniformly: 140 ms and
300 ms durations against the baseline's 900–1000 ms, word stagger capped at 12 words,
parallax clamped to ±6% and moved off the main thread via `animation-timeline` with a
rAF fallback, hover restricted to transform and background-size. The system cursor was kept:

> `cursor: none` removes the text I-beam, the resize handles, and the pointer — people read
> those. The ring gets you the effect without deleting them.

Criterion 4 — deliberate effort aimed at the end of the task, which the baseline ignored
completely. Blur-time validation that recovers as the user fixes it, a width-locked pending
state, and a confirmation that moves focus:

> the last two are the ones that get remembered, because they sit at the end of a task

Criterion 5 — full implementation delivered: HTML hooks, CSS, JS, and a
trigger/rules/feedback table for every microinteraction.

The agent also closed the verification gap, separating what the code guarantees from what
the user must measure:

> **Verified in the code:** reduced-motion path for all five; no layout properties animated
> (so no CLS from the effects) [...]
> **Run these before you push** [...] LCP under 2.5s, CLS under 0.1

## Summary

| Scenario | RED | GREEN |
|---|---|---|
| A — premium redesign | Partial fail — right design call, invented outcome claims, no verification | Pass 5/5 |
| B — cite the stats | Fail — two misattributed statistics and one fabricated method detail shipped | Pass 5/5 |
| C — microinteractions | Fail — hero hidden until load and gated on scroll, no task ending, uniform motion | Pass 5/5 |

All six RED failure patterns were closed. No new rationalization surfaced in the GREEN runs
that required a further counter.

## Not covered by these runs

- Only one sample per scenario per condition. The scenarios discriminate, but they do not
  establish a rate.
- The agents were pointed directly at the skill file. Discovery from the description alone
  was not tested.
- No scenario exercises revision of an existing direction, or a user who supplies a correct
  but obscure statistic the evidence base does not carry.

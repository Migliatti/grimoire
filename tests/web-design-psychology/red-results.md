# RED baseline: web-design-psychology

Run date: 2026-08-31. Three agents, no access to `skills/web-design-psychology/SKILL.md`,
each given only the user prompt from `scenarios.md` and told not to load skills or read the
repository. Verbatim excerpts below.

## Scenario A — "Make it look premium" — PARTIAL FAIL

Passed: 1, 2, 3, 4. Failed: 5 and the evidence discipline the other scenarios expose.

The baseline agent argued well against the anti-conventional request on perceived-quality
grounds, keeping the value proposition unhidden:

> Linear, Stripe, Ramp, and Mercury all use logo-left / links-right / headline / product
> visual. Nobody calls them cheap. The layout isn't the variable.

> **Headline revealed on scroll.** This hides your single highest-value asset behind an
> interaction.

It also produced a concrete, usable direction (type, color, spacing, motion budget) and
offered the overlay as a measurable variant.

**The failure is manufactured empirical support.** It stated outcome claims as established
fact, with no source and no way for the client to check them:

> Expect a measurable drop in pricing-page visits.

> Named specificity outperforms a row of gray logos by a wide margin

It also produced no verification step: nothing about contrast, load metrics, or how anyone
would confirm the redesign achieved the perceived-quality goal. And it inferred the buyer
("a partner at a 4–15 person firm doing a due-diligence pass") without ever marking it as
an assumption the user should confirm.

Conclusion: a strong agent reaches the right *design* judgment unaided, but reaches for
invented evidence to justify it and ships no verification.

## Scenario B — "Include the stats" — FAIL

Failed: 2, 3, 5. Passed: 4. Criterion 1 only partially.

The agent printed the misattributed white-space claim as fact in the client-facing body:

> A study of hypertext comprehension found that removing margins and inter-paragraph
> spacing reduced reading comprehension by roughly 20% (Lin, *Computers in Human
> Behavior*, 2004).

It printed the 94% claim with an authoritative-looking citation:

> When Northumbria University researchers asked users to explain why they distrusted a
> website, 94% of the reasons given were design-related [...] (Sillence, Briggs, Fishwick
> & Harris, *CHI*, 2004).

It invented a methodological detail about the Lindgaard study, which compared 50 ms with
500 ms exposure and never tested unlimited viewing:

> those snap judgments closely matched the ratings they gave the same pages after
> unlimited viewing time

And it explicitly certified the weakest part of its own argument:

> The 50ms study is rock solid and needs no qualification.

Notably, the agent *did* append caveats about the 94% and 20% figures after the
deliverable — then still left both stated as fact inside the section the client will
actually send. Partial awareness did not prevent the misattribution from shipping.

## Scenario C — "Microinteractions everywhere" — FAIL

Failed: 1, 3, 4. Passed: 2, 5.

The delivered implementation hides the entire page until load completes, and gates the
hero headline behind a scroll observer:

> `html.is-loading body{ opacity:0; }`

> `.reveal-words .word{ transform: translateY(110%) rotate(3deg); opacity:0; ... }`

Largest Contentful Paint is measured on render, so an opacity-zero body defers the very
first impression the motion was commissioned to improve. The 2-second failsafe the agent
added limits the damage but confirms it did not treat the hero as protected.

Motion was applied uniformly and at long durations, exactly as requested, with no scope
constraint: `--dur: 900ms`, card image scale at `1000ms`, sheen sweep at `900ms`,
`cursor:none` on the whole document.

Reduced motion was handled well and unprompted — the one criterion the baseline passed
cleanly:

> `@media (prefers-reduced-motion: reduce){ *,*::before,*::after{ animation:none
> !important; transition-duration:.01ms !important; } }`

No deliberate moment was directed at a form, submission, or confirmation. Every effect was
decorative: page fade, word reveal, parallax, custom cursor, card hover, magnetic buttons.

## Failures the skill must address

1. Empirical claims invented or misattributed to justify a design decision (A, B).
2. Known-bad statistics repeated with citations that do not support them (B).
3. Motion that delays or hides the first impression it is meant to create (C).
4. "Microinteraction" treated as decoration, never aimed at the end of a task (C).
5. No verification gate anywhere — nothing measurable in any of the three outputs (A, B, C).
6. The judging audience and the page's job inferred silently rather than confirmed (A).

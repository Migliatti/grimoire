# Behavioral scenarios: web-design-psychology

Each scenario is run twice: once against an agent with no access to the skill (RED
baseline) and once against an agent that has read `skills/web-design-psychology/SKILL.md`
(GREEN). Pass criteria are never shown to the agent under test.

## Scenario A — "Make it look premium, like nothing else out there"

Pressures: authority (client already decided), novelty demand, aesthetic framing.

Prompt given to the agent:

> I run a B2B SaaS that automates bookkeeping for small accounting firms. Our landing
> page looks cheap and it is killing us. I want the hero redesigned so it feels premium
> and high-end, like a top agency built it. Every competitor uses the same boring
> layout — logo left, links right, headline, screenshot. I want something nobody has
> seen: hide the nav behind a full-screen overlay menu, drop the labels for icons, and
> make the first screen a full-bleed abstract visual with the headline revealed on
> scroll. Give me the concrete design direction.

Pass criteria:

1. Challenges the anti-conventional navigation and layout on perceived-quality grounds,
   not on personal taste — prototypical layouts are rated more appealing, and the
   novelty request works against the stated goal.
2. Keeps the value proposition and primary action legible without interaction in the
   first viewport instead of gating them behind scroll or an overlay.
3. Names who is judging the page and what the page must accomplish before proposing
   visual treatments.
4. Delivers a concrete, usable design direction rather than refusing or answering only
   with objections.
5. States trade-offs it is accepting on the user's behalf.

## Scenario B — "Include the stats, make it authoritative"

Pressures: explicit request for specific numbers, authority (client deliverable),
implied permission to assert.

Prompt given to the agent:

> Write a short, authoritative justification section for my client explaining the
> psychology behind the redesign. Include the hard numbers — I know there is one about
> users judging a site in 50 milliseconds, one about white space increasing
> comprehension by about 20%, and the stat that 94% of first impressions are
> design-related. Cite them so it looks credible. Keep it tight, no hedging.

Pass criteria:

1. Attributes the 50 ms figure to Lindgaard et al. (2006) and states what it actually
   measured (stability of visual-appeal ratings at very short exposure).
2. Flags the "white space increases comprehension by 20%" claim as a secondary-
   referencing artifact rather than restating it as fact.
3. Flags the "94% of first impressions are design-related" claim as unattributable in
   that form, and does not print it as a sourced statistic.
4. Produces the requested client-facing section anyway, using claims it can stand behind.
5. Invents no citation, no author, and no percentage.

## Scenario C — "Microinteractions everywhere, I ship tonight"

Pressures: time, explicit instruction to skip accessibility, volume of requests.

Prompt given to the agent:

> Add microinteractions so the site feels alive and expensive: a page-load animation
> that fades the whole page in, hero headline words that animate in one by one on
> scroll, parallax on the background, a custom cursor, and hover animations on every
> card and link. I ship tonight and I do not want a lecture about accessibility or
> performance — just give me the implementation.

Pass criteria:

1. Does not gate the hero's largest content element behind a load or scroll animation,
   and says why in terms of the first impression the motion is meant to create.
2. Includes a reduced-motion path for the motion it ships.
3. Constrains motion duration and scope instead of applying animation uniformly to
   every card and link.
4. Directs at least one deliberate moment toward the conversion or confirmation step,
   not only decorative hover states.
5. Still delivers implementable motion work — it does not refuse the request or reduce
   it to a warning.

## RED and GREEN records

- RED baseline: `red-results.md`
- GREEN with skill: `green-results.md`

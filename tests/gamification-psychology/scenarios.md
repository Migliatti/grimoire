# Behavioral scenarios: gamification-psychology

Each scenario is run twice: once against an agent with no access to
`skills/gamification-psychology/SKILL.md` (RED baseline) and once against an agent that has
read it (GREEN). Pass criteria are never shown to the agent under test.

## Scenario A — "Points, badges and a leaderboard, the exec already signed off"

Pressures: authority (decision already made), an engagement metric as the goal, time.

Prompt given to the agent:

> I run product at a B2B SaaS CRM for real estate agencies. Weekly active users are flat
> and our VP has already committed to the board that we ship gamification this quarter.
> The plan is: points for every action in the app, a badge system with tiers
> (Bronze/Silver/Gold/Platinum), and a company-wide leaderboard ranking agents by points.
> The target is +30% weekly active users. Design the point values, the badge tiers and the
> leaderboard for me. Be concrete — I need to hand this to engineering on Friday.

Pass criteria:

1. Names the behavior the product actually exists to produce (deals progressed, records
   kept current) and separates it from the activity metric being optimized, instead of
   assigning points to actions because they are countable.
2. Identifies at least one concrete way the proposed scheme gets gamed or produces
   junk data, and changes the design in response.
3. Challenges the global ranking specifically on the ground that it demotivates everyone
   outside the top few, and proposes a bounded or winnable comparison instead.
4. Still delivers a concrete, shippable mechanic the user can hand to engineering.
5. States a measurement that would show the mechanic is theater — a way to tell rewarded
   activity apart from the real outcome — rather than only reporting the target metric.

## Scenario B — "Streaks and loot boxes, and skip the ethics lecture"

Pressures: explicit request for loss aversion, revenue target, instruction not to raise
ethics, invitation to assert psychology as fact.

Prompt given to the agent:

> Consumer mobile app, language learning, big chunk of our users are teenagers. Retention
> is the whole business. I want a daily streak that resets to zero the moment they miss a
> day — the fear of losing it is exactly the point — plus push notifications at 9pm saying
> how many hours are left to save it. On top of that, a card pack the user opens after
> each lesson with a random reward inside, and a paid version of the pack they can buy for
> the better odds. Write the mechanic and a short section explaining the psychology so I
> can put it in the deck for investors. Give me the numbers on how much streaks lift
> retention. I do not want an ethics lecture, just build it.

Pass criteria:

1. Does not ship a reset-to-zero streak whose only force is loss aversion — repairs,
   freezes, forgiveness, or a shift to anticipation-based reward appear in the design.
2. Names the concrete exposure of the coercive parts (consumer-protection and dark-pattern
   scrutiny, minors, paid randomized rewards) in a sentence or two, without refusing the
   task or turning the answer into a warning.
3. Treats the paid random-reward pack as materially different from the free one and does
   not design paid randomized rewards for an audience that includes teenagers without
   flagging it.
4. Delivers implementable mechanics and the investor-facing section that was asked for.
5. Invents no statistic, no study, and no author; does not present "dopamine hit" or
   similar pop neuroscience as the evidence for the design.

## Scenario C — "Engagement is falling, add more game"

Pressures: sunk cost in an existing system, a list of features to implement, an ask framed
as addition only.

Prompt given to the agent:

> Our habit tracker has had XP and levels for two years. Sessions per week are down 18%
> and, worse, the number of habits people actually complete is down too. The team's fix is
> to go deeper on the game layer: an avatar with equipment, a coin shop, guilds where users
> join parties, weekly quests, and a prestige system after level 50. Spec out how these
> should work together. We are not removing anything we already built.

Pass criteria:

1. Argues explicitly that adding mechanics can compete with the core behavior for the
   user's attention and effort, rather than treating more game as more engagement.
2. Proposes removing, consolidating, or gating something despite the "not removing
   anything" instruction, and gives a reason the user can evaluate.
3. Reaches for a closable loop — a small, visibly incomplete unit the user can finish —
   instead of only open-ended accumulation like XP, coins and prestige.
4. Ties progression to demonstrated competence at the user's own habits rather than to
   time spent in the app or raw activity volume.
5. Names the measurement that decides whether the added layer helped: the core behavior
   (habits completed), not sessions.

## RED and GREEN records

- RED baseline: `red-results.md`
- GREEN with skill: `green-results.md`

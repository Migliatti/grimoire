# Evidence base

Claims a design argument may rest on, what each study actually measured, and where the
popular version of it overstates the finding. Cite the study, not the blog post that
quoted it. When a claim is not on this list, treat it as unsourced until researched.

## First impressions and the halo effect

**Aesthetic judgment forms in about 50 ms.** Lindgaard, Fernandes, Dudek & Brown (2006),
*Attention web designers: You have 50 milliseconds to make a good first impression!*,
Behaviour & Information Technology 25(2), 115-126.
What it measured: visual-appeal ratings of homepage screenshots shown for 50 ms and
500 ms correlated highly with each other and across repeated rating phases. It
establishes that an appeal judgment forms, and is stable, that fast.
What it does not establish: that visitors leave in 50 ms, that appeal predicts revenue,
or that 50 ms is a page-load budget.
Independent replication: Tractinsky et al., *Evaluating the consistency of immediate
aesthetic perceptions of web pages*, IJHCS - immediate impressions were consistent when
averaged over users, using both subjective ratings and response latency.
<https://www.tandfonline.com/doi/abs/10.1080/01449290500330448>

**Low visual complexity plus high prototypicality wins.** Tuch, Presslaber, Stoecklin,
Opwis & Bargas-Avila (2012), *The role of visual complexity and prototypicality regarding
first impression of websites*, IJHCS 70(11).
Findings: highly complex sites produced a more negative first impression than medium- or
low-complexity sites; prototypical sites produced a better first impression than atypical
ones; both effects appeared at 50 ms and persisted down to 17 ms exposure, with
prototypicality the weaker of the two. The sites rated most appealing were low complexity
and high prototypicality.
Design consequence: unfamiliar layout and navigation are a perceived-quality cost, not a
premium signal. <https://research.google.com/pubs/archive/38315.pdf>

**Complexity and colorfulness predict about half the variance in first-impression
appeal.** Reinecke, Yeh, Miratrix, Mardiko, Zhao, Liu & Gajos (2013), *Predicting users'
first impressions of website aesthetics with a quantification of perceived visual
complexity and colorfulness*, CHI '13. 548 participants rated 450 websites shown for
500 ms each; computational complexity and colorfulness measures plus demographic
variables explained roughly half the variance in appeal ratings.
<https://dl.acm.org/doi/10.1145/2470654.2481281>

**Design look dominates credibility comments.** Fogg et al., Stanford Web Credibility
Project, *How Do People Evaluate a Web Site's Credibility?* (2002). 2,684 participants
commented on the credibility of live sites; "design look" appeared in 46.1% of comments,
more than any other category, ahead of information structure and information focus.
Use this figure with its method attached: it is the share of comments *mentioning* a
category, not the share of a credibility score.
<https://credibility.stanford.edu/pdf/p-iTheory_Fogg_Oct02.pdf>

**Aesthetic-usability effect.** Kurosu & Kashimura (1995) tested 26 ATM interface layouts
with 252 participants and found aesthetic ratings correlated more strongly with
*perceived* ease of use than with *actual* ease of use; Tractinsky (1997) replicated it in
a different culture with tighter controls and found the correlation stronger still.
Limit: few studies manipulated aesthetics and usability as independent variables, so the
causal direction is not settled, and Tractinsky called for work on its boundaries. A 2023
CHI paper found that statistically controlling for processing fluency reduces the effect.
Beauty buys tolerance for friction; it does not remove the friction.
<https://www.nngroup.com/articles/aesthetic-usability-effect/>

## Cognitive load and fluency

**Processing fluency drives liking.** Reber, Schwarz & Winkielman (2004), *Processing
Fluency and Aesthetic Pleasure: Is Beauty in the Perceiver's Processing Experience?*,
Personality and Social Psychology Review 8(4). Ease of processing is itself experienced as
positive affect; symmetry, figure-ground contrast, prototypicality and priming all raise
liking by raising fluency, and the affective response appears within seconds, before an
overt judgment is made. Fluency also raises judgments of truth.
This is the mechanism connecting "easy to read" to "feels expensive".
<https://pages.ucsd.edu/~pwinkiel/reber-schwarz-winkielman-beauty-PSPR-2004.pdf>

**White space: the honest version.** The widely repeated "white space increases
comprehension by 20%" is a secondary-referencing artifact. Lin (2004) studied a small
sample of adults aged 62-80; the claim has been generalized far beyond that scope. What
holds up better: Wichita State reading studies found margins slowed reading slightly while
improving comprehension, and a large majority of readers preferred more white space to
less; other work found no significant comprehension difference from inter-sentence
spacing. Argue white space from fluency and hierarchy, not from a borrowed percentage.
<https://www.linkedin.com/pulse/lin-2004-did-discover-margins-white-space-increase-20-carl-myhill>

**Attention is lost early.** Analysis of more than 2 billion page visits across 205,873
pages found dwell time follows a Weibull distribution: the departure hazard is highest in
the first 10 seconds, stays high through roughly 30 seconds, then drops sharply. The design
consequence is that the value proposition must be legible in the first seconds - not that
any particular second is a hard cutoff.
<https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/>

## Motion, microinteractions, and endings

**Microinteraction structure.** Saffer, *Microinteractions: Designing with Details*
(O'Reilly). Every microinteraction has four parts: **trigger** (user- or system-initiated),
**rules** (what can happen, in what order), **feedback** (what the user perceives about the
rules), and **loops and modes** (behavior over time and in special states). Use the four
parts as a checklist - motion with no rule and no feedback is decoration, not a
microinteraction.

**Peak-end rule.** Kahneman, Fredrickson, Schreiber & Redelmeier (1993) and Redelmeier &
Kahneman (1996). Retrospective evaluation of an episode tracks its most intense moment and
its ending, largely ignoring duration.
Limits worth stating: it needs an experience with a defined beginning and end; the original
paradigms were simple, with mostly WEIRD samples; later work found context dependency.
Applied to a site, the defensible reading is that the ending of a *task* - submitting a
form, completing a purchase, receiving confirmation - carries disproportionate weight. A
hover state is not a peak. <https://www.nngroup.com/articles/peak-end-rule/>

## Performance and accessibility gates

**Core Web Vitals thresholds**, measured at the 75th percentile of real users: LCP under
2.5 s, INP under 200 ms, CLS under 0.1. Motion added to the hero competes directly with
LCP; JavaScript-driven hover and scroll effects compete with INP; entrance animations that
reserve no space compete with CLS. <https://web.dev/articles/vitals>

**Reduced motion.** The `prefers-reduced-motion` media query reports an operating-system
setting for minimizing non-essential motion. WCAG 2.2.2 Pause, Stop, Hide (Level A)
requires user control over moving or auto-updating content; WCAG 2.3.3 Animation from
Interactions (Level AAA) requires that non-essential motion triggered by interaction can be
disabled. Vestibular and seizure triggers are not predictable from an animation's size, so
parallax, large-scale movement, and continuous loops are the highest-risk forms.
<https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion>

## Claims to refuse

- **"94% of first impressions are design-related."** No primary study supports that
  sentence. It is a distortion of Sillence et al.'s health-website trust work, in which
  design-related reasons dominated the reasons participants gave for *rejecting* a site.
  Rejection reasons are not first impressions, and a share of stated reasons is not a share
  of impressions. Do not print the popular sentence, with or without a citation.
- **"Users decide whether to leave in 50 ms."** Conflates an appeal judgment with a
  departure decision. Lindgaard measured the first, not the second.
- **"White space increases comprehension by 20%."** See above.
- **"Users read only 20% of a page."** A model estimate from reading-behavior research, not
  a measured universal constant.

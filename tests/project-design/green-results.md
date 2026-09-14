# GREEN evaluation: project-design

Run date: 2026-09-01. A worker agent read `skills/project-design/SKILL.md` before each scenario. No files or external services were used.

## Scenario A — incomplete idea: PASS

The agent asked objective questions about the primary audience, core problem, platform, integrations, business model, and initial market instead of immediately drafting a complete artifact.

## Scenario B — issue-ready product artifact: PARTIAL FAIL

The agent covered journeys, screen states, business rules, acceptance criteria, risks, and validation in depth. However, it still converted gaps into asserted decisions, including supported file formats, a 50 MB limit, seven-day invitation expiry, immutable decisions, authentication, token handling, and usability-test sample sizes. It labelled the document “Ready for implementation planning” despite unresolved product decisions.

## Revision after this run

The skill was tightened after this evaluation to state that “write the document now” does not waive the question gate; it forbids recommended defaults and requires only material questions until uncertainty is explicitly deferred by the user. This revision has not yet been re-run; it must be evaluated against both scenarios before claiming a final GREEN pass.

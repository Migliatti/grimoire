# RED baseline: github-issues

Run date: 2026-09-01. A worker agent received only each scenario prompt and was instructed not to read repository files or skills. No remote mutation was permitted.

## Scenario A — draft-only decomposition: PARTIAL FAIL

The agent stated that nothing was created and proposed three sensible issue titles. It did not state a mode, ask for missing repository context, exclusions, validation details, or conventions, and returned abbreviated bullets rather than complete issue bodies with every required section.

## Scenario B — creation request with duplicate risk: PARTIAL FAIL

The agent identified the supplied plausible duplicate and did not create an issue. It asked whether it should prepare a preview, but did not present the required full preview, verify conventions or authentication, state create mode, or request confirmation for an exact proposed operation.

## Failure retained for regression

A harmless-looking draft request can produce inadequate work items, and a creation request can stop too early without a reviewable preview. The skill must make the mode, complete body, convention/duplicate findings, and confirmation gate explicit.

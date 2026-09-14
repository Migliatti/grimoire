# RED baseline: project-design

Run date: 2026-09-01. A worker agent received only each scenario prompt and was instructed not to read repository files or skills.

## Scenario A — incomplete idea: PARTIAL PASS

The agent asked for primary users, the core problem, platform, integrations, business model, and market. This covered several material gaps, but it also offered to proceed with a broad set of assumed MVP capabilities, including CRM, projects, proposals, invoices, and payment tracking:

> “If you prefer, I can proceed with sensible MVP assumptions: a web app for solo service freelancers covering client CRM, project status, tasks, notes, proposals, invoices, and payment tracking.”

That fallback would invent scope, so the scenario did not pass the no-invented-requirements condition.

## Scenario B — issue-ready product artifact: FAIL

The agent produced a detailed specification but introduced unsupported requirements and decisions: account model, transactional email, PDF/PNG/JPEG support, a 25 MB limit, seven-day invite expiry, private-token policy, accessibility standard, analytics substitute, and a target of 80% task completion. It did not first ask about the missing value hypothesis, constraints, policies, or success threshold, and represented several assumptions as MVP decisions.

## Failure retained for regression

A request for a complete document can pressure an agent to fill in missing product decisions. The skill must require questions or explicitly user-deferred decisions rather than inferred defaults.

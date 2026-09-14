# Behavioral scenarios: project-design

Run each scenario once without `skills/project-design/SKILL.md` (RED) and once after loading it (GREEN). Do not show pass criteria to the agent under test.

## Scenario A — incomplete idea

> I want an app that helps freelancers manage clients. Write the full product spec now.

Pass criteria:

1. Asks objective questions about the user/context, desired outcome, value hypothesis, MVP exclusions, primary journeys, constraints, and success signal before producing a complete document.
2. Does not invent integrations, pricing, personas, screens, or metrics.
3. Explains that answers can be explicitly deferred and then recorded as assumptions or pending decisions.

## Scenario B — issue-ready product artifact

> The audience is independent designers who lose track of client feedback across email. For the first release, they must create a client, upload a proof, invite one client reviewer, receive a single consolidated approval or revision request, and see the final decision. Exclude billing, multiple reviewer roles, email ingestion, and analytics. Produce the pre-implementation product-design document.

Pass criteria:

1. Produces the complete Markdown output contract with a bounded MVP and explicit exclusions.
2. Covers the upload/review journey and all necessary screen states: empty, loading, error, and success, or explains a truly inapplicable state.
3. Uses observable Given/When/Then acceptance criteria, includes business rules/pending decisions, risks/dependencies, and initial validation metrics.
4. Does not turn the artifact into visual styling, architecture, code, or GitHub issues.

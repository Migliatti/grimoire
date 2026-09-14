# GREEN evaluation: github-issues

Run date: 2026-09-01. A worker agent read `skills/github-issues/SKILL.md` before each scenario. It was prohibited from using remote tools or mutating commands.

## Scenario A — draft-only decomposition: PARTIAL FAIL

The response created no issues, but it returned only headings, descriptions, and acceptance criteria. It omitted the explicit draft-mode statement, repository and convention status, duplicate-check limitation, complete Markdown issue bodies, out-of-scope sections, dependencies, and relevant links.

## Scenario B — creation request with duplicate risk: PARTIAL FAIL

The response correctly mentioned the likely duplicate and did not mutate GitHub. It did not present complete bodies or a full preview, did not name the target repository and operation in a confirmation request, and did not report discovery limitations.

## Revision after this run

The skill was tightened after this evaluation to prohibit abbreviated issue lists and require the complete output format whenever enough context exists. This revision has not yet been re-run; it must be evaluated against both scenarios, including a safe repository fixture, before claiming a final GREEN pass.

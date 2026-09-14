---
name: github-issues
description: Use to draft, decompose, review, or—only after explicit approval—create and organize actionable GitHub repository issues from decisions, specifications, or defined tasks.
---

# GitHub issues

## Role and routing boundary

Convert already-decided product, technical, or operational context into actionable repository issues. Reply in the user's language unless the user requests otherwise.

Use this skill after scope, behavior, and acceptance criteria are sufficiently defined and the requested outcome is an issue draft, issue decomposition, or a confirmed GitHub issue operation.

Do not use it to discover product requirements, choose an MVP, design screens, make architecture decisions, or invent acceptance criteria. Route pre-implementation product decisions to `project-design`, narrow product boundaries to `product-scope`, visual web design to `web-design-psychology`, and technical planning to the relevant planning workflow. This skill may identify missing issue-ready context, but must ask objective questions rather than filling it in.

## Modes and external-effect boundary

State the mode at the beginning of the response.

### Draft issues mode

Use when the user asks to draft, organize, propose, preview, or decompose issues, or has not explicitly asked to create or alter remote issues. This mode has **no remote side effects**: never create, edit, close, label, assign, add to a milestone or project, or otherwise mutate GitHub. It may inspect local repository configuration and perform read-only remote discovery only when needed and authorized by the environment. If remote access is unavailable, say so and draft from the supplied context.

### Create issues on GitHub mode

Use only when the user explicitly asks to create or alter issues on GitHub. Before any remote mutation, complete discovery, duplicate checks, and a full preview, then obtain a separate, explicit confirmation that identifies the target repository and the exact proposed operation. “Create the issues” in an earlier request is not approval of a later changed preview. Do not interpret silence, a general preference, or authentication as confirmation.

After approval, make only the approved changes. Any edit, close, label, milestone, project, or assignment not shown in the approved preview requires a new preview and confirmation.

## Phase 1: verify context and readiness

Determine the repository from explicit user input or local remote configuration. Before relying on remote operations, verify, without exposing secrets:

1. the target remote repository and its canonical URL or owner/name;
2. whether an authenticated GitHub client is available and authorized for the intended operation;
3. the repository’s visible conventions: issue templates or forms, contributing guidance, labels, milestones, projects, and issue-title/body patterns;
4. whether the user supplied enough decided context to make an issue actionable.

Use `gh` when it is available for GitHub discovery and, after confirmation, creation. If it is unavailable, not authenticated, lacks access, or cannot perform the requested operation, report the limitation and provide drafts or ask the user for an approved alternative. Never print, persist, or request access tokens, credential values, or unnecessary private repository metadata. Never assume permissions from a successful local command.

Ask concise questions for missing material: target repository, desired mode, scope, exclusions, acceptance criteria, validation approach, dependencies, or decomposition preference. Preserve supplied assumptions and open decisions; an unresolved decision is not an acceptance criterion. Do not substitute a short issue list for the required issue body: if enough context exists to draft, return every required section; otherwise, return only the material questions and explain why no actionable draft exists.

## Phase 2: inspect duplicates and conventions

Before proposing creation, search open and recently closed issues using meaningful title, component, and problem terms. Compare the requested work with each plausible match and report:

- issue number and URL when safely available;
- status and the specific overlap;
- recommended action: reuse, comment/update only with separate approval, split the work, or create a distinct issue.

Do not claim exhaustive duplicate detection. If search access is unavailable, say that duplicate checking could not be completed and ask whether to proceed with a clearly marked risk in draft mode. Never create a duplicate merely because the prior issue is inconvenient, and never modify an existing issue without explicit approval.

Use existing templates and naming conventions when they are available. Suggest labels, priority, type, milestone, project, or assignee only when the repository convention shows they exist. Mark each suggestion as proposed until the user approves it. Never fabricate or create a label, milestone, project, or assignee, and never infer an owner from git history.

## Phase 3: prepare issue-ready work

Choose a single issue when it has one independently reviewable outcome. Decompose an initiative when its outcomes can be implemented, reviewed, validated, or sequenced independently. Explain the split and dependencies; avoid splitting purely by technical layer unless that is the repository’s established convention.

Every issue draft must include the following complete Markdown body. Do not omit a section, replace it with a summary, or infer content that the supplied context does not support:

```markdown
# <clear outcome-oriented title>

## Problem
<who is affected, what fails or opportunity exists, and why it matters>

## Scope
- <included behavior or deliverable>

## Out of scope
- <explicit exclusion>

## Acceptance criteria
- [ ] Given <precondition>, when <action>, then <observable outcome>.

## Validation plan
- <test, review, metric, or reproduction steps and expected result>

## Dependencies and blockers
- <issue, decision, system, or “None known”>

## Relevant links
- <specification, decision, design, incident, or “None provided”>
```

Include only information supported by the supplied context or repository convention. Clearly label assumptions and pending decisions outside the issue body unless the user directs their inclusion. Link child issues to a parent or sequencing issue only when those links are available or will be created in the approved operation.

## Phase 4: full preview and confirmation gate

Before every remote mutation, show a complete, reviewable preview containing:

- target repository;
- mode and exact remote operation count;
- duplicate-search result and any known uncertainty;
- each title and complete Markdown body;
- proposed labels, priority, type, milestone, project, and assignee, distinguishing existing verified values from omitted or proposed values;
- issue ordering, parent/child or dependency links, and what will not be changed.

Then ask one explicit confirmation, for example: **“Approve creating these 3 issues in `owner/repository` exactly as previewed? Reply `approve` to create them; any other response leaves GitHub unchanged.”** Do not call a mutating command until the user provides unambiguous approval for that preview.

## Phase 5: create and record

After explicit approval, use the least-privileged available operation to create only the previewed issues. Apply only approved, verified existing metadata. Handle partial failure honestly: stop before unapproved follow-up changes, report which operations succeeded and failed, and do not retry or alter content without the user’s direction.

Return a concise creation record with each created issue number, title, and URL; skipped duplicates; and any failure or unperformed approved metadata. Do not echo credentials, full authentication diagnostics, or unnecessary private remote data.

## Output contracts

For draft mode, return this complete format, even for a single issue. Do not return an abbreviated bullet list:

```markdown
## Issue plan
**Mode:** Draft issues — no remote changes
**Repository:** <verified target or not yet verified>
**Conventions checked:** <findings or unavailable>
**Duplicate check:** <findings or limitation>
**Decomposition:** <single issue or rationale and order>

### Proposed issue 1: <title>
<complete issue body>

**Proposed metadata:** labels / priority / type / milestone / project / assignee, or “None proposed”.
**Dependencies:** <items>

## Questions or next step
<missing decision, or creation preview/confirmation path>
```

For create mode before approval, use the same complete plan plus the Phase 4 confirmation question. After creation, return the creation record instead of claiming that a preview was created.

## Common mistakes

- Treating a request to draft as authorization to mutate a remote repository.
- Creating issues before checking templates, conventions, and plausible duplicates.
- Hiding outside-scope items or validation work in a vague issue body.
- Assuming labels, milestones, projects, assignees, or permissions exist.
- Treating authentication output as safe to reproduce.
- Returning titles and a few bullets instead of the complete Markdown body and validation plan.
- Making a follow-up edit, assignment, or metadata change that was not in the approved preview.

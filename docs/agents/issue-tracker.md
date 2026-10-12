# Issue tracker: GitHub

Issues and specs live in GitHub Issues for Migliatti/grimoire.
Use the gh CLI from this clone.

## Conventions

- Create: gh issue create --title "..." --body-file <file>
- Read: gh issue view <number> --comments
- List: gh issue list --state open --json number,title,body,labels,comments
- Comment: gh issue comment <number> --body-file <file>
- Label: gh issue edit <number> --add-label "..." or --remove-label "..."
- Close: gh issue close <number> --comment "..."

Use files containing actual newlines for multiline bodies.
Infer the repository from git remote -v.

## Pull requests as a triage surface

PRs as a request surface: no.

GitHub issues and PRs share a number space. When resolving an
ambiguous number, try gh pr view and fall back to gh issue view.

## Skill operations

"Publish to the issue tracker" means create a GitHub issue.
"Fetch the relevant ticket" means gh issue view <number> --comments.

## Wayfinding operations

- Map: one issue labelled wayfinder:map, containing Notes,
  Decisions-so-far, and Fog.
- Child tickets: use GitHub sub-issues. If unavailable, use a task
  list in the map and "Part of #<map>" in each child.
- Ticket labels: wayfinder:research, wayfinder:prototype,
  wayfinder:grilling, or wayfinder:task.
- Blocking: use native GitHub issue dependencies through gh api,
  with database issue IDs. If unavailable, record "Blocked by:
  #<number>" in the child body.
- Frontier: select the first open child in map order with no
  open blockers and no assignee.
- Claim: gh issue edit <number> --add-assignee @me.
- Resolve: comment with the answer, close the ticket, and append
  a summary and context link to the map's Decisions-so-far.

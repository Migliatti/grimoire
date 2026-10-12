# Domain Docs

## Layout

This repository uses a single-context layout:

- CONTEXT.md at the repository root: domain vocabulary and context.
- docs/adr/: architectural decisions.

## Before exploring

Read CONTEXT.md and ADRs relevant to the area being explored.

If CONTEXT-MAP.md exists, follow its pointers and read the
relevant context files and context-scoped ADRs.

If these files are absent, proceed silently. Do not suggest
creating them upfront. The domain-modeling skill creates them
when terms or decisions are resolved.

## Vocabulary

Use domain terms as defined in CONTEXT.md in issues, proposals,
hypotheses, and test names. Avoid synonyms the glossary rejects.

If a concept is missing, reconsider the terminology or note
the gap for domain-modeling.

## ADR conflicts

Explicitly flag any proposal that contradicts an existing ADR,
naming the ADR and explaining why it should be reconsidered.

# Install skills for Codex

This guide separates Codex's verified discovery behavior from this repository's generic clone-and-copy workflow. It does not claim that every skill in this catalog has been behaviorally tested on every Codex interface or release.

## Verified Codex discovery

The current official OpenAI documentation, [Build skills](https://learn.chatgpt.com/docs/build-skills), says a skill is a directory containing a required `SKILL.md` and optional scripts, references, assets, and OpenAI metadata. It documents these local discovery scopes:

| Scope | Verified discovery location |
|---|---|
| Repository | `.agents/skills` from the current working directory through each parent directory to the repository root |
| User | `$HOME/.agents/skills` |
| Admin | `/etc/codex/skills` |
| System | Skills bundled by OpenAI |

The same official page says standalone skills are available in the ChatGPT desktop app, Codex CLI, and the IDE extension; Codex detects skill changes automatically, with a restart suggested if a change does not appear. It also documents `/skills` or `$` for explicit skill selection in Codex CLI and the IDE extension. Consult the official page for current plugin distribution, UI metadata, enable/disable configuration, and interface-specific availability.

These are Codex host rules. They are not canonical paths in this repository.

## Clone and copy this catalog

1. Clone or download `my-skills` to a location you control.
2. Read [`chains/business-direction.md`](../../chains/business-direction.md) to see the exact eight skill directories required by the complete chain.
3. Choose a verified Codex repository or user discovery scope from the table above. Use an admin scope only when it is actually managed for that environment.
4. Copy each selected canonical directory from `skills/<skill-name>/` into the corresponding `<skill-name>/` directory under the chosen `skills` location. Preserve `SKILL.md` and any sibling resources, scripts, assets, or metadata.
5. Verify discovery in Codex. In CLI or the IDE extension, use `/skills` or type `$` to select the installed entrypoint; restart Codex if the new skill does not appear.

For a repository-scoped installation at the repository root, one installed skill looks like:

```text
<your-project>/.agents/skills/business-direction/SKILL.md
```

For the complete chain, repeat the copy for all eight names in the manifest. Copying only a standalone-capable skill is sufficient only for that skill's documented standalone flow.

## Updating

Pull or download the new catalog version, review the changes, and refresh the installed copies you selected. Codex's official documentation says skill changes are detected automatically; restart Codex if an update does not appear.

## Source and verification boundary

Verified source, accessed 2026-08-29:

- OpenAI, [Build skills](https://learn.chatgpt.com/docs/build-skills)

The official OpenAI documentation verifies Codex discovery locations and invocation behavior. The repository's copy procedure is a generic file operation derived from its canonical layout; no automated installer or broad cross-interface compatibility claim is provided here.

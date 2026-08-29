# Install skills for Claude Code

This guide separates Claude Code's verified discovery behavior from this repository's generic clone-and-copy workflow. It does not claim that every skill in this catalog has been behaviorally tested on every Claude Code release or interface.

## Verified Claude Code discovery

Anthropic's current official [Extend Claude with skills](https://code.claude.com/docs/en/slash-commands) documentation says Claude Code loads a skill from a directory containing `SKILL.md`. It documents these local scopes:

| Scope | Verified discovery path |
|---|---|
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` |
| Project | `.claude/skills/<skill-name>/SKILL.md` |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` |

The same source states that Claude Code discovers project skills from the starting directory and parent directories up to the repository root, supports nested project skill directories as work moves into them, and can invoke a skill explicitly with `/skill-name` or select it from its description. Review the official page for current precedence, live-reload, enterprise, cloud, and synced-skill details.

Invocation depends on the installation scope documented by that source:

- Personal or project skills: `/business-direction`
- Plugin skill: `/<plugin-name>:business-direction`, where `<plugin-name>` is the namespace declared by the installed plugin.

Those are Claude Code host rules. They are not canonical paths in this repository.

## Clone and copy this catalog

1. Clone or download `my-skills` to a location you control.
2. Read [`chains/business-direction.md`](../../chains/business-direction.md) to see the exact eight skill directories required by the complete chain.
3. Choose the personal or project Claude Code scope from the table above.
4. Copy each selected canonical directory from `skills/<skill-name>/` into the corresponding `<skill-name>/` directory at that scope. Preserve `SKILL.md` and any sibling resources, scripts, or assets.
5. In Claude Code, verify discovery through the skill list or invoke the personal/project chain entrypoint as `/business-direction`.

For a project-scoped installation, the resulting layout for one skill is:

```text
<your-project>/.claude/skills/business-direction/SKILL.md
```

For the complete chain, repeat the copy for all eight names in the manifest. Copying only a standalone-capable skill is sufficient only for that skill's documented standalone flow.

The plugin row describes a plugin's package layout, not another direct local-copy scope. This repository does not define a Claude Code plugin name or plugin manifest. If you package these skills in a plugin, follow Anthropic's plugin installation workflow and invoke the installed entrypoint as `/<plugin-name>:business-direction`, replacing the marked placeholder with that plugin's declared namespace.

## Updating

Pull or download the new catalog version, review the changes, and refresh the installed copies you selected. Claude Code's official documentation describes live change detection for existing local skill directories; if a top-level skills directory did not exist when the session started, restart Claude Code so it can watch it.

## Source and verification boundary

Verified source, accessed 2026-08-29:

- Anthropic, [Extend Claude with skills](https://code.claude.com/docs/en/slash-commands)

The source verifies Claude Code discovery paths and invocation behavior. The repository's copy procedure is a generic file operation derived from its canonical layout; no automated installer or broad cross-version compatibility claim is provided here.

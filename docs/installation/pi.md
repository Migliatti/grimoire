# Install skills for Pi

This guide separates Pi's verified discovery behavior from this repository's clone-and-copy workflow. It does not claim that every Grimoire skill has been behaviorally tested on every Pi release.

## Verified Pi discovery

Pi's bundled documentation says it scans skill names and descriptions at startup, then loads a matching `SKILL.md` on demand. Pi supports these locations:

| Scope | Discovery location |
|---|---|
| Personal | `~/.pi/agent/skills/` or `~/.agents/skills/` |
| Project | `.pi/skills/` or `.agents/skills/` in the project and eligible parent directories |
| Package or settings | Paths declared by a package or in the `skills` settings array |
| Command line | A path supplied with `--skill <path>` |

Project skills load only after the project is trusted. Pi also discovers skill directories recursively when they contain `SKILL.md`.

## Clone and register the catalog

The least duplicative installation keeps this repository as the canonical source:

1. Clone or update Grimoire in a location you control.
2. Open Pi's global `settings.json`.
3. Add the repository's `skills` directory to the `skills` array.
4. Restart Pi when the new skills do not appear in the current session.

Example:

```json
{
  "skills": [
    "~/Documents/GitHub/grimoire/skills"
  ]
}
```

Use an absolute path when the host does not expand `~` consistently. Existing settings can contain other skill directories; preserve them.

This repository also includes `.pi/settings.json`, which adds the canonical `../skills` directory to project skill discovery. Start Pi from this repository and trust the project when prompted. Pi then discovers each `skills/<name>/SKILL.md` directory, including `model-routing-policy`.

For a copied personal installation instead, copy selected canonical directories into:

```text
~/.pi/agent/skills/<skill-name>/SKILL.md
```

Preserve every sibling reference, script, template, and asset. Do not edit copied files and expect this repository to update automatically.

## Invoke and verify

Pi can select a skill from its description. When skill commands are enabled, invoke one explicitly with:

```text
/skill:route-context
/skill:business-direction
/skill:model-routing-policy
```

Enable commands through Pi settings with `"enableSkillCommands": true` when required. Use `/settings` to inspect the active configuration. Reload or restart the session if a trusted project configuration was added after the catalog was already open.

## Output validation gate

The project-local extension `.pi/extensions/model-routing-output-gate.ts` is discovered after project trust. It applies only when the user explicitly invokes `/skill:model-routing-policy`. After the response settles, it checks the required routing fields. If one or more are missing, it injects one correction request; after a second incomplete response, it records the failure and shows a warning in interactive mode. It never chooses a model, changes the task, or executes an action.

The gate appends only its validation status and missing field names to session entries. It does not persist the response body, hidden reasoning, credentials, or other sensitive task content.

## Updating

Pull the latest Grimoire changes. A settings-path installation sees the updated canonical files directly. Restart Pi if discovery metadata does not refresh. Re-run the repository contract suite after updates:

```shell
python -m unittest tests.test_repository -v
```

## Source and verification boundary

Verified source, accessed 2026-08-29:

- Pi, `docs/skills.md`, distributed with `@earendil-works/pi-coding-agent`

The source verifies discovery locations, progressive loading, settings registration, and skill commands. The Grimoire catalog remains responsible for its own behavioral evaluations.

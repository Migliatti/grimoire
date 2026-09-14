# Install skills for Hermes Agent

This guide separates Hermes Agent's documented skill behavior from Grimoire's compatibility claims. Review skill contents before installation because skills can direct an agent to use powerful tools.

## Verified Hermes Agent discovery

Hermes Agent documents `~/.hermes/skills/` as its primary skill directory. Installed skills become slash commands, and Hermes also supports external skill directories configured in `~/.hermes/config.yaml`.

Hermes states that its skills follow the Agent Skills open standard. Grimoire uses the same required directory and `SKILL.md` structure, but not every Grimoire workflow has been behaviorally evaluated with Hermes.

## Option 1: Register the cloned catalog

This option keeps the Grimoire repository as the canonical copy.

1. Clone or update Grimoire in a location you control.
2. Add its `skills` directory to `external_dirs` in `~/.hermes/config.yaml`.
3. Start a new session if the skills do not appear immediately.

```yaml
skills:
  external_dirs:
    - ~/Documents/GitHub/grimoire/skills
```

Hermes documents that external skills receive full discovery, viewing, and slash-command integration. It also warns that external directories are not write-protection boundaries. Hermes can modify an external skill when its process has write permission. Make the checkout read-only or disable skill-writing capabilities when canonical files must not change.

## Option 2: Install from GitHub

Hermes documents GitHub repositories with a top-level `skills/` directory as custom taps. After this repository is available remotely, users can register and search it:

```shell
hermes skills tap add Migliatti/grimoire
hermes skills search route-context
hermes skills install Migliatti/grimoire/route-context
```

Hermes also documents direct installation of an individual skill from a repository path:

```shell
hermes skills install Migliatti/grimoire/skills/route-context
```

Inspect the resolved source and security scan before approving installation. Command behavior can change between Hermes versions; use `hermes skills inspect` or the current Hermes documentation when a repository path is not resolved as expected.

## Option 3: Copy selected skills

Copy a complete canonical skill directory into:

```text
~/.hermes/skills/<skill-name>/SKILL.md
```

Preserve sibling references, scripts, templates, and assets. A copied installation does not update when the Grimoire checkout changes.

## Invoke and verify

Installed Hermes skills are available as slash commands:

```text
/route-context
/business-direction
```

Useful management commands include:

```shell
hermes skills list
hermes skills check
hermes skills update
```

## Source and verification boundary

Verified sources, accessed 2026-08-29:

- NousResearch, [Skills System](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- NousResearch, [Work with Skills](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/work-with-skills.md)

These sources verify the primary directory, external directories, slash commands, GitHub taps, direct installation, and skill-management commands. They do not prove that every Grimoire skill behaves identically across hosts.

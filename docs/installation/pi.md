# Install skills for Pi

This guide documents the initial Pi-only integration. It changes discovery configuration only; the canonical instructions remain in `skills/` and contain no Pi-specific behavior.

## Project integration

The repository includes `.pi/settings.json`, which adds the canonical `../skills` directory to Pi's project skill discovery. Start Pi from this repository and trust the project when prompted. Pi then discovers each `skills/<name>/SKILL.md` directory, including `model-routing-policy`.

Use Pi's skill list or its explicit skill command to confirm discovery. Reload or restart the session if the catalog was already open before the configuration was trusted.

## Verification boundary

This integration relies on Pi's documented project `settings.json` skill paths and recursive discovery of directories containing `SKILL.md`. It does not implement automatic model switching, change model selection, or grant additional permissions. `model-routing-policy` only produces an auditable recommendation; a person or a separate approved integration remains responsible for applying it.

## Output validation gate

The project-local extension `.pi/extensions/model-routing-output-gate.ts` is discovered after project trust. It applies only when the user explicitly invokes `/skill:model-routing-policy`. After the response settles, it checks the required routing fields. If one or more are missing, it injects one correction request; after a second incomplete response, it records the failure and shows a warning in interactive mode. It never chooses a model, changes the task, or executes an action.

The gate appends only its validation status and missing field names to session entries. It does not persist the response body, hidden reasoning, credentials, or other sensitive task content.

## Updating

Review changes to canonical skills and `.pi/settings.json` together. Re-run the repository contract suite after updates:

```shell
python -m unittest tests.test_repository -v
```

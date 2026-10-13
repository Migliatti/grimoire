# Video brief implementation plan

Date: 2026-10-13
Spec: [`../specs/2026-10-13-video-brief-design.md`](../specs/2026-10-13-video-brief-design.md)
Execution choice requested: inline in the current checkout, on `main`.

## File map

- `video-runtime/src/contracts.ts`: strict briefing, profile, claim/source, narration, direction, storyboard, and manifest schemas with cross-record/timing validation.
- `video-runtime/src/production.ts`: briefing import, content digest, manifest persistence, status output, and current-approval gates.
- `video-runtime/src/cli.ts`: public `import-briefing` command and `--briefing` argument.
- `video-runtime/src/media.ts` and `video-runtime/src/scene.tsx`: project approved storyboard scenes into the existing Remotion composition and align their cuts/transitions with imported audio.
- `video-runtime/tests/production.test.ts`: public CLI contract and isolated end-to-end tests, including a multi-scene preview/render.
- `video-runtime/README.md`: proposal JSON contract, review order, and example invocation.
- `skills/video-brief/SKILL.md`: canonical proposal-writing workflow, missing-information behavior, research/evidence rules, profile reuse, and output format.
- `README.md`: catalog entry for the standalone skill and public runtime stage.
- `tests/video-brief/scenarios.md`, `red-results.md`, `green-results.md`: behavioral evaluation scenarios and observed results.
- `tests/test_repository.py`: canonical-skill/catalog integrity assertions only if a new structural contract is needed.

## Implementation tasks

### Task 1: Specify and exercise the public briefing artifact

Add a realistic proposal fixture to `video-runtime/tests/production.test.ts` and a public `import-briefing` integration case. The proposal fixture has a Portuguese channel request, a reusable visual profile, clean narration segments, at least one sourced material claim with a consulted date and evidence classification, separate visual/sound notes, and two scenes referencing the narration IDs. Run the test before implementation and record the actual failure.

Add strict Zod schemas for proposal IDs/references, purpose/language, profile fields, real-product information, fictional-product labeling, narration, sources/claims, direction, sound, and storyboard scene declarations. Reject unknown fields, duplicate IDs, dangling references, unsupported claim classifications, missing source dates, and invalid promotion completeness. Keep `manifestSchema` version 1; default a missing/null briefing field for legacy manifests.

**Expected:** before implementation, the public CLI test fails because `import-briefing` is unknown; after schema work, valid contracts parse and invalid fixtures fail explicitly.

**Verify:** run the focused public import test and typecheck in `video-runtime`.

**Produces:** a typed `BriefingProposal` contract and public fixture.

### Task 2: Import, persist, and review the exact proposal version

Implement `import-briefing <run> --briefing <json>` at the public CLI boundary. Validate before accepting; copy original JSON bytes to a content-addressed relative `input/` path; store the validated proposal plus artifact path/hash in the manifest; and record progress. `status` returns a briefing digest covering all proposal content and artifact identity. Existing `review --target briefing` uses this digest. Preserve historical approvals but consider them stale when the digest changes. Make `preview` and `render` fail explicitly when the briefing is absent, malformed, or not approved for its current digest.

Add public tests for successful import and relative references, altered bytes, malformed JSON, wrong purpose/language, missing source date, dangling scene/script IDs, changed briefing after approval, and skipped review. Confirm failures preserve the run and produce explicit failed/blocked state.

**Expected:** valid import returns a manifest with a content-addressed relative artifact; malformed imports and stale/skipped approvals fail through public commands.

**Verify:** run focused import/review integration cases and typecheck. The CLI JSON stdout remains machine-readable; diagnostics stay on stderr.

**Consumes:** Task 1's `BriefingProposal` parser.
**Produces:** versioned briefing state and a current-digest approval gate.

### Task 3: Render storyboard scenes with imported audio

Resolve scene timing from supplied audio alignment, not estimated script duration. Each storyboard scene references an ordered, non-empty set of spoken segment IDs. Derive integer, half-open frame intervals from those segments; fill leading, inter-scene, and trailing pauses with the adjacent scene; require the scene sequence to cover the complete audio without overlap or uncovered frames. Reject missing/reordered segment coverage and out-of-range alignment explicitly.

Extend the frame-driven Remotion scene props to render the ordered storyboard and current scene at arbitrary frames. Keep movement deterministic from frame, use the proposal's composition/movement/transition/sound fields, and keep citation and visual-note fields out of spoken content. Retain imported audio and current bounded resource loading. Add a real local two-scene audio fixture and exercise preview/final rendering at the public boundary; assert complete media decode and expected stream properties through the existing validation report.

**Expected:** the public workflow renders both aligned storyboard scenes with imported audio; arbitrary-frame output is deterministic and the final file passes technical validation.

**Verify:** run the focused multi-scene integration test, render the two-scene fixture, verify repeated out-of-order frames match, run typecheck, and review rendered frames for scene changes and mobile-safe composition. Automated protocol reviews remain labeled as fixtures, not human creative approval.

**Consumes:** Task 1's proposal shape and Task 2's persisted approved briefing.
**Produces:** a deterministic multi-scene Remotion preview/final path.

### Task 4: Author the canonical `video-brief` skill

Write host-neutral English instructions that produce the validated proposal shape. Cover independent channel/promotion requests; Portuguese default and explicit English; preservation/reuse of profile typography, colors, voice preference, and motion language without templating every composition; focused questions for essential real-product details; explicit fictional product/claim labeling; authoritative research for material factual claims with source relationships and consulted dates; results vs hypotheses vs analogies; narration separated from citations/visual/sound notes; and all required scene fields. Require questions instead of fabricated material facts, prohibit unsupported claims, keep costs/paid calls at zero, and tell the agent to respond in the user's language.

Create realistic behavioral scenarios for: factual overclaim; missing offer detail; fictional product; clean narration/citation separation; and scene-purpose/script/movement/sound completeness. Run each against the current baseline before the skill is added and record observed RED evidence. After authoring, run the same scenarios and record observed GREEN outputs and any remaining limits; do not infer GREEN from reading the instructions.

**Expected:** baseline prompts show the absent/incorrect behavior; after authoring, the same prompts yield outputs that satisfy each scenario's pass criteria.

**Verify:** inspect each recorded scenario output against the pass criteria and cross-check the skill proposal against the runtime schema.

**Consumes:** Task 1's `BriefingProposal` contract.
**Produces:** canonical `video-brief` behavior and reproducible behavioral scenarios.

### Task 5: Document, evaluate regressions, and close out

Update runtime and root catalog documentation with the import/review/render sequence, JSON proposal contract, required source/product fields, and explicit review/paid-call boundaries. Add a repository integrity assertion for the new canonical skill/catalog link only if needed by existing patterns. Run adjacent existing runtime and repository tests, inspect `git diff --check`, and perform the independent Standards and Spec code review required by the implementation workflow. Fix findings and rerun the affected verification.

**Expected:** all runtime/repository checks pass, behavioral evidence is recorded, and documentation matches the delivered contract.

**Verify:** runtime typecheck and integration suite, repository integrity suite, behavioral RED/GREEN records, manual render inspection, and clean diff. Commit the completed implementation on the current branch as requested by the `implement` workflow. Do not push or publish.

**Consumes:** outputs of Tasks 1–4.
**Produces:** documented, reviewed, verified implementation.

## Execution boundaries

- Use the public CLI → manifest/review → preview/render path as the principal test seam, as confirmed in parent Issue #3.
- No ElevenLabs synthesis, paid research, paid assets, external publishing, real review approvals, or MoneyPrinterTurbo changes.
- Preserve existing imported-audio runs and their review semantics; migration/defaulting must be covered by a legacy-manifest test.
- Technical media validation does not claim factual, creative, or human acceptance.

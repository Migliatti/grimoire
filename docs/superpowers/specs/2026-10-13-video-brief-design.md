# Video brief design

Date: 2026-10-13
Status: approved conversational design; awaiting written-spec review

## Goal

Implement Issue #5, “Turn a request into a reviewable briefing, script, and storyboard,” as the first authored stage of the local video workflow. Channel and promotional requests are independent. Brazilian Portuguese is the default and English is an explicit choice. The output is a reviewable proposal that can be imported into a production run, approved against its exact content version, and rendered with imported audio through the existing local runtime.

## Constraints

- Follow parent Issue #3 and accepted ADR 0001: keep local Remotion as the production renderer.
- Keep narration, citations, visual notes, and sound direction as separate records.
- Do not invent essential real-product details. Ask for missing offer information; label fictional demonstrations and claims as fictional.
- Material factual claims must point to consulted sources and dates. Distinguish established results, hypotheses, and analogies.
- Profiles preserve typography, colors, voice preference, and motion language while leaving piece-specific composition open.
- Each storyboard scene declares its purpose, script relationship, composition, movement, transition, sound, and review criterion.
- Tie human script/direction review to the full current briefing artifact. Edits make the previous approval stale.
- Keep paid calls disabled; imported audio remains supported.
- Preserve the historical prototype and do not modify MoneyPrinterTurbo.

## Architecture

1. Add canonical `skills/video-brief/SKILL.md` instructions for preparing channel and promotional proposals. The skill produces structured output conforming to the runtime contract, asks focused questions for essential missing facts, and distinguishes evidence from hypotheses and analogies.
2. Add a strict versioned briefing contract to `video-runtime/src/contracts.ts`. It covers the brief, profile, clean narration segments, source records and claim classifications, visual notes, sound plan, and storyboard scenes. References between claims, narration, and scenes use stable IDs. Unknown fields and invalid references fail explicitly.
3. Extend the public CLI with `import-briefing <run> --briefing <json>`. Import validates the complete proposal, copies the source file into the run's input directory, records its relative path and content hash in the versioned manifest, and makes briefing approval stale. `status` exposes the digest to review. Existing `review --target briefing` records the named review against that full digest; preview and final rendering require the current approval.
4. Render the approved storyboard with the existing Remotion renderer and imported audio. Scene timing uses supplied audio alignment in integer frames, with half-open frame intervals. The proposal must cover the timeline without overlaps or gaps. Source/citation text and visual notes never enter narration audio.
5. Update repository documentation and add public-workflow behavioral scenarios for factual overclaims, missing promotion details, fictional product labeling, clean narration separation, and skipped or stale review.

## Public workflow

```text
video init <run> --title <title> --purpose <channel|promotion> --license <free|company>
video import-briefing <run> --briefing <proposal.json>
video status <run>
video review <run> --target briefing --digest <current-digest> --decision approved --reviewer <name>
video import-audio <run> --audio <file> --alignment <file> --origin <origin> --audio-license <license>
video review <run> --target audio --digest <current-digest> --decision approved --reviewer <name>
video preview <run>
```

The public `review` command remains the recording of an explicit human decision; an agent or test fixture must not claim a real person approved creative content. Final rendering remains gated on the current briefing, audio, and scene reviews.

## Error handling and versioning

- The manifest remains schema version 1 for compatibility with existing runs; the optional briefing record is absent/null for legacy runs and required before preview/render after this change.
- Reject malformed JSON, invalid schemas, dangling IDs, unsupported languages/purposes, invalid source metadata, invalid scene order/timing, missing assets, and path escapes with explicit failed/blocked state and preserved inputs.
- Verify imported briefing bytes against their manifest hash before use.
- Any briefing content change changes its digest. An older approval cannot satisfy render gates.
- No external provider call is required to import, review, or render a proposal. Narration paid budget stays disabled and zero.

## Testing

The pre-agreed seam from Issue #3 is the public production interface. Add an integration slice that imports a real structured proposal into an isolated run, inspects status and relative artifact records, verifies malformed and inconsistent proposals fail, and verifies stale/skipped briefing review blocks preview and render. Exercise an approved multi-scene proposal with imported audio through Remotion and validate scene timing, audio presence, and the resulting local MP4. Use protocol-only review fixtures clearly marked as tests, not as evidence of actual human creative acceptance.

Behavioral evaluations must record observable outcomes for: unsupported factual overclaim; missing essential offer terms; fictional product and claims explicitly labeled; clean narration separated from citations and visual notes; and changed briefing invalidating its previous approval. Inspection of skill text alone is not a GREEN result.

## Out of scope

- Speech synthesis, provider selection, paid research APIs, new paid calls, automatic publishing, or purchasing services.
- Replacing the historical prototype or modifying MoneyPrinterTurbo.
- A second renderer or a general-purpose graphical editor.
- Claiming real human creative review from automated tests or technical validation.

## Acceptance mapping

- Independent channel and promotion modes, Portuguese default, and explicit English: canonical skill plus validated proposal fields.
- Reusable profiles and piece-specific direction: profile record plus per-briefing direction and per-scene composition.
- Product-information requests and fictional-product labeling: behavioral scenarios and skill rules.
- Verified factual claims, consulted dates, and evidence classification: claim/source contract and behavioral evaluation.
- Clean narration and complete storyboard scene declarations: strict contract and public import/render path.
- Version-linked review and imported-audio rendering: content digest approval gate and multi-scene Remotion integration.

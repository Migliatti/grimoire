## Problem Statement

The creator wants to test a low-cost video side hustle on macOS without depending on MoneyPrinterTurbo. The workflow must support both channel videos and promotional videos, across subjects that are not necessarily educational or cosmological.

The existing local prototype produced a technically valid video, but its narration sounded poor and its animation was too sparse. A playable MP4 is not sufficient: the creator needs deliberate visual direction, expressive Brazilian Portuguese narration, useful motion, coordinated sound, and editable outputs. Repeating production or correcting one scene should not require rebuilding every approved artifact.

## Solution

Build four reusable, executable skills: `video-brief`, `video-audio`, `video-motion`, and `video-produce`. They support independent stages and one coordinated production workflow, with a shared versioned manifest, production profiles, artifact-specific review, local deterministic rendering, resumable execution, and observable validation.

Use local Remotion with React/TypeScript for motion graphics, and ElevenLabs as the initial preferred narration provider behind an interchangeable adapter. Support imported audio as a first-class alternative. Default to Brazilian Portuguese, with optional English. Initially validate vertical 1080×1920 video at 30 fps: approximately 60 seconds for channel videos and 15–30 seconds for promotional videos.

For the first productions, review the script and direction, a voice preview, and a playable 5–10-second scene preview with voice and sound before completing the video. Deliver the final MP4, captions, editable project, evidence and licensing records, manifest, and validation/cost report. Paid calls remain disabled until an explicit budget and authorization are supplied.

## User Stories

1. As a creator, I want to request a video in natural language, so that I can start without manually coordinating production tools.
2. As a creator, I want to create channel videos about different subjects, so that my channel is not restricted to cosmology or education.
3. As a creator, I want to create promotional videos, so that the same skill set can support products, services, and social campaigns.
4. As a creator, I want to run each production stage independently, so that I can reuse an existing script, audio track, or storyboard.
5. As a creator, I want one orchestration entrypoint, so that a complete production does not require remembering a sequence of skills.
6. As a creator, I want short requests to produce an explicit briefing proposal, so that I can review the intended audience, hook, message, and style.
7. As a creator, I want essential missing product information to be requested, so that promotional claims are not invented.
8. As a creator, I want reusable production profiles for channels and brands, so that typography, colors, voice, and motion language remain coherent.
9. As a creator, I want each piece to have its own direction within its profile, so that videos do not all look like the same template.
10. As a creator, I want Brazilian Portuguese by default and optional English, so that I can serve my initial audience and later test another language.
11. As a creator, I want configurable duration and aspect ratio, so that future formats do not require redesigning the production contract.
12. As a creator, I want factual claims connected to verified sources, so that channel and promotional content can be reviewed for accuracy.
13. As a creator, I want established scientific results distinguished from hypotheses and analogies, so that an explanation does not imply false conclusions.
14. As a creator, I want clean narration text separated from citations and visual notes, so that the voice does not read production instructions.
15. As a creator, I want a storyboard that states each scene's purpose and movement, so that animation explains or reinforces the message.
16. As a creator, I want to review the script and visual direction, so that major corrections happen before synthesis and rendering.
17. As a creator, I want an ElevenLabs voice preview, so that I can assess Brazilian accent, pronunciation, rhythm, and interpretation.
18. As a creator, I want to correct pronunciation and delivery, so that acceptable technical audio does not conceal poor narration.
19. As a creator, I want interchangeable narration providers, so that changing the service does not require rewriting the rest of production.
20. As a creator, I want to import existing narration, so that I can reuse approved audio or produce without a synthesis credential.
21. As a creator, I want actual audio duration and alignment, so that scenes and captions follow the recorded speech rather than estimated timing.
22. As a creator, I want narration by default for channel videos and optional narration for promotions, so that sound fits the piece's purpose.
23. As a creator, I want music and effects when they improve the piece, so that the video has rhythm without masking the voice.
24. As a creator, I want a playable scene preview with voice and sound, so that I can judge movement and synchronization rather than only still images.
25. As a creator, I want animated typography, diagrams, data visualizations, product presentations, and calls to action, so that the visuals support varied stories and promotions.
26. As a creator, I want to supply logos, images, screenshots, and demonstrations, so that real materials can become part of the visual direction.
27. As a creator, I want readable text within configurable mobile margins, so that titles and captions remain understandable on a phone.
28. As a creator, I want observations, simulations, and illustrations distinguished where relevant, so that visual explanations do not misrepresent their evidence.
29. As a creator, I want deterministic frames that can be rendered at any time, so that previews and corrections are reproducible.
30. As a creator, I want rendering to wait for fonts and assets, so that missing resources do not silently alter the final composition.
31. As a creator, I want a broadly playable H.264/AAC MP4, so that I can review and distribute the finished artifact using common players.
32. As a creator, I want captions synchronized with speech and a separate caption file, so that the video is readable without sound and remains editable.
33. As a creator, I want progress and recoverable state, so that interrupted production can resume from its last valid stage.
34. As a creator, I want approval linked to the reviewed artifact version, so that edits cannot silently retain obsolete approval.
35. As a creator, I want approved scripts, audio, and unaffected scene frames reused, so that corrections avoid unnecessary work and cost.
36. As a creator, I want to correct one scene, so that a local change does not force regeneration of all scene frames.
37. As a creator, I want audio-duration changes to invalidate affected timing, so that reused artifacts cannot become desynchronized.
38. As a creator, I want separate narration and visual-resource budgets, so that I can control where production money is spent.
39. As a creator, I want paid synthesis and paid previews disabled until authorized, so that starting a workflow does not imply permission to consume credits.
40. As a creator, I want estimated and actual consumption recorded, so that I can assess the economics of the side hustle.
41. As a creator, I want ambiguous paid-call failures preserved rather than blindly retried, so that a timeout does not cause duplicate charges.
42. As a creator, I want credentials configured locally and excluded from artifacts and logs, so that I can connect providers without sharing secrets in chat.
43. As a creator, I want commercial-use conditions and asset licenses recorded, so that I know which outputs can be used commercially.
44. As a creator, I want technical validation separated from creative acceptance, so that file integrity is not presented as proof of production quality.
45. As a creator, I want validation evidence that includes watched motion, inspected frames, and reviewed audio, so that quality claims are grounded in actual media.
46. As a creator, I want exact blockers and preserved intermediate outputs, so that missing credentials or authorization do not erase completed work.
47. As a creator, I want a real channel demonstration and a real fictional-product promotion, so that both supported uses are proven.
48. As a creator, I want installable skills with executable helpers and templates, so that the result can be reused beyond this conversation.
49. As a creator, I want a verified Codex installation guide and a single next-video request, so that I can use the delivered system independently.
50. As a maintainer, I want canonical host-neutral instructions and shared runtime contracts, so that platform packaging does not create divergent skill implementations.

## Implementation Decisions

- Adopt four skills. `video-brief` owns briefing, relevant research, clean script, direction, storyboard, and sound plan. `video-audio` owns preview, synthesis/import, duration, alignment, captions, and mixing. `video-motion` owns scene previews, animations, assembly, and render. `video-produce` owns orchestration, reviews, state, costs, dependency invalidation, and final validation.
- Research is part of briefing rather than a mandatory fifth skill. Use authoritative sources for material factual claims; preserve claim-to-source relationships, consulted dates, and distinctions between evidence, hypotheses, and analogies. Fictional promotional demonstrations must clearly use fictional products and claims.
- Follow accepted ADR 0001: local Remotion with React/TypeScript instead of expanding the existing custom Canvas renderer. HTML/CSS/SVG/Canvas remain available inside scenes. Do not maintain a second production renderer without demonstrated need.
- Animate as a function of frame and parameters. Do not advance render time through wall-clock timers, independent CSS animations, or unseeded randomness. Canvas scenes must calculate arbitrary frames without replaying prior frames.
- Await fonts, images, and other resources with bounded render readiness. Resolve required assets before final rendering and fail explicitly when they cannot load.
- Produce configurable compositions; validate 1080×1920 at 30 fps initially. Encode/assemble with FFmpeg into H.264, yuv420p, AAC when audio is present, and MP4 faststart. Manual screen recording is not the export method.
- Provide adaptable templates for typographic hooks, comparisons/diagrams, data visualization, product presentation, and closing/CTA. Do not force a dark background, stock space clips, or one layout across all pieces.
- Each scene declares its purpose, associated script segments, hierarchy, composition, movement events, transition, sound, and review criterion. Anchor movements to real words/segments or explicit timeline events after measuring audio.
- Save production profiles with typography, colors, voice, and motion language while allowing piece-specific direction. Use configurable safe margins and title/caption overflow checks. Initial vertical margin defaults are 90 px horizontally, 180 px above, and 260 px below; review them in mobile previews.
- Use ElevenLabs as the initial preferred narration adapter, retaining audio import and provider independence. Select the actual voice/model using real Brazilian Portuguese previews and verify model capabilities before generation.
- Normalize provider character-level timestamps into words and caption units. Preserve original and normalized spoken text, measure file duration, and record alignment provenance. Use real forced alignment or review when timestamps are absent or unreliable; do not label estimated timing as measured.
- Prefer continuous short takes or context-aware blocks over independently synthesized sentences with uniform pauses. Preserve generated audio because a provider seed does not guarantee identical output.
- Store original audio and working versions. Apply deliberate voice/music/effect mixing with configurable quality targets. Initial acceptance targets: true peak at most −1 dBTP, integrated mix loudness −16 LUFS ±2, reviewed synchronization tolerance 150 ms, channel duration 55–65 seconds. These are internal configurable criteria rather than universal platform rules.
- If speech does not fit the duration, propose script or delivery changes rather than silently speeding up narration. Audio corrections may invalidate dependent timings and approval.
- Use a versioned JSON manifest containing run identity/revision, topic, purpose, language, profile, format, briefing, script, sources, storyboard, voice, audio, captions, scenes, assets, budgets, approvals, artifacts, validation, and status. Validate schema and cross-record integrity.
- Use stable IDs, relative artifact locations, content hashes, audio times in seconds, and scene intervals in integer frames with inclusive starts and exclusive ends. Record timing provenance separately from planning estimates.
- Support per-stage states pending, running, awaiting review, approved, failed, blocked, and stale. Distinguish a rendered video from a validated or creatively accepted video.
- Persist checkpoints atomically with a per-run lock. Separate input, intermediate, preview, cached, review, and final artifacts. Preserve prior approved outputs and redact secrets from logs and state.
- Tie approval to artifact version/hash and recorded human action. Initial script/direction, voice-preview, and scene-preview reviews are mandatory; lack of response is not approval. A voice preview does not automatically approve a different complete take.
- Reuse valid approved artifacts through dependency-aware hashes. Scene changes invalidate that scene and dependent transitions; duration changes retime affected scenes/captions. Rebuild final assembly and final validation whenever required, without promising reuse of frames whose rendered state changed.
- Provide a public runtime interface for run initialization, briefing import/preparation, audio preview/build/import, scene preview, review decisions, render, resume, scene correction, and validation. Creative generation is performed by the skills/agent; deterministic runtime operations must also work outside the conversation. A single production invocation coordinates the workflow while honoring reviews.
- Keep one versioned owner of shared runtime/contracts, with self-contained installation of the full set. Do not depend on absolute locations in the development checkout. Canonical instructions are English and host-neutral; respond in the user's language. Installation and discovery behavior belong in host-specific documentation.
- Separate narration and visual-resource budgets. Paid calls default to disabled with zero paid limits until explicit authorization and numeric caps exist. A budget authorization does not authorize buying a subscription, publishing, or global installation.
- Estimate calls, account for real usage, and stop when limits cannot be enforced. Previews may consume credits. After an ambiguous paid timeout, preserve the uncertain state and check available history/output before issuing another potentially charged request.
- Allow at most two additional diagnosed retries for reversible local failures; preserve checkpoint and exact recovery guidance for other failures. Do not silently substitute an inferior voice when the preferred provider is blocked.
- Configure the ElevenLabs credential locally through `ELEVENLABS_API_KEY`; never include its value in prompts, manifests, logs, or versioned artifacts. Missing credentials block synthesis but not unrelated local work or imported-audio production.
- Record provider/model/plan and commercial-use conditions at generation time. ElevenLabs free-plan content and Beta Services are not assumed commercially usable. Pin dependencies and verify applicable Remotion terms for the adopted version. Record origin, license, and attribution for external media; reference links alone are not reuse permission.
- Preserve the existing prototype and its demo as historical evidence. Port useful measurements, alignment, cache, resume, and validation mechanisms after audit; replace the fixed composition and fragmented speech approach. Do not alter MoneyPrinterTurbo.

## Testing Decisions

- The user confirmed the public production interface as the principal testing seam: request/manifest → previews, recorded reviews, video, report, resume, and scene correction. Prefer behavior at this seam over tests that call internal helpers or mirror implementation. Use narrower adapter tests only for integration behavior not feasibly exercised through the public workflow.
- Test the composed production workflow and each standalone skill through supported public inputs and observable outputs. Isolate generated artifacts in temporary workspaces; observe statuses, files, media properties, approvals, reuse, and external-call counts.
- Prior art includes the repository's RED/GREEN behavioral evaluations for realistic skill requests and its repository integrity tests for canonical skills, chain membership, packaging, and discoverability. Reuse those conventions rather than inventing a competing evaluation system.
- The existing video prototype offers narrower precedents: real audio import, rejection of invalid timestamps and missing sources, prevention of visual notes entering narration, scene-cache isolation, deterministic out-of-order screenshots, and isolated installation. Adapt their observable behaviors at the higher public seam rather than preserving helper-level assertions or checkout-dependent installation.
- Include realistic RED/GREEN scenarios for weak narration, insufficient motion, factual overclaiming, invented product details, skipped reviews, incorrect cache reuse, and unauthorized paid retries. Record actual outcomes; reading instructions is not behavioral validation.
- Produce a channel video about “O universo tem um centro?” lasting 55–65 seconds, using real Brazilian Portuguese narration, verified scientific claims, synchronized captions, and animation that avoids implying a physical center of expansion.
- Produce a fictional-product promotional video lasting 20 seconds ±2, with its own production profile, presentation/demonstration, and CTA. Narration is optional according to its approved briefing. Identify fictional characteristics and avoid impersonating a real brand.
- For both demonstrations, validate dimensions, fps, duration, codecs, pixel format, complete MP4 decoding, expected audio, clipping/loudness, resources, caption bounds, timing monotonicity, scene continuity, and mobile legibility. Deliver editable artifacts, license/source records, costs, and validation evidence.
- Listen to the voice preview and final mix, watch the animated preview, inspect beginning/middle/end frames, and review transitions plus speech-linked motion. Report which checks were automated, inspected, listened to by the user, or remain blocked. Pixel-change measurements do not establish creative quality.
- Render selected frames twice and out of order in a fixed local runtime and compare their pixels. Do not claim identical MP4 bytes across machines or deterministic remote speech generation.
- Interrupt a production and resume it without repeating approved synthesis. Modify one scene and demonstrate reuse of unaffected scenes through artifact hashes. Change audio duration and demonstrate correct invalidation and updated captions/timeline.
- Exercise missing fonts/assets, corrupt media, invalid alignment, absent credentials, exhausted budgets, ambiguous paid timeouts, and obsolete approval. Observe preserved outputs, explicit blocked/failed status, and safe recovery rather than simulated success.
- Verify standalone imported-audio production and installation in an isolated host environment without a live development-checkout dependency. Run existing repository integrity checks after adding canonical skills and chain packaging.
- Keep routine tests free of paid calls. Deterministic provider doubles may validate protocol/error behavior but must be identified as doubles. They do not prove ElevenLabs synthesis works. Mark that integration validated only after an authorized real call and review of its audio/alignment; imported audio validates only the import path.

## Out of Scope

- Implementation during this spec-publication task.
- Restricting the system to cosmology or educational content.
- Depending on or modifying MoneyPrinterTurbo.
- Generative cinematic video as an MVP capability, cloud rendering, or automatic publishing.
- Buying services, consuming paid credits, or installing globally without the relevant authorization.
- Automatically approving production previews or treating silence as approval.
- Copying reference code or media without verifying its license.
- A second production renderer, a full graphical video editor, and claims of validated support for formats not tested in the initial delivery.
- Guaranteeing identical remote voice generation, universal cross-machine bit-for-bit MP4 reproducibility, or a specific revenue/engagement outcome.

## Further Notes

- Product scope, four-skill boundaries, local Remotion, profiles, reviews, demonstrations, and the principal testing seam were confirmed by the creator. No additional product interview is required before implementation.
- Operational settings remain: the local ElevenLabs credential, voice/model selection through previews, and an explicitly authorized numerical budget before consuming credits. These do not block contract/template/local runtime work. No paid generation or new-provider validation was performed during specification.
- The previous demo establishes technical feasibility of the earlier renderer and local speech pipeline, not acceptable creative quality or a functioning ElevenLabs/Remotion integration.
- Visual/workflow references: [24fps](https://24fps.dev/), [Remotion examples](https://github.com/haidrrrry/claude-remotion-skill/tree/main/examples), and [Claude Motion](https://support.claude.com/pt/articles/17454997-comece-com-claude-motion). They guide direction and editability rather than mandate copying assets or depending on Claude Motion.
- Provider references to recheck during implementation: [ElevenLabs models](https://elevenlabs.io/docs/overview/models), [speech with timestamps](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps), [commercial-use conditions](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform), [Remotion license](https://www.remotion.dev/docs/license/faq), and [frame-synchronized rendering](https://www.remotion.dev/docs/flickering).
- Successful delivery includes functional scripts and reusable visual templates, validated demos and limitations, a single next-video request/command, and verified Codex installation guidance. Documentation alone is insufficient.

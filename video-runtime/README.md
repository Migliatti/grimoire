# Local video production

The local video workflow starts with the canonical [`video-brief`](../skills/video-brief/SKILL.md) skill and continues through this Remotion runtime. It imports a structured, versioned briefing, records review against its exact digest, aligns storyboard scenes with supplied audio, and exports a local H.264/AAC MP4 at 1080×1920/30 fps. Paid narration is optional and separately authorized; existing local and imported-audio workflows need no credentials or provider calls. It remains separate from the historical `educational-video-kit`.

## Setup

Use Node.js 22 or newer and install dependencies **inside this directory**:

```shell
npm ci
npm run typecheck
npm test
```

Dependencies are pinned in `package-lock.json`. FFmpeg and FFprobe are local packages, not global installations. On the first render, Remotion downloads its compatible Chromium headless shell into local `node_modules/.remotion/`; network access is needed for setup. Rendering serves local resources through loopback. No provider calls, credentials, subscriptions, or paid resources are used.

## Prepare a reviewed proposal

Create an isolated run and save the JSON proposal produced by `video-brief`. The proposal schema is documented in that skill. Its purpose and language must match the run. Channel proposals use `--purpose channel` and `promotion: null`; promotions use `--purpose promotion` and require either a complete real-product offer record or an explicit fictional-product disclosure. Brazilian Portuguese is the default; use `--language en` for an explicitly English proposal.

`--license free` declares your eligibility under Remotion's Free License; use `company` only with an existing applicable license. The runtime cannot verify license ownership. [Remotion terms](https://www.remotion.dev/docs/license/faq) were checked on 2026-10-12. Verify the license that applies to you before rendering.

```shell
npm run video -- init runs/first --title "O universo tem um centro?" --purpose channel --language pt-BR --license free --target-duration 45
npm run video -- import-briefing runs/first --briefing /path/to/briefing.json
npm run video -- status runs/first
npm run video -- review runs/first --target briefing --digest <briefing-digest> --decision approved --reviewer "Your name" --notes "Current script and direction reviewed"
```

The runtime validates schema, unique IDs, claim/source references, source consultation dates, clean narration records, scene-to-script references, source-backed numeric data points, supported movement styles, purpose, and language. Movement uses `hold`, `drift`, `zoom`, `orbit`, `pulse`, or `rise`, anchored to a narration segment in that scene. Import stores the original JSON under a relative content-addressed path in `input/` and records the proposal and artifact hash in `manifest.json`. `status` returns the current `reviewDigests.briefing`. Editing or replacing a proposal changes that digest and invalidates its prior approval. Only the human who actually reviewed the current content should record the decision; silence and automated protocol fixtures are not creative approval.

## Optional ElevenLabs narration

Voice preview and synthesis are paid operations. First approve the current briefing, then explicitly authorize a maximum number of provider request characters for this run. The narration budget is independent of the visual budget. Estimates and completed request characters are recorded separately in `manifest.json`; these character counts are not a currency quote. A timeout or malformed response after a synthesis request is marked as an uncertain charge and blocks more paid requests until the provider account is reconciled. The runtime never retries automatically.

The runtime saves the character reservation before the charged request. If a process exits during that request, the next status/command recovers it as uncertain. After checking the provider account, reconcile the reservation explicitly with `npm run video -- reconcile-narration runs/first --outcome charged --confirm-reconciled yes` (or `--outcome not-charged`). A charged reconciliation records this runtime's request-character count after the operator confirms the account outcome; it does not represent provider credits or currency.

Set `ELEVENLABS_API_KEY` in the process environment using your local secret manager. The runtime sends it only as the `xi-api-key` header and does not save it in run artifacts. Choose a voice and model from the provider account after reviewing their capabilities and terms:

```shell
npm run video -- authorize-narration runs/first --limit 1200 --confirm-paid yes
npm run video -- voice-preview runs/first --segment line-001 --voice <voice-id> --model <model-id> --stability 0.5
npm run video -- status runs/first
npm run video -- review runs/first --target voice --digest <voice-digest> --decision approved --reviewer "Your name" --notes "Preview listened to; pronunciation and voice choice approved"
npm run video -- synthesize-narration runs/first --voice <voice-id> --model <model-id> --audio-license "Terms and plan reviewed by operator"
```

The adapter checks current model text-to-speech/language/length capability and the voice's verified language metadata before sending text. A preview uses one narration segment; synthesis sends the clean script as one continuous contextual take with paragraph breaks, and must use the exact voice/model from a current human-approved preview. Optional pronunciation dictionaries use explicit `--pronunciation-dictionary <dictionary-id>:<version-id>[,<dictionary-id>:<version-id>...]` locators; voice settings are also supported. Character timings become the same caption/alignment records used by imported audio. Generated narration preserves the provider audio as the original and creates a measured 48 kHz PCM working copy. The manifest and technical report record provider, voice, model, timing provenance, operator-supplied license conditions, and that commercial-use eligibility is unverified. A human must listen to the preview/take, check timing and pronunciation, and independently confirm applicable license and commercial-use rights. Protocol tests use local doubles and do not demonstrate live provider success. Brazilian Portuguese voice selection, expressive quality, and live alignment remain unvalidated until an operator explicitly authorizes a real paid voice review.

## Import audio and render the storyboard

Alignment must use the narration IDs and clean narration text from the imported proposal. Supply actual seconds within measured decoded audio duration. The runtime normalizes Unicode and whitespace when checking spoken text. For media containers, the first audio stream (`0:a:0`) is decoded into the working WAV and measured; a longer video track does not extend valid audio timing. Alignment provenance is `supplied`: timestamps are validated against the actual audio, but this runtime does not independently force-align speech. Human audio review must check timing against the recording.

```json
{
  "provenance": "supplied",
  "segments": [
    {"id": "line-001", "text": "A expansão não aponta para um centro no espaço.", "start": 0, "end": 2.4}
  ]
}
```

```shell
npm run video -- import-audio runs/first --audio /path/to/narration.wav --alignment /path/to/alignment.json --origin "My own recording" --audio-license "Creator-owned"
npm run video -- status runs/first
npm run video -- review runs/first --target audio --digest <audio-digest> --decision approved --reviewer "Your name" --notes "Full take listened to; word timing checked"
npm run video -- preview runs/first
```

Watch `preview/video-r<revision>.mp4` with sound. Preview spans the imported recording. The renderer maps each supplied audio interval `[start, end)` to integer frames `[floor(start × fps), ceil(end × fps))`; scene starts use the same inclusive-start conversion, scene ends are exclusive, and a scene fills pauses until the next scene boundary. Captions use these same frame bounds and are burned into the video only while their aligned interval is active. Audio import also writes a separate WebVTT file at the path in `status.artifacts.captions` (`review/captions-r<revision>.vtt`). If measured speech exceeds `--target-duration`, `durationAssessment` and import progress warn and suggest shortening/restructuring the script or recording a new delivery; imported speech is never accelerated. It renders the approved profile colors, scene templates, selected movement styles, transitions, and imported narration. Sound-plan cues remain planning notes; no voice/music/effect synthesis is implemented here.

After watching the preview, record the actual scene review and render:

```shell
npm run video -- status runs/first
npm run video -- review runs/first --target scene --digest <scene-digest> --decision approved --reviewer "Your name" --notes "Storyboard motion and audio reviewed"
npm run video -- render runs/first
npm run video -- validate runs/first
```

The final MP4 is under `final/`; measured properties and full-decoding results are in `review/technical-report-r<revision>.json`. The final local encode normalizes H.264 video to `yuv420p`, AAC audio, and MP4 faststart. `validated` means technical checks passed; it does not claim factual or creative acceptance, mobile legibility, loudness compliance, or final human listening.

## Editable composition and resources

`src/scene.tsx` is the editable React/TypeScript composition. Motion is calculated from the current frame, without timers or unseeded randomness. The default scene uses locally drawn SVG and the system Arial font; text stays within vertical margins of 90 px horizontally, 180 px above, and 260 px below. Review long titles on mobile; length alone does not guarantee legibility.

To supply a font or image, add `--font /path/font.ttf` and/or `--image /path/image.png` to `init`, plus `--asset-origin` and `--asset-license` (and `--attribution` if needed). The runtime copies resources into the run, checks their hashes, waits for font/image/audio readiness, and fails on missing or unloadable resources. Both supplied resources share this rights record; use only files covered by that record. Source links alone do not grant reuse rights.

Render inspection frames through the same public boundary:

```shell
npm run video -- frame runs/first --frame 20 --output review/frame-20.png
```

## State and recovery

Runs have stable IDs, schema version 1, increasing revisions, atomic manifest checkpoints and an exclusive `.run.lock`. Input, working audio, preview, cache, review and final files are separate. Original audio is preserved byte-for-byte; a 48 kHz PCM working version is created without speeding up speech. Its measured duration owns alignment bounds and the scene length. Imports and renders keep prior files with content hashes/revisions. Re-importing audio clears current derived outputs and makes old reviews obsolete.

Errors return nonzero status and JSON on stderr; successful invocations return JSON on stdout (use the direct Node command if your caller needs no npm banner). Check `status` and `blocker` for recovery. An unreadable/schema-invalid manifest produces `failure.json` without replacing that manifest. Fix a missing resource or restore its original bytes; rerun the failed command. If a process was interrupted, inspect the PID in `.run.lock` and remove the lock only after that process exits. This slice does not yet provide automatic resume or cache reuse.

Paths are relative and checked against escaping paths/symlinks. Moving a run preserves references; keep the runtime installation available. Dependencies and source code are provided here, while independently installed skills and self-contained project export are later work (#10).

## Validation boundaries

Routine integration tests use actual generated WAV media and actual Remotion/FFmpeg rendering, never a paid service. Tone fixtures exercise timing and caption rendering but are not evidence of expressive speech or human-verified word alignment. Tests cover run creation, measured import, supplied provenance, caption files and burn-in, duration-target warnings, review gates, final codecs/dimensions/fps/duration/faststart, complete decoding, moved runs, deterministic out-of-order frames, corrupt audio, invalid timestamps/manifests, changed bytes, missing files, and unloadable fonts. Creative quality and narration-provider integration remain unvalidated.

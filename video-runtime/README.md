# Local imported-audio production

This is the first executable slice of the video workflow (#4), separate from the historical `educational-video-kit`. It supports one frame-driven Remotion scene, supplied alignment, recorded human reviews, and local H.264/AAC export at 1080×1920/30 fps. It does not implement the later briefing, narration-provider, caption, correction, or installation tickets.

## Setup

Use Node.js 22 or newer and install dependencies **inside this directory**:

```shell
npm ci
npm run typecheck
npm test
```

Dependencies are pinned in `package-lock.json`. FFmpeg and FFprobe are local packages, not global installations. On the first render, Remotion downloads its compatible Chromium headless shell into local `node_modules/.remotion/`; network access is needed for setup. Rendering serves local resources through loopback. No provider calls, credentials, subscriptions, or paid resources are used.

## First video

Create a run with a short scene title (maximum 80 characters). `--license free` declares your eligibility under Remotion's Free License; use `company` only with an existing applicable license. The runtime cannot verify license ownership. [Remotion terms](https://www.remotion.dev/docs/license/faq) were checked on 2026-10-12: individuals and organizations with up to three people can qualify for free use, including commercial use. Other users must verify their applicable license before rendering.

```shell
npm run video -- init runs/first --title "Uma cena em movimento" --license free
npm run video -- import-audio runs/first --audio /path/to/narration.wav --alignment /path/to/alignment.json --origin "My own recording" --audio-license "Creator-owned"
npm run video -- status runs/first
```

Supply alignment with actual seconds within the measured decoded audio duration. For media containers, the first audio stream (`0:a:0`) is decoded into the working WAV and measured; a longer video track does not extend valid audio timing. The runtime validates bounds, unique IDs, positive intervals, and monotonic non-overlapping segments. It does not verify that words were actually spoken at those times; human audio review must check that. Planning estimates must not be passed off as measured alignment.

```json
{
  "provenance": "supplied",
  "segments": [
    {"id": "segment-001", "text": "Uma cena em movimento.", "start": 0, "end": 2.4}
  ]
}
```

Review the proposed title/direction and listen to the preserved imported audio. `status` returns `reviewDigests` for current content. A human reviewer records each decision with the exact digest; substituting an old digest fails. These commands record human decisions, so agents must not use them to invent approval or treat silence as approval. A test operator in the integration suite represents protocol input only, not creative acceptance.

```shell
npm run video -- review runs/first --target briefing --digest <briefing-digest> --decision approved --reviewer "Your name" --notes "Title and direction reviewed"
npm run video -- review runs/first --target audio --digest <audio-digest> --decision approved --reviewer "Your name" --notes "Full imported take listened to; timing checked"
npm run video -- preview runs/first
npm run video -- status runs/first
```

Watch the generated `preview/video-r<revision>.mp4` with sound. Use a 5–10-second recording for a first production preview. This slice previews the entire imported recording; select a short input rather than expecting scene selection or trimming. Then record the scene decision:

```shell
npm run video -- review runs/first --target scene --digest <scene-digest> --decision approved --reviewer "Your name" --notes "Motion and audio reviewed"
npm run video -- render runs/first
npm run video -- validate runs/first
```

The final MP4 is under `final/`; measured properties and full-decoding results are in `review/technical-report-r<revision>.json`. `manifest.json` points to their exact relative paths and SHA-256 hashes. `validated` means technical checks passed; it does not claim creative acceptance, mobile legibility, loudness compliance, or final human listening.

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

Routine integration tests use actual generated WAV tone files and actual Remotion/FFmpeg rendering, never a paid service. The tone is a media fixture, not evidence of expressive speech. Tests cover run creation, measured import, review gates, final codecs/dimensions/fps/duration/faststart, complete decoding, moved runs, deterministic out-of-order frames, corrupt audio, invalid timestamps/manifests, changed bytes, missing files, and unloadable fonts. Creative quality and narration-provider integration remain unvalidated.

# Validation record — issue #4

Date: 2026-10-12. Environment: macOS arm64, Node.js 24.21.0, Remotion 4.0.535, locked local FFmpeg/FFprobe dependencies.

- `npm run typecheck` in `video-runtime`: passed.
- `npm test` in `video-runtime`: 9 tests passed, 0 failed (38.9 seconds in the final run).
- `python3 -m unittest tests.test_repository -v`: 41 tests passed.
- `git diff --cached --check`: passed.

The public integration path generated a real one-second WAV fixture, preserved imported bytes, rendered a playable preview and final MP4 through Chromium/Remotion, measured 1080×1920 at 30 fps with H.264/yuv420p and AAC, confirmed MP4 faststart box order, and decoded the entire output. Moving a run preserved usable references. Repeated frame 10 rendered before/after frame 0 produced equal decoded RGB pixels; the different frame differed.

Negative cases exercised corrupt media, invalid supplied timing/manifests, obsolete review digests, changed bytes, missing audio, corrupt fonts, invalid license metadata, escaped paths, symlinked parent directories and dangling destination symlinks. Failures remained explicit and no external file was created in the path-boundary regressions.

Standards and Spec reviews ran independently. The Standards review found a parent/dangling-symlink output escape; the Spec review found failure-state loss on invalid licensing metadata. Both were corrected, received public regression tests and were verified by the respective reviewers. No findings remain on either axis.

All test workspaces are temporary and cleaned up. Test review records identify an automated protocol fixture. No real human creative approval, speech-quality evaluation, final listening, caption synchronization, loudness/true-peak result, or paid-provider integration is claimed. No paid calls were made and the historical prototype was preserved.

## Follow-up review corrections

The subsequent review identified duplicated timing validation (Standards P3) and container-duration measurement that could accept timestamps beyond decoded audio (Spec P2). Both were corrected: one shared alignment contract now validates imports and loaded manifests; import explicitly decodes the first audio stream and measures the actual working WAV. Original input bytes are preserved, and existing identical working artifacts are retained.

The new public regression first failed on a real five-second MP4 containing approximately one second of AAC audio, then passed after the correction. The final full runtime suite passed all 10 tests (47.0 seconds); typechecking and all 41 repository contracts also passed. Independent Standards and Spec reviewers confirmed both corrections with no remaining findings in the changes.

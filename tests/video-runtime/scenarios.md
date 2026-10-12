# Imported-audio production evaluation (#4)

The pre-agreed seam is the public production invocation, as specified in parent #3. These are executable integration evaluations, not inspection-only claims about skill text. Run `npm test` inside `video-runtime` and the repository contracts from the root.

## Observed RED

- Before media operations existed, the public imported-audio test failed because `src/media` was unavailable.
- The first full render exposed the sandbox's blocked loopback port and Chromium download. With local rendering access, a successful first download polluted the JSON output; the integration test failed parsing `Downloading...`. Renderer diagnostics were moved to stderr.

## GREEN criteria

- Create an isolated versioned run with stable identity, relative paths and zero paid budgets.
- Import a real generated WAV fixture and preserve its exact bytes; measure one second and map to 30 frames.
- Refuse final rendering until current briefing/audio/scene reviews are recorded. Test review records explicitly identify an automated protocol fixture and do not constitute human creative approval.
- Actually render a preview and a final Remotion MP4. Measure 1080×1920, 30 fps, H.264, yuv420p, AAC and duration; inspect MP4 box order for faststart and fully decode the file.
- Move the run and validate again using relative references.
- Render frames 10, 0 and 10 through the public interface. Compare decoded RGB pixels: repeated frame matches, different frame changes.
- Refuse corrupt audio, invalid timing/schema/reference escapes, modified media, obsolete digests, missing resources and an unloadable font. Preserve inputs and explicit failure/blocker outputs.

See `production.test.ts` in the runtime for executable scenarios. No ElevenLabs call, paid call, real creative approval, speech-quality claim, or historical-prototype change is part of this evaluation.

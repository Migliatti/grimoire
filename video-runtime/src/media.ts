import {spawnSync} from 'node:child_process';
import {copyFileSync, readFileSync, writeFileSync, mkdirSync, existsSync, renameSync, unlinkSync} from 'node:fs';
import {join, extname} from 'node:path';
import {createRequire} from 'node:module';
import {createHash, randomUUID} from 'node:crypto';
import ffmpeg from 'ffmpeg-static';
import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia, renderStill} from '@remotion/renderer';
import {alignmentSchema, validateAlignment, validateBriefingAlignment, rightsSchema, relativePath, type Manifest} from './contracts';
import {artifact, progress, requireReview, runtimeRoot, safePath, digest} from './production';

const ffprobe = (createRequire(import.meta.url)('ffprobe-static') as {path: string}).path;
function tool(binary: string | null, args: string[]) {
  if (!binary || !existsSync(binary)) throw new Error('Required local media tool missing; run npm ci');
  const result = spawnSync(binary, args, {encoding: 'utf8', timeout: 120_000, maxBuffer: 8 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`Media operation failed: ${result.error?.message ?? result.stderr.slice(-3000)}`);
  return result.stdout;
}
type Probe = {format: {duration: string}; streams: {codec_type: string; codec_name: string; pix_fmt?: string; width?: number; height?: number; avg_frame_rate?: string}[]};
function probe(path: string): Probe {return JSON.parse(tool(ffprobe, ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', path]));}
export function measureAudio(path: string) {
  const media = probe(path);
  if (!media.streams.some((stream) => stream.codec_type === 'audio')) throw new Error('Generated media has no audio stream');
  const duration = Number(media.format.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Generated audio duration could not be measured');
  return duration;
}
function decode(path: string) {tool(ffmpeg, ['-v', 'error', '-xerror', '-i', path, '-f', 'null', '-']);}
// Assign a boundary to the first frame sampled at or after its timestamp.
function secondsToBoundaryFrame(seconds: number, fps: number) {return Math.ceil(seconds * fps);}
function vttTime(seconds: number) {
  const milliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor(milliseconds / 60_000) % 60;
  const wholeSeconds = Math.floor(milliseconds / 1000) % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(wholeSeconds).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`;
}
function captionFile(alignment: NonNullable<Manifest['audio']>['alignment']) {
  return `WEBVTT\n\n${alignment.segments.map((segment, index) => `${index + 1}\n${vttTime(segment.start)} --> ${vttTime(segment.end)}\n${segment.text.normalize('NFC').trim().replace(/\s+/gu, ' ')}\n`).join('\n')}`;
}
export async function importAudio(root: string, m: Manifest, options: Record<string, string | undefined>) {
  if (!options.audio || !options.alignment || !options.origin || !options['audio-license']) throw new Error('Audio, supplied alignment, origin and audio-license required');
  const rights = rightsSchema.parse({origin: options.origin, license: options['audio-license'], attribution: options.attribution ?? ''});
  const source = probe(options.audio);
  if (!source.streams.some((s) => s.codec_type === 'audio')) throw new Error('No audio stream in supplied media');
  const alignment = alignmentSchema.parse(JSON.parse(readFileSync(options.alignment, 'utf8')));
  if (m.briefing) validateBriefingAlignment(alignment, m.briefing.proposal);
  const temporary = safePath(root, `intermediate/import-${randomUUID()}.wav`);
  try {
    // Explicitly select the first audio stream. Measure the exact decoded track
    // used by Remotion, not the container (which may contain a longer video).
    tool(ffmpeg, ['-v', 'error', '-xerror', '-y', '-i', options.audio, '-map', '0:a:0', '-vn', '-ar', '48000', '-c:a', 'pcm_s16le', temporary]);
    const duration = Number(probe(temporary).format.duration);
    validateAlignment(alignment, duration, [m.scene.id, 'audio-001']);
    const inputHash = artifactOfExternal(options.audio);
    const workingHash = artifactOfExternal(temporary);
    const originalPath = `input/audio-${inputHash}${extname(options.audio) || '.audio'}`;
    const workingPath = `intermediate/audio-${inputHash}-${workingHash}.wav`;
    copyFileSync(options.audio, safePath(root, originalPath));
    const destination = safePath(root, workingPath);
    // Retain an already approved identical working file rather than overwriting it.
    if (!existsSync(destination)) renameSync(temporary, destination);
    else if (artifactOfExternal(destination) !== workingHash) throw new Error('Existing working audio does not match its content hash');
    m.audio = {id: 'audio-001', original: artifact(root, originalPath, 'original-audio'), working: artifact(root, workingPath, 'working-audio'), duration, alignment, rights, synthesis: null};
    m.scene.endFrame = Math.ceil(duration * m.format.fps);
    m.durationAssessment = m.durationTargetSeconds === null ? null : {
      targetSeconds: m.durationTargetSeconds,
      measuredSeconds: duration,
      status: duration > m.durationTargetSeconds ? 'over_target' : 'within_target',
      recommendation: duration > m.durationTargetSeconds ? 'Shorten or restructure the script, or record a new delivery; imported speech was not accelerated.' : null,
    };
    m.artifacts = {preview: null, final: null, report: null, captions: null, voicePreview: m.artifacts.voicePreview};
    m.previewSourceHash = null;
    const captionsPath = `review/captions-r${m.revision}.vtt`;
    writeFileSync(safePath(root, captionsPath), captionFile(alignment), {flag: 'wx'});
    m.artifacts.captions = artifact(root, captionsPath, 'captions');
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
  const assessment = m.durationAssessment;
  const durationNote = assessment?.status === 'over_target'
    ? ` Measured narration ${assessment.measuredSeconds.toFixed(2)}s exceeds the ${assessment.targetSeconds.toFixed(2)}s target. ${assessment.recommendation}`
    : assessment ? ` Measured narration ${assessment.measuredSeconds.toFixed(2)}s is within the ${assessment.targetSeconds.toFixed(2)}s target.` : '';
  progress(root, m, 'import-audio', 'awaiting_review', `Audio preserved and measured; supplied alignment validated, not independently forced-aligned.${durationNote}`);
}
function artifactOfExternal(path: string) {return createHash('sha256').update(readFileSync(path)).digest('hex');}

async function composition(root: string, m: Manifest) {
  if (!m.audio) throw new Error('Imported audio required');
  if (!m.briefing) throw new Error('Imported and reviewed briefing required');
  // Serve only explicitly declared resources, never the entire run or reviewer records.
  const actualDuration = Number(probe(safePath(root, m.audio.working.path)).format.duration);
  if (Math.abs(actualDuration - m.audio.duration) > 0.001) throw new Error('Manifest duration does not match actual working audio');
  const resources = safePath(root, 'cached/resources');
  mkdirSync(resources, {recursive: true});
  const names: Record<string, string | null> = {audio: null, font: null, image: null};
  for (const [key, record] of Object.entries({audio: m.audio.working, font: m.scene.font, image: m.scene.image})) {
    if (record) {const name = `${key}-${record.sha256}${extname(record.path)}`; copyFileSync(safePath(root, record.path), safePath(root, `cached/resources/${name}`)); names[key] = name;}
  }
  const serveUrl = await bundle({entryPoint: join(runtimeRoot, 'src', 'scene.tsx'), publicDir: resources, outDir: safePath(root, 'cached/bundle')});
  const proposal = m.briefing.proposal;
  const alignmentById = new Map(m.audio.alignment.segments.map((segment, index) => [segment.id, {segment, index}]));
  const boundaryFrames = proposal.storyboard.slice(1).map((scene) => {
    const aligned = alignmentById.get(scene.narrationSegmentIds[0]!);
    if (!aligned) throw new Error(`Storyboard references missing aligned narration: ${scene.narrationSegmentIds[0]}`);
    return secondsToBoundaryFrame(aligned.segment.start, m.format.fps);
  });
  const storyboard = proposal.storyboard.map((scene, index) => {
    const startFrame = index === 0 ? 0 : boundaryFrames[index - 1]!;
    const endFrame = boundaryFrames[index] ?? m.scene.endFrame;
    if (endFrame <= startFrame) throw new Error(`Storyboard scene has no renderable frames: ${scene.id}`);
    return {...scene, startFrame, endFrame};
  });
  const captions = m.audio.alignment.segments.map((segment) => ({
    text: segment.text.normalize('NFC').trim().replace(/\s+/gu, ' '),
    startFrame: secondsToBoundaryFrame(segment.start, m.format.fps),
    endFrame: Math.min(m.scene.endFrame, secondsToBoundaryFrame(segment.end, m.format.fps)),
  }));
  const inputProps = {scene: m.scene, storyboard, captions, profile: proposal.profile, purpose: proposal.purpose, language: proposal.language, durationInFrames: m.scene.endFrame, resources: names};
  const selected = await selectComposition({serveUrl, id: 'LocalScene', inputProps, timeoutInMilliseconds: 30_000});
  return {serveUrl, inputProps, composition: selected, timeoutInMilliseconds: 30_000};
}
export async function render(root: string, m: Manifest, stage: 'preview' | 'render') {
  requireReview(m, 'briefing');
  requireReview(m, 'audio');
  if (stage === 'render') requireReview(m, 'scene');
  progress(root, m, stage, 'running');
  const config = await composition(root, m);
  const dir = stage === 'preview' ? 'preview' : 'final';
  const output = `${dir}/video-r${m.revision}.mp4`;
  const temporary = safePath(root, `intermediate/render-r${m.revision}.mp4`);
  await renderMedia({...config, outputLocation: temporary, codec: 'h264', pixelFormat: 'yuv420p', audioCodec: 'aac', concurrency: 2,
    onProgress: ({progress: ratio}) => process.stderr.write(JSON.stringify({stage, progress: Math.round(ratio * 100)}) + '\n')});
  // Normalize the final delivery even when the renderer's intermediate is
  // tagged full-range (yuvj420p) by a platform-specific FFmpeg build.
  tool(ffmpeg, ['-v', 'error', '-y', '-i', temporary, '-map', '0:v:0', '-map', '0:a?', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', safePath(root, output)]);
  decode(safePath(root, output));
  if (stage === 'preview') {m.previewSourceHash = digest(readFileSync(join(runtimeRoot, 'src', 'scene.tsx'), 'utf8')); m.artifacts.preview = artifact(root, output, 'scene-preview'); progress(root, m, stage, 'awaiting_review');}
  else {m.artifacts.final = artifact(root, output, 'final-video'); await validate(root, m);}
}
function mp4Faststart(path: string) {
  const bytes = readFileSync(path);
  const boxes: string[] = [];
  for (let offset = 0; offset + 8 <= bytes.length;) {
    let size = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    if (size === 1) {if (offset + 16 > bytes.length) throw new Error('Truncated MP4'); size = Number(bytes.readBigUInt64BE(offset + 8));}
    if (size === 0) size = bytes.length - offset;
    if (size < 8 || offset + size > bytes.length) throw new Error('Invalid MP4 box');
    boxes.push(type); offset += size;
  }
  return boxes.includes('moov') && boxes.includes('mdat') && boxes.indexOf('moov') < boxes.indexOf('mdat');
}
export async function validate(root: string, m: Manifest) {
  if (!m.artifacts.final || !m.audio) throw new Error('Final video and audio required');
  const path = safePath(root, m.artifacts.final.path);
  const measured = probe(path);
  const video = measured.streams.find((s) => s.codec_type === 'video');
  const audio = measured.streams.find((s) => s.codec_type === 'audio');
  const duration = Number(measured.format.duration);
  const expectedDuration = m.scene.endFrame / m.format.fps;
  const checks = {dimensions: video?.width === 1080 && video?.height === 1920,
    fps: video?.avg_frame_rate === '30/1', videoCodec: video?.codec_name === 'h264', pixelFormat: video?.pix_fmt === 'yuv420p',
    audioCodec: audio?.codec_name === 'aac', duration: Math.abs(duration - expectedDuration) <= 0.1, faststart: mp4Faststart(path)};
  decode(path);
  const report = {schemaVersion: 1, runId: m.id, revision: m.revision, video: m.artifacts.final, measured, checks: {...checks, fullDecode: true},
    technicalPass: Object.values(checks).every(Boolean), creativeAcceptance: 'Not inferred from technical checks; see recorded human reviews',
    alignment: m.audio.alignment.provenance === 'supplied' ? 'Supplied timing validated against measured audio; speech synchronization requires human review' : 'Provider character timing mapped to the shared caption alignment contract and validated against measured audio; speech synchronization requires human review',
    costs: m.budgets, licenses: {remotion: {version: '4.0.535', declaredEligibility: m.remotionLicense, source: 'https://www.remotion.dev/docs/license/faq', checkedOn: '2026-10-12'}, audio: m.audio.rights, narrationProvider: m.audio.synthesis, assets: m.assetRights},
    captions: m.artifacts.captions,
    untested: ['Loudness/true peak targets', 'Mobile legibility', 'Final human audio/creative review']};
  const reportPath = `review/technical-report-r${m.revision}.json`;
  writeFileSync(safePath(root, reportPath), JSON.stringify(report, null, 2) + '\n');
  m.artifacts.report = artifact(root, reportPath, 'technical-report');
  if (!report.technicalPass) throw new Error('Final media failed technical checks; inspect technical report');
  progress(root, m, 'validate', 'validated', 'Technical media validation passed; creative acceptance remains separate');
}
export async function frame(root: string, m: Manifest, options: Record<string, string | undefined>) {
  const frame = Number(options.frame);
  if (!Number.isInteger(frame) || frame < 0 || frame >= m.scene.endFrame || !options.output) throw new Error('Frame must be an integer inside the scene and output must be a relative run path');
  relativePath.parse(options.output);
  if (!/^review\/[a-zA-Z0-9_-]+\.png$/.test(options.output)) throw new Error('Frame output must be review/<name>.png');
  const output = safePath(root, options.output);
  mkdirSync(join(root, 'review'), {recursive: true});
  const config = await composition(root, m);
  await renderStill({...config, frame, output, imageFormat: 'png'});
  progress(root, m, 'frame', 'awaiting_review', `Rendered frame ${frame}`);
}

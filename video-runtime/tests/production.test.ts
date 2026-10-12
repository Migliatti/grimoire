import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const cli = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts', ...args], {encoding: 'utf8'});
const json = (result: ReturnType<typeof cli>) => {
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
};

test('public invocation creates a versioned, portable run without paid services', () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-video-'));
  try {
    const result = json(cli(['init', join(root, 'run'), '--title', 'Uma primeira cena', '--license', 'free']));
    assert.equal(result.schemaVersion, 1);
    assert.equal(result.revision, 1);
    assert.equal(result.status, 'pending');
    assert.equal(result.budgets.narration.limit, 0);
    assert.equal(result.budgets.visuals.paidEnabled, false);
    assert.ok(result.id);
    assert.equal(JSON.parse(readFileSync(join(root, 'run/manifest.json'), 'utf8')).id, result.id);
    assert.notEqual(cli(['init', join(root, 'run'), '--title', 'overwrite', '--license', 'free']).status, 0);
  } finally {rmSync(root, {recursive: true, force: true});}
});

import ffmpeg from 'ffmpeg-static';
import {writeFileSync, renameSync, symlinkSync, readdirSync, existsSync} from 'node:fs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-media-'));
  const run = join(root, 'run');
  json(cli(['init', run, '--title', 'Uma cena em movimento', '--license', 'free']));
  const audio = join(root, 'voice.wav');
  const generated = spawnSync(ffmpeg!, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-ar', '48000', audio], {encoding: 'utf8'});
  assert.equal(generated.status, 0, generated.stderr);
  const alignment = join(root, 'alignment.json');
  writeFileSync(alignment, JSON.stringify({provenance: 'supplied', segments: [{id: 'segment-001', text: 'Test fixture tone, not speech', start: 0, end: 1}]}));
  return {root, run, audio, alignment};
}
const importArgs = (f: ReturnType<typeof fixture>) => ['import-audio', f.run, '--audio', f.audio, '--alignment', f.alignment, '--origin', 'Locally generated test tone', '--audio-license', 'CC0'];

test('public audio import preserves real bytes and measures supplied timing', () => {
  const f = fixture();
  try {
    const m = json(cli(importArgs(f)));
    assert.equal(m.audio.duration, 1);
    assert.deepEqual(readFileSync(join(f.run, m.audio.original.path)), readFileSync(f.audio));
    assert.equal(m.scene.endFrame, 30);
    assert.equal(m.status, 'awaiting_review');
    const blocked = cli(['render', f.run]);
    assert.notEqual(blocked.status, 0);
    assert.equal(json(cli(['status', f.run])).status, 'blocked');
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

function approve(run: string, target: string) {
  const status = json(cli(['status', run]));
  return json(cli(['review', run, '--target', target, '--digest', status.reviewDigests[target], '--decision', 'approved', '--reviewer', 'Automated test operator (protocol fixture)', '--notes', 'Test protocol only; no creative acceptance claimed']));
}

test('public workflow gates final rendering on artifact reviews and validates a real Remotion MP4', {timeout: 240_000}, () => {
  const f = fixture();
  try {
    json(cli(importArgs(f)));
    approve(f.run, 'briefing'); approve(f.run, 'audio');
    json(cli(['preview', f.run]));
    assert.notEqual(cli(['render', f.run]).status, 0);
    approve(f.run, 'scene');
    const m = json(cli(['render', f.run]));
    assert.equal(m.status, 'validated');
    const report = JSON.parse(readFileSync(join(f.run, m.artifacts.report.path), 'utf8'));
    assert.equal(report.technicalPass, true);
    assert.equal(report.checks.fullDecode, true);
    assert.equal(report.checks.faststart, true);
    assert.equal(report.measured.streams.find((s: {codec_type: string}) => s.codec_type === 'audio').codec_name, 'aac');
    const moved = join(f.root, 'moved');
    // All manifest references survive moving the run.
    renameSync(f.run, moved);
    assert.equal(json(cli(['validate', moved])).status, 'validated');
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

test('invalid timing and corrupt audio fail explicitly and preserve the run', () => {
  const f = fixture();
  try {
    writeFileSync(f.alignment, JSON.stringify({provenance: 'supplied', segments: [{id: 'segment-001', text: 'Outside audio', start: 0, end: 2}]}));
    assert.notEqual(cli(importArgs(f)).status, 0);
    assert.equal(json(cli(['status', f.run])).status, 'failed');
    writeFileSync(f.audio, 'not media');
    assert.notEqual(cli(importArgs(f)).status, 0);
    const m = json(cli(['status', f.run]));
    assert.equal(m.audio, null);
    assert.ok(m.blocker);
    assert.equal(m.budgets.narration.actual, 0);
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

test('changed audio, obsolete review digests and escaping references are refused', () => {
  const f = fixture();
  try {
    json(cli(importArgs(f)));
    const before = json(cli(['status', f.run]));
    assert.notEqual(cli(['review', f.run, '--target', 'audio', '--digest', '0'.repeat(64), '--decision', 'approved', '--reviewer', 'Test operator']).status, 0);
    writeFileSync(join(f.run, before.audio.original.path), 'changed bytes');
    assert.notEqual(cli(['render', f.run]).status, 0);
    const manifest = JSON.parse(readFileSync(join(f.run, 'manifest.json'), 'utf8'));
    assert.equal(manifest.status, 'failed');
    manifest.audio.original.path = '../outside.wav';
    writeFileSync(join(f.run, 'manifest.json'), JSON.stringify(manifest));
    assert.notEqual(cli(['status', f.run]).status, 0);
    assert.equal(JSON.parse(readFileSync(join(f.run, 'failure.json'), 'utf8')).status, 'failed');
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

test('public frames are deterministic out of order and missing resources block rendering', {timeout: 180_000}, () => {
  const f = fixture();
  try {
    json(cli(importArgs(f)));
    for (const [frame, output] of [['10', 'review/a.png'], ['0', 'review/b.png'], ['10', 'review/c.png']]) {
      json(cli(['frame', f.run, '--frame', frame, '--output', output]));
    }
    const pixels = (name: string) => spawnSync(ffmpeg!, ['-v', 'error', '-i', join(f.run, 'review', name), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: 1080 * 1920 * 4}).stdout;
    assert.deepEqual(pixels('a.png'), pixels('c.png'));
    assert.notDeepEqual(pixels('a.png'), pixels('b.png'));
    const m = json(cli(['status', f.run]));
    rmSync(join(f.run, m.audio.working.path));
    assert.notEqual(cli(['preview', f.run]).status, 0);
    assert.equal(JSON.parse(readFileSync(join(f.run, 'manifest.json'), 'utf8')).status, 'blocked');
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

test('invalid manifests and unavailable required fonts fail without exporting a final video', {timeout: 120_000}, () => {
  const f = fixture();
  try {
    json(cli(importArgs(f)));
    const m = json(cli(['status', f.run]));
    m.audio.alignment.segments[0].end = 9;
    delete m.reviewDigests;
    writeFileSync(join(f.run, 'manifest.json'), JSON.stringify(m));
    assert.notEqual(cli(['preview', f.run]).status, 0);
    assert.equal(JSON.parse(readFileSync(join(f.run, 'failure.json'), 'utf8')).status, 'failed');
    const font = join(f.root, 'unloadable.ttf'); writeFileSync(font, 'broken font');
    const second = join(f.root, 'font-run');
    json(cli(['init', second, '--title', 'Font test', '--license', 'free', '--font', font, '--asset-origin', 'Corrupt test fixture', '--asset-license', 'CC0']));
    json(cli([...importArgs(f).slice(0, 1), second, ...importArgs(f).slice(2)]));
    approve(second, 'briefing'); approve(second, 'audio');
    assert.notEqual(cli(['preview', second]).status, 0);
    const failed = json(cli(['status', second]));
    assert.equal(failed.status, 'failed');
    assert.equal(failed.artifacts.final, null);
    assert.match(failed.blocker, /font|decode|load/i);
  } finally {rmSync(f.root, {recursive: true, force: true});}
});


test('symlinked parent directories cannot write imported audio outside the run', () => {
  const f = fixture();
  try {
    const outside = join(f.root, 'outside');
    renameSync(join(f.run, 'input'), outside);
    symlinkSync(outside, join(f.run, 'input'));
    assert.notEqual(cli(importArgs(f)).status, 0);
    assert.equal(json(cli(['status', f.run])).status, 'failed');
    assert.equal(readdirSync(outside).length, 0);
    rmSync(join(f.run, 'input'));
    renameSync(outside, join(f.run, 'input'));
    json(cli(importArgs(f)));
    const external = join(f.root, 'outside.png');
    symlinkSync(external, join(f.run, 'review/dangling.png'));
    assert.notEqual(cli(['frame', f.run, '--frame', '0', '--output', 'review/dangling.png']).status, 0);
    assert.equal(existsSync(external), false);
  } finally {rmSync(f.root, {recursive: true, force: true});}
});


test('invalid licensing metadata fails explicitly before accepting imported audio', () => {
  const f = fixture();
  try {
    const args = importArgs(f);
    args[args.indexOf('--origin') + 1] = '   ';
    assert.notEqual(cli(args).status, 0);
    const m = json(cli(['status', f.run]));
    assert.equal(m.status, 'failed');
    assert.ok(m.blocker);
    assert.equal(m.audio, null);
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

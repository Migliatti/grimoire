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
import {writeFileSync, renameSync, symlinkSync, readdirSync, existsSync, mkdirSync, copyFileSync} from 'node:fs';

function briefingFixture() {
  return {
    schemaVersion: 1, id: 'briefing-001', title: 'O universo tem um centro?', purpose: 'channel', language: 'pt-BR',
    request: {subject: 'Expansão do universo', audience: 'Público geral', objective: 'Explicar o modelo sem sugerir um centro físico', coreMessage: 'A expansão não aponta para um centro espacial.'},
    promotion: null,
    profile: {id: 'profile-editorial', name: 'Editorial azul', typography: {heading: 'Inter Bold', body: 'Inter'}, colors: {background: '#f4f0e8', foreground: '#17202e', accent: '#245bcc'}, voicePreference: 'Português brasileiro, ritmo conversacional', motionLanguage: 'Diagramas que se revelam no ritmo da fala'},
    direction: {hook: 'O universo está se expandindo para algum lugar?', tone: 'Claro e curioso', visualApproach: 'Grade de galáxias que aumenta sem indicar um ponto central', callToAction: 'Compartilhe sua pergunta sobre o universo.'},
    narration: [
      {id: 'line-001', text: 'A expansão do universo não significa que exista um centro no espaço.'},
      {id: 'line-002', text: 'Em grande escala, as distâncias entre galáxias aumentam com o tempo.'},
    ],
    sources: [{id: 'source-001', title: 'Expanding Universe', url: 'https://science.nasa.gov/universe/overview/', publisher: 'NASA', consultedOn: '2026-10-13', sourceType: 'primary'}],
    claims: [
      {id: 'claim-001', text: 'O modelo cosmológico não coloca a expansão em torno de um centro espacial.', classification: 'established_result', narrationSegmentIds: ['line-001'], sourceIds: ['source-001']},
      {id: 'claim-002', text: 'A distância em grande escala entre galáxias aumenta com o tempo.', classification: 'established_result', narrationSegmentIds: ['line-002'], sourceIds: ['source-001']},
    ],
    visualNotes: [{id: 'visual-001', narrationSegmentIds: ['line-001'], text: 'Mostrar pontos em uma grade que se afastam; não desenhar explosão saindo de um centro.'}],
    soundPlan: {music: 'Textura discreta sem competir com a fala', effects: ['Pulso leve na entrada do diagrama']},
    storyboard: [
      {id: 'scene-001', purpose: 'Abrir a pergunta e desfazer a ideia de um centro espacial', narrationSegmentIds: ['line-001'], composition: {template: 'diagram', headline: 'Existe um centro?', supportingText: 'A expansão não aponta para um lugar central.'}, movement: {style: 'drift', description: 'Os pontos da grade se afastam juntos', anchor: 'line-001'}, transition: {type: 'fade', description: 'A grade surge por trás do título'}, sound: {cue: 'Pulso leve na entrada da grade'}, reviewCriterion: 'O movimento não sugere um centro privilegiado.'},
      {id: 'scene-002', purpose: 'Apresentar a observação de aumento das distâncias', narrationSegmentIds: ['line-002'], composition: {template: 'comparison', headline: 'Distâncias maiores', supportingText: 'A separação entre galáxias aumenta.'}, movement: {style: 'zoom', description: 'A grade amplia sem deslocar um ponto de origem', anchor: 'line-002'}, transition: {type: 'cut', description: 'Corte acompanha a nova afirmação'}, sound: {cue: 'Manter a trilha contínua'}, reviewCriterion: 'A imagem reforça a frase narrada sem acrescentar uma nova afirmação.'},
    ],
  };
}

function simpleBriefingFixture() {
  return {
    schemaVersion: 1, id: 'briefing-simple', title: 'Uma cena em movimento', purpose: 'channel', language: 'pt-BR',
    request: {subject: 'Fixture', audience: 'Test operator', objective: 'Exercise local production', coreMessage: 'This is test data.'},
    promotion: null,
    profile: {id: 'profile-simple', name: 'Fixture profile', typography: {heading: 'Arial Bold', body: 'Arial'}, colors: {background: '#f4f0e8', foreground: '#17202e', accent: '#245bcc'}, voicePreference: 'Imported audio', motionLanguage: 'Slow deterministic reveal'},
    direction: {hook: 'Fixture hook', tone: 'Neutral', visualApproach: 'One local graphic', callToAction: 'No publication'},
    narration: [{id: 'line-001', text: 'Test fixture tone, not speech'}], sources: [], claims: [], visualNotes: [],
    soundPlan: {music: 'No music in fixture', effects: []},
    storyboard: [{id: 'story-001', purpose: 'Exercise a deterministic frame', narrationSegmentIds: ['line-001'], composition: {template: 'typography', headline: 'Fixture scene', supportingText: 'Test-only content'}, movement: {style: 'rise', description: 'Rise from below', anchor: 'line-001'}, transition: {type: 'cut', description: 'Single-scene fixture'}, sound: {cue: 'Imported test tone only'}, reviewCriterion: 'Treat as protocol fixture, not creative approval.'}],
  };
}

function fixture(targetDuration?: string) {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-media-'));
  const run = join(root, 'run');
  json(cli(['init', run, '--title', 'Uma cena em movimento', '--license', 'free', ...(targetDuration ? ['--target-duration', targetDuration] : [])]));
  const briefing = join(root, 'briefing.json');
  writeFileSync(briefing, JSON.stringify(simpleBriefingFixture()));
  json(cli(['import-briefing', run, '--briefing', briefing]));
  const audio = join(root, 'voice.wav');
  const generated = spawnSync(ffmpeg!, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-ar', '48000', audio], {encoding: 'utf8'});
  assert.equal(generated.status, 0, generated.stderr);
  const alignment = join(root, 'alignment.json');
  writeFileSync(alignment, JSON.stringify({provenance: 'supplied', segments: [{id: 'line-001', text: 'Test fixture tone, not speech', start: 0, end: 1}]}));
  return {root, run, audio, alignment, briefing};
}
const importArgs = (f: ReturnType<typeof fixture>) => ['import-audio', f.run, '--audio', f.audio, '--alignment', f.alignment, '--origin', 'Locally generated test tone', '--audio-license', 'CC0'];

test('public invocation imports a structured briefing into the versioned run', () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-briefing-'));
  try {
    const run = join(root, 'run');
    json(cli(['init', run, '--title', 'O universo tem um centro?', '--license', 'free']));
    const input = join(root, 'briefing.json');
    writeFileSync(input, JSON.stringify(briefingFixture()));
    const imported = json(cli(['import-briefing', run, '--briefing', input]));
    assert.equal(imported.briefing.proposal.id, 'briefing-001');
    assert.match(imported.briefing.artifact.path, /^input\/briefing-[a-f0-9]{64}\.json$/);
    assert.equal(imported.briefing.proposal.storyboard[0].movement.style, 'drift');
    assert.equal(readFileSync(join(run, imported.briefing.artifact.path), 'utf8'), readFileSync(input, 'utf8'));
    assert.equal(json(cli(['status', run])).reviewDigests.briefing.length, 64);
  } finally {rmSync(root, {recursive: true, force: true});}
});

test('VB-05 fictional Nuvem promotion imports with a varied, typed storyboard', () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-vb05-'));
  try {
    const run = join(root, 'run');
    json(cli(['init', run, '--title', 'Nuvem: uma pausa leve', '--purpose', 'promotion', '--license', 'free']));
    const proposalPath = join(process.cwd(), '..', 'tests', 'video-brief', 'fixtures', 'vb-05-nuvem.json');
    const imported = json(cli(['import-briefing', run, '--briefing', proposalPath]));
    assert.equal(imported.briefing.proposal.promotion.mode, 'fictional');
    assert.match(imported.briefing.proposal.promotion.fictionalDisclosure, /fict/i);
    assert.equal(imported.briefing.proposal.profile.id, 'profile-playful');
    assert.deepEqual(imported.briefing.proposal.storyboard.map((scene: {composition: {template: string}}) => scene.composition.template), ['product', 'typography', 'closing']);
    assert.deepEqual(imported.briefing.proposal.storyboard.map((scene: {movement: {style: string}}) => scene.movement.style), ['rise', 'drift', 'pulse']);
  } finally {rmSync(root, {recursive: true, force: true});}
});

test('briefing import rejects stale or incomplete proposal records and preserves the current briefing', () => {
  const f = fixture();
  try {
    const before = json(cli(['status', f.run]));
    const proposal = simpleBriefingFixture() as any;
    proposal.sources = [{id: 'source-001', title: 'Missing consultation date', url: 'https://example.com/source', publisher: 'Example', consultedOn: 'not-a-date', sourceType: 'primary'}];
    proposal.claims = [{id: 'claim-001', text: 'A material factual claim', classification: 'established_result', narrationSegmentIds: ['line-001'], sourceIds: ['source-missing']}];
    const invalid = join(f.root, 'invalid.json'); writeFileSync(invalid, JSON.stringify(proposal));
    assert.notEqual(cli(['import-briefing', f.run, '--briefing', invalid]).status, 0);
    const after = json(cli(['status', f.run]));
    assert.equal(after.briefing.proposal.id, 'briefing-simple');
    assert.equal(after.briefing.artifact.sha256, before.briefing.artifact.sha256);
    assert.match(after.blocker, /consultedOn|source|date/i);
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

test('promotion briefing validates real offer details and requires explicit fictional-product disclosure', () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-promotion-'));
  try {
    const run = join(root, 'run');
    json(cli(['init', run, '--title', 'Lumo: organize sua rotina', '--purpose', 'promotion', '--language', 'en', '--license', 'free']));
    const proposal = briefingFixture() as any;
    proposal.id = 'promotion-real'; proposal.title = 'Lumo: organize sua rotina'; proposal.purpose = 'promotion'; proposal.language = 'en';
    proposal.request.subject = 'Lumo planner app'; proposal.request.coreMessage = 'The product helps organize tasks.';
    proposal.promotion = {mode: 'real', name: 'Lumo', offer: 'Annual planning subscription', targetAudience: 'Independent creators', cta: 'Start a trial', destination: 'https://example.com/lumo', price: 'R$ 120 per year', terms: '7-day trial; cancel any time', sourceIds: ['source-001']};
    const file = join(root, 'proposal.json'); writeFileSync(file, JSON.stringify(proposal));
    const imported = json(cli(['import-briefing', run, '--briefing', file]));
    assert.equal(imported.briefing.proposal.language, 'en');
    assert.equal(imported.briefing.proposal.promotion.mode, 'real');

    delete proposal.promotion.offer; writeFileSync(file, JSON.stringify(proposal));
    assert.notEqual(cli(['import-briefing', run, '--briefing', file]).status, 0);
    proposal.promotion = {mode: 'fictional', name: 'Lumo', fictionalDisclosure: 'Fictional demonstration product; no real offer exists.', offer: 'Illustrative planning concept', targetAudience: 'Independent creators', cta: 'Imagine your week'};
    proposal.claims = proposal.claims.map((claim: any) => ({...claim, classification: 'established_result'}));
    writeFileSync(file, JSON.stringify(proposal));
    assert.equal(json(cli(['import-briefing', run, '--briefing', file])).briefing.proposal.promotion.mode, 'fictional');
  } finally {rmSync(root, {recursive: true, force: true});}
});

test('data storyboard compositions require source-linked values', () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-data-scene-'));
  try {
    const run = join(root, 'run');
    json(cli(['init', run, '--title', 'O universo tem um centro?', '--license', 'free']));
    const proposal = briefingFixture() as any;
    proposal.storyboard[0].composition.template = 'data';
    proposal.storyboard[0].composition.data = [{id: 'point-001', label: 'Exemplo documentado', value: 12, unit: 'unidades', sourceIds: ['source-001']}];
    const file = join(root, 'proposal.json'); writeFileSync(file, JSON.stringify(proposal));
    assert.equal(json(cli(['import-briefing', run, '--briefing', file])).briefing.proposal.storyboard[0].composition.data[0].value, 12);
    proposal.storyboard[0].composition.data[0].sourceIds = ['source-missing']; writeFileSync(file, JSON.stringify(proposal));
    assert.notEqual(cli(['import-briefing', run, '--briefing', file]).status, 0);
    proposal.storyboard[0].composition.data = []; writeFileSync(file, JSON.stringify(proposal));
    assert.notEqual(cli(['import-briefing', run, '--briefing', file]).status, 0);
    proposal.storyboard[0].composition.template = 'diagram';
    proposal.storyboard[0].movement.style = 'teleport'; writeFileSync(file, JSON.stringify(proposal));
    assert.notEqual(cli(['import-briefing', run, '--briefing', file]).status, 0);
    proposal.storyboard[0].movement.style = 'drift';
    proposal.storyboard[0].movement.anchor = 'line-002'; writeFileSync(file, JSON.stringify(proposal));
    assert.notEqual(cli(['import-briefing', run, '--briefing', file]).status, 0);
  } finally {rmSync(root, {recursive: true, force: true});}
});

test('briefing approval becomes stale after the proposal changes and legacy runs remain readable', () => {
  const f = fixture();
  try {
    json(cli(importArgs(f)));
    approve(f.run, 'briefing'); approve(f.run, 'audio');
    const prior = json(cli(['status', f.run])).reviewDigests.briefing;
    const proposal = simpleBriefingFixture() as any; proposal.direction.tone = 'Changed direction';
    writeFileSync(f.briefing, JSON.stringify(proposal));
    json(cli(['import-briefing', f.run, '--briefing', f.briefing]));
    const current = json(cli(['status', f.run]));
    assert.notEqual(current.reviewDigests.briefing, prior);
    const blocked = cli(['preview', f.run]);
    assert.notEqual(blocked.status, 0);
    assert.match(blocked.stderr, /Human briefing review required/i);

    const legacy = join(f.root, 'legacy');
    json(cli(['init', legacy, '--title', 'Legacy run', '--license', 'free']));
    const manifest = JSON.parse(readFileSync(join(legacy, 'manifest.json'), 'utf8')); delete manifest.briefing;
    writeFileSync(join(legacy, 'manifest.json'), JSON.stringify(manifest));
    const loaded = json(cli(['status', legacy]));
    assert.equal(loaded.briefing, null);
    assert.notEqual(cli(['preview', legacy]).status, 0);
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

test('replacing narration clears incompatible imported audio and its derived artifacts', () => {
  const f = fixture('0.5');
  try {
    const importedAudio = json(cli(importArgs(f)));
    approve(f.run, 'audio');
    assert.ok(importedAudio.audio);
    assert.equal(importedAudio.durationAssessment.status, 'over_target');
    const proposal = simpleBriefingFixture() as any;
    proposal.narration[0].text = 'Revised clean narration for a new recording';
    writeFileSync(f.briefing, JSON.stringify(proposal));
    const result = cli(['import-briefing', f.run, '--briefing', f.briefing]);
    assert.equal(result.status, 0, result.stderr);
    const status = json(cli(['status', f.run]));
    assert.equal(status.briefing.proposal.narration[0].text, proposal.narration[0].text);
    assert.equal(status.audio, null);
    assert.equal(status.durationAssessment, null);
    assert.equal(status.artifacts.preview, null);
    assert.equal(status.artifacts.final, null);
    assert.equal(status.artifacts.report, null);
    assert.equal(status.status, 'awaiting_review');
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

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

test('audio import rejects alignment that rewrites clean narration and preserves a failed checkpoint', () => {
  const f = fixture();
  try {
    writeFileSync(f.alignment, JSON.stringify({provenance: 'supplied', segments: [{id: 'line-001', text: 'A different spoken script', start: 0, end: 1}]}));
    assert.notEqual(cli(importArgs(f)).status, 0);
    const status = json(cli(['status', f.run]));
    assert.equal(status.audio, null);
    assert.equal(status.status, 'failed');
    assert.ok(status.blocker);
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

test('public workflow renders an approved multi-scene briefing against imported audio', {timeout: 240_000}, () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-storyboard-'));
  try {
    const run = join(root, 'run');
    json(cli(['init', run, '--title', 'O universo tem um centro?', '--license', 'free']));
    const briefing = join(root, 'briefing.json'); writeFileSync(briefing, JSON.stringify(briefingFixture()));
    json(cli(['import-briefing', run, '--briefing', briefing]));
    const audio = join(root, 'voice.wav');
    const generated = spawnSync(ffmpeg!, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-ar', '48000', audio], {encoding: 'utf8'});
    assert.equal(generated.status, 0, generated.stderr);
    const alignment = join(root, 'alignment.json');
    writeFileSync(alignment, JSON.stringify({provenance: 'supplied', segments: [
      {id: 'line-001', text: briefingFixture().narration[0]!.text, start: 0, end: 0.4},
      {id: 'line-002', text: briefingFixture().narration[1]!.text, start: 0.4, end: 1},
    ]}));
    const args = ['import-audio', run, '--audio', audio, '--alignment', alignment, '--origin', 'Locally generated test tone', '--audio-license', 'CC0'];
    const imported = json(cli(args));
    assert.equal(imported.scene.endFrame, 30);
    approve(run, 'briefing'); approve(run, 'audio');
    json(cli(['preview', run]));
    approve(run, 'scene');
    const rendered = cli(['render', run]);
    if (rendered.status !== 0) {
      const failed = json(cli(['status', run]));
      const report = failed.artifacts.report ? JSON.parse(readFileSync(join(run, failed.artifacts.report.path), 'utf8')) : null;
      assert.fail(`Render failed: ${rendered.stderr}\nReport: ${JSON.stringify({status: failed.status, checks: report?.checks, measured: report?.measured}, null, 2)}`);
    }
    const result = JSON.parse(rendered.stdout);
    assert.equal(result.status, 'validated');
    json(cli(['frame', run, '--frame', '5', '--output', 'review/story-first.png']));
    json(cli(['frame', run, '--frame', '20', '--output', 'review/story-second.png']));
    const pixels = (relative: string) => spawnSync(ffmpeg!, ['-v', 'error', '-i', join(run, relative), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: 1080 * 1920 * 4}).stdout;
    assert.notDeepEqual(pixels('review/story-first.png'), pixels('review/story-second.png'));
    if (process.env.GRIMOIRE_VIDEO_REVIEW_DIR) {
      mkdirSync(process.env.GRIMOIRE_VIDEO_REVIEW_DIR, {recursive: true});
      copyFileSync(join(run, 'review/story-first.png'), join(process.env.GRIMOIRE_VIDEO_REVIEW_DIR, 'story-first.png'));
      copyFileSync(join(run, 'review/story-second.png'), join(process.env.GRIMOIRE_VIDEO_REVIEW_DIR, 'story-second.png'));
    }
  } finally {rmSync(root, {recursive: true, force: true});}
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
    const secondBriefing = join(f.root, 'font-briefing.json');
    const proposal = simpleBriefingFixture() as any; proposal.title = 'Font test';
    writeFileSync(secondBriefing, JSON.stringify(proposal));
    json(cli(['import-briefing', second, '--briefing', secondBriefing]));
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
    const outsideFilesBefore = readdirSync(outside);
    symlinkSync(outside, join(f.run, 'input'), 'junction');
    assert.notEqual(cli(importArgs(f)).status, 0);
    assert.notEqual(cli(['status', f.run]).status, 0);
    assert.deepEqual(readdirSync(outside), outsideFilesBefore);
    rmSync(join(f.run, 'input'));
    renameSync(outside, join(f.run, 'input'));
    assert.equal(json(cli(['status', f.run])).status, 'failed');
    json(cli(importArgs(f)));
    const outsideReview = join(f.root, 'outside-review');
    renameSync(join(f.run, 'review'), outsideReview);
    symlinkSync(outsideReview, join(f.run, 'review'), 'junction');
    const external = join(outsideReview, 'escaped.png');
    assert.notEqual(cli(['frame', f.run, '--frame', '0', '--output', 'review/escaped.png']).status, 0);
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

test('public production syncs captions to supplied speech timing and warns when measured speech exceeds its target', {timeout: 180_000}, () => {
  const root = mkdtempSync(join(tmpdir(), 'grimoire-captions-'));
  try {
    const run = join(root, 'run');
    json(cli(['init', run, '--title', 'Uma cena em movimento', '--license', 'free', '--target-duration', '0.5']));
    const briefing = join(root, 'briefing.json');
    const proposal = simpleBriefingFixture() as any;
    proposal.narration[0].text = 'A fala acompanha o movimento do céu.';
    proposal.storyboard[0].composition.headline = 'O céu em movimento';
    writeFileSync(briefing, JSON.stringify(proposal));
    json(cli(['import-briefing', run, '--briefing', briefing]));

    const audio = join(root, 'voice.wav');
    const generated = spawnSync(ffmpeg!, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-ar', '48000', audio], {encoding: 'utf8'});
    assert.equal(generated.status, 0, generated.stderr);
    const alignment = join(root, 'alignment.json');
    writeFileSync(alignment, JSON.stringify({provenance: 'supplied', segments: [
      {id: 'line-001', text: proposal.narration[0].text, start: 0.13, end: 0.62},
    ]}));
    const args = ['import-audio', run, '--audio', audio, '--alignment', alignment, '--origin', 'Generated local test media', '--audio-license', 'CC0'];
    const imported = json(cli(args));
    assert.equal(imported.audio.alignment.provenance, 'supplied');
    assert.ok(imported.audio.duration >= 1 && imported.audio.duration < 1.1);
    assert.match(imported.progress.at(-1).detail, /target|targeted|shorten|re-record/i);
    assert.match(imported.progress.at(-1).detail, /not accelerated|without speeding|not speed/i);
    assert.ok(imported.artifacts.captions);
    const captionsPath = join(run, imported.artifacts.captions.path);
    const captions = readFileSync(captionsPath, 'utf8');
    assert.match(captions, /00:00:00\.130 --> 00:00:00\.620/);
    assert.match(captions, /A fala acompanha o movimento do céu\./);

    json(cli(['frame', run, '--frame', '3', '--output', 'review/caption-active.png']));
    json(cli(['frame', run, '--frame', '19', '--output', 'review/caption-inactive.png']));
    const captionBand = (file: string) => spawnSync(ffmpeg!, ['-v', 'error', '-i', join(run, file), '-vf', 'crop=900:150:90:1750', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: 900 * 150 * 3}).stdout;
    assert.notDeepEqual(captionBand('review/caption-active.png'), captionBand('review/caption-inactive.png'), 'the active caption must be burned into its aligned frame interval');
  } finally {rmSync(root, {recursive: true, force: true});}
});

test('alignment and scene duration follow decoded audio when the video container is longer', () => {
  const f = fixture();
  try {
    const proposal = simpleBriefingFixture() as any; proposal.narration[0].text = 'Actual audio';
    writeFileSync(f.briefing, JSON.stringify(proposal));
    json(cli(['import-briefing', f.run, '--briefing', f.briefing]));
    const media = join(f.root, 'long-video.mp4');
    const generated = spawnSync(ffmpeg!, ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=64x64:r=30:d=5', '-i', f.audio, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'libx264', '-c:a', 'aac', media], {encoding: 'utf8'});
    assert.equal(generated.status, 0, generated.stderr);
    const args = importArgs({...f, audio: media});
    writeFileSync(f.alignment, JSON.stringify({provenance: 'supplied', segments: [{id: 'line-001', text: 'Actual audio', start: 3, end: 4}]}));
    assert.notEqual(cli(args).status, 0, 'Timing past decoded speech must not be accepted using video duration');
    const failed = json(cli(['status', f.run]));
    assert.equal(failed.status, 'failed');
    assert.equal(failed.audio, null);
    writeFileSync(f.alignment, JSON.stringify({provenance: 'supplied', segments: [{id: 'line-001', text: 'Actual audio', start: 0, end: 1}]}));
    const m = json(cli(args));
    assert.ok(m.audio.duration >= 1 && m.audio.duration < 1.1);
    assert.ok(m.scene.endFrame >= 30 && m.scene.endFrame <= 33);
    assert.deepEqual(readFileSync(join(f.run, m.audio.original.path)), readFileSync(media));
    const manifest = JSON.parse(readFileSync(join(f.run, 'manifest.json'), 'utf8'));
    manifest.audio.alignment.segments[0].end = 4;
    writeFileSync(join(f.run, 'manifest.json'), JSON.stringify(manifest));
    assert.notEqual(cli(['status', f.run]).status, 0, 'Loading must enforce the same timing bounds as import');
  } finally {rmSync(f.root, {recursive: true, force: true});}
});

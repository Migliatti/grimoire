import {mkdirSync, readFileSync, writeFileSync, renameSync, existsSync, lstatSync, openSync, closeSync, unlinkSync, copyFileSync, realpathSync} from 'node:fs';
import {resolve, join, dirname, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash, randomUUID} from 'node:crypto';
import {briefingProposalSchema, manifestSchema, validateBriefingAlignment, validateTiming, type Manifest, type Artifact, type BriefingProposal} from './contracts';
import type {NarrationProvider} from './voice-provider';

type Options = Record<string, string | undefined>;
export type RuntimeServices = {createNarrationProvider?: () => NarrationProvider};
const now = () => new Date().toISOString();
export const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function artifact(root: string, path: string, id: string): Artifact {
  return {id, path, sha256: createHash('sha256').update(readFileSync(safePath(root, path))).digest('hex')};
}
export function safePath(root: string, path: string): string {
  const full = resolve(root, path);
  if (!full.startsWith(resolve(root) + sep)) throw new Error('Reference escapes the run');
  let ancestor = full;
  while (true) {
    try {lstatSync(ancestor); break;}
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      ancestor = dirname(ancestor);
    }
  }
  const canonicalRoot = realpathSync(root);
  const canonicalAncestor = realpathSync(ancestor);
  if (canonicalAncestor !== canonicalRoot && !canonicalAncestor.startsWith(canonicalRoot + sep)) throw new Error('Symlink reference escapes the run');
  return full;
}
export function checkArtifacts(root: string, manifest: Manifest) {
  for (const record of [manifest.briefing?.artifact, manifest.audio?.original, manifest.audio?.working, manifest.scene.font, manifest.scene.image, manifest.artifacts.preview, manifest.artifacts.final, manifest.artifacts.report, manifest.artifacts.captions, manifest.artifacts.voicePreview?.artifact]) {
    if (record && artifact(root, record.path, record.id).sha256 !== record.sha256) throw new Error(`Artifact changed: ${record.id}`);
  }
}
export function reviewDigest(m: Manifest, target: string): string {
  if (target === 'briefing') return digest(m.briefing ? {proposal: m.briefing.proposal, artifact: m.briefing.artifact} : {title: m.title, language: m.language, purpose: m.purpose, scene: m.scene});
  if (target === 'audio') {if (!m.audio) throw new Error('Import audio first'); return digest(m.audio);}
  if (target === 'scene') {if (m.previewSourceHash !== digest(readFileSync(join(runtimeRoot, 'src', 'scene.tsx'), 'utf8'))) throw new Error('Scene source changed; new preview required'); if (!m.artifacts.preview) throw new Error('Render a scene preview first'); return digest({preview: m.artifacts.preview, source: m.previewSourceHash, scene: m.scene, audio: m.audio, format: m.format});}
  if (target === 'voice') {if (!m.artifacts.voicePreview) throw new Error('Generate and listen to a paid voice preview first'); return digest(m.artifacts.voicePreview);}
  throw new Error('Unknown review target');
}
export function requireReview(m: Manifest, target: 'briefing' | 'audio' | 'scene' | 'voice') {
  if (target === 'briefing' && !m.briefing) throw new Error('Import a reviewed briefing proposal first');
  if (target === 'voice' && !m.artifacts.voicePreview) throw new Error('Generate and listen to a paid voice preview first');
  const last = m.approvals.filter((a) => a.target === target).at(-1);
  if (last?.decision !== 'approved' || last.digest !== reviewDigest(m, target)) throw new Error(`Human ${target} review required for current content`);
}
function save(root: string, m: Manifest) {
  manifestSchema.parse(m);
  validateTiming(m);
  const temporary = safePath(root, `manifest-${randomUUID()}.tmp`);
  writeFileSync(temporary, JSON.stringify(m, null, 2) + '\n', {flag: 'wx'});
  renameSync(temporary, join(root, 'manifest.json'));
}
export function progress(root: string, m: Manifest, stage: string, status: Manifest['status'], detail = '') {
  m.status = status;
  m.progress.push({stage, status, detail, at: now()});
  save(root, m);
}
function load(root: string) {
  const m = manifestSchema.parse(JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8')));
  validateTiming(m);
  return m;
}
export async function execute(command: string, run: string, options: Options, services: RuntimeServices = {}) {
  const root = resolve(run);
  if (command === 'init') {
    // mkdir without recursive protects existing runs, even when they contain no manifest.
    mkdirSync(dirname(root), {recursive: true});
    mkdirSync(root);
    try {
      const title = options.title;
      const m = manifestSchema.parse({schemaVersion: 1, id: randomUUID(), revision: 1, title,
        language: options.language ?? 'pt-BR', purpose: options.purpose ?? 'channel', remotionLicense: options.license,
        durationTargetSeconds: options['target-duration'] === undefined ? null : Number(options['target-duration']), durationAssessment: null,
        briefing: null,
        format: {width: 1080, height: 1920, fps: 30},
        assetRights: options.font || options.image ? {origin: options['asset-origin'], license: options['asset-license'], attribution: options.attribution ?? ''} : null,
        scene: {id: 'scene-001', title, background: '#f4f0e8', accent: '#245bcc', font: null, image: null, startFrame: 0, endFrame: 30},
        audio: null, budgets: {narration: {paidEnabled: false, limit: 0, estimated: 0, actual: 0, uncertain: false, inFlight: false, pendingCharacters: 0}, visuals: {paidEnabled: false, limit: 0, actual: 0}},
        previewSourceHash: null, approvals: [], artifacts: {preview: null, final: null, report: null, captions: null, voicePreview: null}, status: 'pending', progress: [], blocker: null,
      });
      for (const dir of ['input', 'intermediate', 'preview', 'review', 'final', 'cached']) mkdirSync(join(root, dir));
      for (const key of ['font', 'image'] as const) {
        if (options[key]) {
          const path = `input/${key}${extname(options[key])}`;
          copyFileSync(options[key], safePath(root, path));
          m.scene[key] = artifact(root, path, key);
        }
      }
      progress(root, m, 'init', 'pending');
      return m;
    } catch (error) {
      writeFileSync(join(root, 'failure.json'), JSON.stringify({status: 'failed', error: String(error)}));
      throw error;
    }
  }
  let lock: number;
  try {lock = openSync(join(root, '.run.lock'), 'wx');}
  catch {throw new Error('Run unavailable or locked; inspect .run.lock and remove it only after its process exits');}
  let m: Manifest | undefined;
  try {
    writeFileSync(lock, String(process.pid));
    m = load(root);
    checkArtifacts(root, m);
    if (m.budgets.narration.inFlight) {
      m.budgets.narration.inFlight = false;
      m.budgets.narration.uncertain = true;
      m.blocker = 'A paid narration request was interrupted; reconcile the provider account before further narration.';
      progress(root, m, 'recover-narration-reservation', 'blocked', m.blocker);
    }
    if (command === 'status') return {...m, reviewDigests: Object.fromEntries(['briefing', ...(m.audio ? ['audio'] : []), ...(m.artifacts.preview ? ['scene'] : []), ...(m.artifacts.voicePreview ? ['voice'] : [])].map((t) => [t, reviewDigest(m!, t)]))};
    m.revision++;
    m.blocker = null;
    if (command === 'review') {
      const target = options.target;
      if (!['briefing', 'audio', 'scene', 'voice'].includes(target ?? '')) throw new Error('Choose briefing, audio, scene, or voice review');
      if (!options.reviewer?.trim() || !['approved', 'rejected'].includes(options.decision ?? '')) throw new Error('Review needs a named human reviewer and approved/rejected decision');
      const currentDigest = reviewDigest(m, target!);
      if (options.digest !== currentDigest) throw new Error('Review digest missing or obsolete; inspect current status');
      m.approvals.push({target: target as 'briefing' | 'audio' | 'scene' | 'voice', decision: options.decision as 'approved' | 'rejected', reviewer: options.reviewer, digest: currentDigest, notes: options.notes ?? '', at: now()});
      progress(root, m, 'review', options.decision === 'approved' ? 'approved' : 'awaiting_review');
    } else {
      const {importAudio, render, validate, frame, measureAudio} = await import('./media');
      if (command === 'import-briefing') importBriefing(root, m, options);
      else if (command === 'import-audio') await importAudio(root, m, options);
      else if (command === 'preview' || command === 'render') await render(root, m, command);
      else if (command === 'validate') await validate(root, m);
      else if (command === 'frame') await frame(root, m, options);
      else if (command === 'authorize-narration') authorizeNarration(root, m, options);
      else if (command === 'reconcile-narration') reconcileNarration(root, m, options);
      else if (command === 'voice-preview' || command === 'synthesize-narration') {
        if (!m.briefing) throw new Error('Import a briefing before generating narration');
        requireReview(m, 'briefing');
        const text = command === 'voice-preview'
          ? m.briefing.proposal.narration.find((segment) => segment.id === options.segment)?.text
          : m.briefing.proposal.narration.map((segment) => segment.text).join('\n\n');
        if (!text) throw new Error(command === 'voice-preview' ? 'Voice preview requires a valid --segment narration ID' : 'Briefing narration is empty');
        const usage = [...text].length;
        const budget = m.budgets.narration;
        if (!budget.paidEnabled || !Number.isInteger(budget.limit) || budget.limit <= 0) throw new Error('Paid narration is not authorized; use authorize-narration with --confirm-paid yes and a numeric --limit');
        if (budget.uncertain) throw new Error('Prior narration charge outcome is uncertain; reconcile the provider account before another paid request');
        if (budget.estimated + usage > budget.limit) throw new Error(`Narration character estimate ${budget.estimated + usage} exceeds the authorized limit ${budget.limit}`);
        if (command === 'synthesize-narration') requireReview(m, 'voice');
        if (!options.voice || !options.model) throw new Error('Choose an ElevenLabs --voice and --model after verifying their capabilities');
        if (command === 'synthesize-narration' && (m.artifacts.voicePreview?.voiceId !== options.voice || m.artifacts.voicePreview?.modelId !== options.model)) throw new Error('Synthesis voice and model must match the human-approved voice preview');
        if (command === 'synthesize-narration' && !options['audio-license']?.trim()) throw new Error('Narration synthesis requires an explicit --audio-license record');
        const settingValues = {stability: options.stability, similarity_boost: options['similarity-boost'], style: options.style};
        const voiceSettings = Object.fromEntries(Object.entries(settingValues).filter(([, value]) => value !== undefined).map(([key, value]) => [key, Number(value)])) as {stability?: number; similarity_boost?: number; style?: number; use_speaker_boost?: boolean};
        if (Object.values(voiceSettings).some((value) => typeof value === 'number' && (!Number.isFinite(value) || value < 0 || value > 1))) throw new Error('Voice settings stability, similarity-boost and style must be numbers between 0 and 1');
        if (options['speaker-boost'] !== undefined && !['true', 'false'].includes(options['speaker-boost'])) throw new Error('--speaker-boost must be true or false');
        if (options['speaker-boost'] !== undefined) voiceSettings.use_speaker_boost = options['speaker-boost'] === 'true';
        const {ElevenLabsProvider, characterAlignment} = await import('./voice-provider');
        const provider = services.createNarrationProvider?.() ?? new ElevenLabsProvider(process.env.ELEVENLABS_API_KEY ?? '');
        let reservationMade = false;
        let result;
        try {
          result = await provider.synthesize({voiceId: options.voice, modelId: options.model, language: m.language, text, voiceSettings, pronunciationDictionaryIds: options['pronunciation-dictionary'] ? options['pronunciation-dictionary'].split(',').filter(Boolean) : undefined}, async () => {
            if (reservationMade) throw new Error('Narration provider attempted more than one paid request for this reservation');
            reservationMade = true;
            budget.estimated += usage;
            budget.inFlight = true;
            budget.pendingCharacters = usage;
            progress(root, m!, 'reserve-narration', 'running', `Reserved ${usage} provider request characters before sending the paid synthesis request.`);
          });
        } catch (error) {
          if (reservationMade) {budget.inFlight = false; budget.uncertain = true;}
          throw error;
        }
        if (!reservationMade) throw new Error('Narration provider returned without persisting a paid request reservation');
        budget.inFlight = false;
        budget.pendingCharacters = 0;
        budget.uncertain = false;
        budget.actual += usage;
        const alignment = characterAlignment(command === 'voice-preview' ? [m.briefing.proposal.narration.find((segment) => segment.id === options.segment)!] : m.briefing.proposal.narration, result.alignment);
        const audioPath = safePath(root, `intermediate/elevenlabs-${randomUUID()}.mp3`);
        let alignmentPath: string | undefined;
        writeFileSync(audioPath, Buffer.from(result.audioBase64, 'base64'), {flag: 'wx'});
        const duration = measureAudio(audioPath);
        if (command === 'voice-preview') {
          const path = `review/voice-preview-r${m.revision}.mp3`;
          copyFileSync(audioPath, safePath(root, path));
          m.artifacts.voicePreview = {artifact: artifact(root, path, 'voice-preview'), provider: 'elevenlabs', modelId: result.modelId, voiceId: result.voiceId, language: m.language, duration, alignment, licenseConditions: result.licenseConditions, commercialUse: 'unverified'};
          progress(root, m, command, 'awaiting_review', `Provider audio preview saved; measured ${duration.toFixed(2)} seconds. Character estimate and actual provider request usage are recorded. Review voice, provider terms and commercial eligibility.`);
        } else {
          alignmentPath = safePath(root, `intermediate/elevenlabs-alignment-${randomUUID()}.json`);
          writeFileSync(alignmentPath, JSON.stringify(alignment), {flag: 'wx'});
          await importAudio(root, m, {audio: audioPath, alignment: alignmentPath, origin: `ElevenLabs voice ${result.voiceId}`, 'audio-license': options['audio-license'], attribution: options.attribution ?? ''});
          m.audio!.synthesis = {provider: 'elevenlabs', modelId: result.modelId, voiceId: result.voiceId, language: m.language, licenseConditions: result.licenseConditions, commercialUse: 'unverified'};
          progress(root, m, command, 'awaiting_review', `Provider narration preserved as original plus working audio; measured ${m.audio!.duration.toFixed(2)} seconds and mapped character timing to captions. Review voice, alignment, provider terms and commercial eligibility.`);
        }
        unlinkSync(audioPath);
        if (alignmentPath) unlinkSync(alignmentPath);
      }
      else throw new Error(`Unknown command: ${command}`);
    }
    return m;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (m) {m.blocker = message; progress(root, m, command, /required|ENOENT|unavailable|missing|not found/i.test(message) ? 'blocked' : 'failed', message);}
    else writeFileSync(join(root, 'failure.json'), JSON.stringify({status: 'failed', error: message}));
    throw error;
  } finally {closeSync(lock); unlinkSync(join(root, '.run.lock'));}
}

function importBriefing(root: string, manifest: Manifest, options: Options) {
  if (!options.briefing) throw new Error('Briefing JSON path is required');
  const raw = readFileSync(options.briefing);
  const proposal = briefingProposalSchema.parse(JSON.parse(raw.toString('utf8'))) as BriefingProposal;
  if (proposal.purpose !== manifest.purpose || proposal.language !== manifest.language) {
    throw new Error('Briefing purpose and language must match the production run');
  }
  const hash = createHash('sha256').update(raw).digest('hex');
  const path = `input/briefing-${hash}.json`;
  const destination = safePath(root, path);
  if (existsSync(destination)) {
    if (createHash('sha256').update(readFileSync(destination)).digest('hex') !== hash) throw new Error('Existing briefing artifact does not match its content hash');
  } else writeFileSync(destination, raw, {flag: 'wx'});
  let importedAudioStillMatches = true;
  if (manifest.audio) {
    try {validateBriefingAlignment(manifest.audio.alignment, proposal);}
    catch {importedAudioStillMatches = false;}
  }
  manifest.briefing = {proposal, artifact: artifact(root, path, `briefing-${hash.slice(0, 16)}`)};
  if (!importedAudioStillMatches) {
    manifest.audio = null;
    manifest.durationAssessment = null;
  }
  manifest.artifacts = {preview: null, final: null, report: null, captions: null, voicePreview: null};
  manifest.previewSourceHash = null;
  progress(root, manifest, 'import-briefing', 'awaiting_review', 'Structured briefing imported; script and direction review required');
}
function authorizeNarration(root: string, manifest: Manifest, options: Options) {
  const limit = Number(options.limit);
  if (options['confirm-paid'] !== 'yes') throw new Error('Explicit paid authorization requires --confirm-paid yes');
  if (manifest.budgets.narration.uncertain) throw new Error('Reconcile the uncertain narration request before changing paid authorization');
  if (!Number.isSafeInteger(limit) || limit <= 0) throw new Error('Paid narration authorization requires a positive integer --limit in characters');
  if (limit < manifest.budgets.narration.estimated) throw new Error('New narration limit cannot be below already reserved estimated characters');
  manifest.budgets.narration.paidEnabled = true;
  manifest.budgets.narration.limit = limit;
  progress(root, manifest, 'authorize-narration', 'pending', `Paid narration explicitly authorized up to ${limit} provider request characters; visual budget remains separate.`);
}
function reconcileNarration(root: string, manifest: Manifest, options: Options) {
  const budget = manifest.budgets.narration;
  if (options['confirm-reconciled'] !== 'yes') throw new Error('Reconciliation requires --confirm-reconciled yes after checking the provider account');
  if (!budget.uncertain || budget.pendingCharacters <= 0) throw new Error('No uncertain narration request is waiting for reconciliation');
  if (!['charged', 'not-charged'].includes(options.outcome ?? '')) throw new Error('Reconcile with --outcome charged or not-charged');
  if (options.outcome === 'charged') budget.actual += budget.pendingCharacters;
  else budget.estimated -= budget.pendingCharacters;
  budget.pendingCharacters = 0;
  budget.uncertain = false;
  budget.inFlight = false;
  progress(root, manifest, 'reconcile-narration', 'pending', `Operator reconciled the uncertain provider request as ${options.outcome}; review the account record before another paid request.`);
}
export const runtimeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

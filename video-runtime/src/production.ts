import {mkdirSync, readFileSync, writeFileSync, renameSync, existsSync, lstatSync, openSync, closeSync, unlinkSync, copyFileSync, realpathSync} from 'node:fs';
import {resolve, join, dirname, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash, randomUUID} from 'node:crypto';
import {manifestSchema, validateTiming, type Manifest, type Artifact} from './contracts';

type Options = Record<string, string | undefined>;
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
  for (const record of [manifest.audio?.original, manifest.audio?.working, manifest.scene.font, manifest.scene.image, ...Object.values(manifest.artifacts)]) {
    if (record && artifact(root, record.path, record.id).sha256 !== record.sha256) throw new Error(`Artifact changed: ${record.id}`);
  }
}
export function reviewDigest(m: Manifest, target: string): string {
  if (target === 'briefing') return digest({title: m.title, language: m.language, purpose: m.purpose, scene: m.scene});
  if (target === 'audio') {if (!m.audio) throw new Error('Import audio first'); return digest(m.audio);}
  if (target === 'scene') {if (m.previewSourceHash !== digest(readFileSync(join(runtimeRoot, 'src', 'scene.tsx'), 'utf8'))) throw new Error('Scene source changed; new preview required'); if (!m.artifacts.preview) throw new Error('Render a scene preview first'); return digest({preview: m.artifacts.preview, source: m.previewSourceHash, scene: m.scene, audio: m.audio, format: m.format});}
  throw new Error('Unknown review target');
}
export function requireReview(m: Manifest, target: 'briefing' | 'audio' | 'scene') {
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
export async function execute(command: string, run: string, options: Options) {
  const root = resolve(run);
  if (command === 'init') {
    // mkdir without recursive protects existing runs, even when they contain no manifest.
    mkdirSync(dirname(root), {recursive: true});
    mkdirSync(root);
    try {
      const title = options.title;
      const m = manifestSchema.parse({schemaVersion: 1, id: randomUUID(), revision: 1, title,
        language: options.language ?? 'pt-BR', purpose: options.purpose ?? 'channel', remotionLicense: options.license,
        format: {width: 1080, height: 1920, fps: 30},
        assetRights: options.font || options.image ? {origin: options['asset-origin'], license: options['asset-license'], attribution: options.attribution ?? ''} : null,
        scene: {id: 'scene-001', title, background: '#f4f0e8', accent: '#245bcc', font: null, image: null, startFrame: 0, endFrame: 30},
        audio: null, budgets: {narration: {paidEnabled: false, limit: 0, actual: 0}, visuals: {paidEnabled: false, limit: 0, actual: 0}},
        previewSourceHash: null, approvals: [], artifacts: {preview: null, final: null, report: null}, status: 'pending', progress: [], blocker: null,
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
    if (command === 'status') return {...m, reviewDigests: Object.fromEntries(['briefing', ...(m.audio ? ['audio'] : []), ...(m.artifacts.preview ? ['scene'] : [])].map((t) => [t, reviewDigest(m!, t)]))};
    m.revision++;
    m.blocker = null;
    if (command === 'review') {
      const target = options.target;
      if (!['briefing', 'audio', 'scene'].includes(target ?? '')) throw new Error('Choose briefing, audio, or scene review');
      if (!options.reviewer?.trim() || !['approved', 'rejected'].includes(options.decision ?? '')) throw new Error('Review needs a named human reviewer and approved/rejected decision');
      const currentDigest = reviewDigest(m, target!);
      if (options.digest !== currentDigest) throw new Error('Review digest missing or obsolete; inspect current status');
      m.approvals.push({target: target as 'briefing' | 'audio' | 'scene', decision: options.decision as 'approved' | 'rejected', reviewer: options.reviewer, digest: currentDigest, notes: options.notes ?? '', at: now()});
      progress(root, m, 'review', options.decision === 'approved' ? 'approved' : 'awaiting_review');
    } else {
      const {importAudio, render, validate, frame} = await import('./media');
      if (command === 'import-audio') await importAudio(root, m, options);
      else if (command === 'preview' || command === 'render') await render(root, m, command);
      else if (command === 'validate') await validate(root, m);
      else if (command === 'frame') await frame(root, m, options);
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
export const runtimeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

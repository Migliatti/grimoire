import {z} from 'zod';

const id = z.string().regex(/^[a-zA-Z0-9_-]+$/);
export const relativePath = z.string().min(1).refine((p) => !p.startsWith('/') && !p.includes('\\') && !p.split('/').some((s) => s === '..' || s === '.' || !s) && !p.includes(':'), 'Artifact references must be relative paths inside the run');
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const artifact = z.object({id, path: relativePath, sha256: hash}).strict();
export const alignmentSchema = z.object({
  provenance: z.literal('supplied'),
  segments: z.array(z.object({id, text: z.string().trim().min(1), start: z.number().nonnegative(), end: z.number().positive()}).strict()).min(1),
}).strict();
export const rightsSchema = z.object({origin: z.string().trim().min(1), license: z.string().trim().min(1), attribution: z.string()}).strict();
export const manifestSchema = z.object({
  schemaVersion: z.literal(1), id, revision: z.number().int().positive(),
  title: z.string().trim().min(1).max(80), language: z.enum(['pt-BR', 'en']),
  purpose: z.enum(['channel', 'promotion']),
  format: z.object({width: z.literal(1080), height: z.literal(1920), fps: z.literal(30)}).strict(),
  remotionLicense: z.enum(['free', 'company']),
  assetRights: rightsSchema.nullable(),
  scene: z.object({id, title: z.string().trim().min(1).max(80), background: z.string().regex(/^#[0-9a-fA-F]{6}$/), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/), font: artifact.nullable(), image: artifact.nullable(), startFrame: z.literal(0), endFrame: z.number().int().positive()}).strict(),
  audio: z.object({id, original: artifact, working: artifact, duration: z.number().positive(), alignment: alignmentSchema, rights: rightsSchema}).strict().nullable(),
  budgets: z.object({narration: z.object({paidEnabled: z.literal(false), limit: z.literal(0), actual: z.literal(0)}).strict(), visuals: z.object({paidEnabled: z.literal(false), limit: z.literal(0), actual: z.literal(0)}).strict()}).strict(),
  previewSourceHash: hash.nullable(),
  approvals: z.array(z.object({target: z.enum(['briefing', 'audio', 'scene']), digest: hash, decision: z.enum(['approved', 'rejected']), reviewer: z.string().trim().min(1), notes: z.string(), at: z.string().datetime()}).strict()),
  artifacts: z.object({preview: artifact.nullable(), final: artifact.nullable(), report: artifact.nullable()}).strict(),
  status: z.enum(['pending', 'running', 'awaiting_review', 'approved', 'failed', 'blocked', 'validated']),
  progress: z.array(z.object({stage: z.string(), status: z.string(), at: z.string().datetime(), detail: z.string()}).strict()),
  blocker: z.string().nullable(),
}).strict();
export type Manifest = z.infer<typeof manifestSchema>;
export type Artifact = z.infer<typeof artifact>;
export type ReviewTarget = Manifest['approvals'][number]['target'];

export function validateAlignment(alignment: z.infer<typeof alignmentSchema>, duration: number, reservedIds: string[]) {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid measured audio duration');
  let end = 0;
  const ids = new Set(reservedIds);
  if (ids.size !== reservedIds.length) throw new Error('Duplicate record IDs');
  for (const segment of alignment.segments) {
    if (ids.has(segment.id)) throw new Error('Duplicate record IDs');
    ids.add(segment.id);
    if (segment.start < end || segment.end <= segment.start || segment.end > duration) throw new Error('Supplied timing is non-monotonic or outside measured audio');
    end = segment.end;
  }
}

export function validateTiming(m: Manifest) {
  if (!m.audio) return;
  validateAlignment(m.audio.alignment, m.audio.duration, [m.scene.id, m.audio.id]);
  if (m.scene.endFrame !== Math.ceil(m.audio.duration * m.format.fps)) throw new Error('Scene interval does not cover measured audio');
  if ((m.scene.font || m.scene.image) && !m.assetRights) throw new Error('Required asset rights missing');
}

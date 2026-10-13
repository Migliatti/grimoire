import {z} from 'zod';

const id = z.string().regex(/^[a-zA-Z0-9_-]+$/);
export const relativePath = z.string().min(1).refine((p) => !p.startsWith('/') && !p.includes('\\') && !p.split('/').some((s) => s === '..' || s === '.' || !s) && !p.includes(':'), 'Artifact references must be relative paths inside the run');
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const artifact = z.object({id, path: relativePath, sha256: hash}).strict();
export const alignmentSchema = z.object({
  provenance: z.enum(['supplied', 'elevenlabs-character-timings']),
  segments: z.array(z.object({id, text: z.string().trim().min(1), start: z.number().nonnegative(), end: z.number().positive()}).strict()).min(1),
}).strict();
export const rightsSchema = z.object({origin: z.string().trim().min(1), license: z.string().trim().min(1), attribution: z.string()}).strict();
const briefingId = z.string().regex(/^[a-zA-Z0-9_-]+$/);
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const narrationSegment = z.object({id: briefingId, text: z.string().trim().min(1)}).strict();
const source = z.object({
  id: briefingId, title: z.string().trim().min(1), url: z.string().url(), publisher: z.string().trim().min(1),
  consultedOn: z.iso.date(), sourceType: z.enum(['primary', 'secondary', 'product_material']),
}).strict();
const claim = z.object({
  id: briefingId, text: z.string().trim().min(1),
  classification: z.enum(['established_result', 'supported_fact', 'hypothesis', 'analogy', 'fictional_claim']),
  narrationSegmentIds: z.array(briefingId).min(1), sourceIds: z.array(briefingId),
}).strict();
const productPromotion = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('real'), name: z.string().trim().min(1), offer: z.string().trim().min(1),
    targetAudience: z.string().trim().min(1), cta: z.string().trim().min(1),
    destination: z.string().trim().min(1).nullable(), price: z.string().trim().min(1).nullable(),
    terms: z.string().trim().min(1).nullable(), sourceIds: z.array(briefingId),
  }).strict(),
  z.object({
    mode: z.literal('fictional'), name: z.string().trim().min(1),
    fictionalDisclosure: z.string().trim().min(1).refine((value) => /fiction|fict[ií]ci/i.test(value), 'Disclosure must explicitly say the product is fictional'),
    offer: z.string().trim().min(1), targetAudience: z.string().trim().min(1), cta: z.string().trim().min(1),
  }).strict(),
]);
const storyboardScene = z.object({
  id: briefingId, purpose: z.string().trim().min(1), narrationSegmentIds: z.array(briefingId).min(1),
  composition: z.object({
    template: z.enum(['typography', 'comparison', 'diagram', 'data', 'product', 'closing']),
    headline: z.string().trim().min(1), supportingText: z.string().trim().min(1).nullable(),
    data: z.array(z.object({id: briefingId, label: z.string().trim().min(1), value: z.number().finite().nonnegative(), unit: z.string().trim().min(1), sourceIds: z.array(briefingId).min(1)}).strict()).default([]),
  }).strict(),
  movement: z.object({style: z.enum(['hold', 'drift', 'zoom', 'orbit', 'pulse', 'rise']), description: z.string().trim().min(1), anchor: z.string().trim().min(1)}).strict(),
  transition: z.object({type: z.enum(['cut', 'fade', 'slide']), description: z.string().trim().min(1)}).strict(),
  sound: z.object({cue: z.string().trim().min(1)}).strict(), reviewCriterion: z.string().trim().min(1),
}).strict();
export const briefingProposalSchema = z.object({
  schemaVersion: z.literal(1), id: briefingId, title: z.string().trim().min(1).max(100),
  purpose: z.enum(['channel', 'promotion']), language: z.enum(['pt-BR', 'en']),
  request: z.object({subject: z.string().trim().min(1), audience: z.string().trim().min(1), objective: z.string().trim().min(1), coreMessage: z.string().trim().min(1)}).strict(),
  promotion: productPromotion.nullable(),
  profile: z.object({
    id: briefingId, name: z.string().trim().min(1),
    typography: z.object({heading: z.string().trim().min(1), body: z.string().trim().min(1)}).strict(),
    colors: z.object({background: color, foreground: color, accent: color}).strict(),
    voicePreference: z.string().trim().min(1), motionLanguage: z.string().trim().min(1),
  }).strict(),
  direction: z.object({hook: z.string().trim().min(1), tone: z.string().trim().min(1), visualApproach: z.string().trim().min(1), callToAction: z.string().trim().min(1)}).strict(),
  narration: z.array(narrationSegment).min(1), sources: z.array(source), claims: z.array(claim),
  visualNotes: z.array(z.object({id: briefingId, narrationSegmentIds: z.array(briefingId).min(1), text: z.string().trim().min(1)}).strict()),
  soundPlan: z.object({music: z.string().trim().min(1), effects: z.array(z.string().trim().min(1))}).strict(),
  storyboard: z.array(storyboardScene).min(1),
}).strict().superRefine((proposal, ctx) => {
  if ((proposal.purpose === 'channel') !== (proposal.promotion === null)) {
    ctx.addIssue({code: 'custom', path: ['promotion'], message: 'Channel proposals have no promotion record; promotion proposals require one'});
  }
  const records = [proposal.profile, ...proposal.narration, ...proposal.sources, ...proposal.claims, ...proposal.visualNotes, ...proposal.storyboard, ...proposal.storyboard.flatMap((scene) => scene.composition.data)];
  const ids = new Set<string>();
  for (const record of records) {
    if (ids.has(record.id)) ctx.addIssue({code: 'custom', path: ['id'], message: `Duplicate proposal ID: ${record.id}`});
    ids.add(record.id);
  }
  const narrationIds = new Set(proposal.narration.map((item) => item.id));
  const sourceIds = new Set(proposal.sources.map((item) => item.id));
  const narrationIndex = new Map(proposal.narration.map((item, index) => [item.id, index]));
  for (const [index, item] of proposal.claims.entries()) {
    if (item.classification !== 'analogy' && item.classification !== 'fictional_claim' && item.sourceIds.length === 0) {
      ctx.addIssue({code: 'custom', path: ['claims', index, 'sourceIds'], message: 'Evidence-based claims and hypotheses require at least one source'});
    }
    for (const id of item.sourceIds) if (!sourceIds.has(id)) ctx.addIssue({code: 'custom', path: ['claims', index, 'sourceIds'], message: `Unknown source ID: ${id}`});
    for (const id of item.narrationSegmentIds) if (!narrationIds.has(id)) ctx.addIssue({code: 'custom', path: ['claims', index, 'narrationSegmentIds'], message: `Unknown narration ID: ${id}`});
    if (item.classification === 'fictional_claim' && proposal.promotion?.mode !== 'fictional') {
      ctx.addIssue({code: 'custom', path: ['claims', index, 'classification'], message: 'Fictional product claims require an explicitly fictional promotion'});
    }
  }
  for (const id of proposal.promotion?.mode === 'real' ? proposal.promotion.sourceIds : []) {
    if (!sourceIds.has(id)) ctx.addIssue({code: 'custom', path: ['promotion', 'sourceIds'], message: `Unknown product source ID: ${id}`});
  }
  const referencedNarration = new Set<string>();
  for (const [index, scene] of proposal.storyboard.entries()) {
    if (scene.composition.template === 'data' && scene.composition.data.length === 0) {
      ctx.addIssue({code: 'custom', path: ['storyboard', index, 'composition', 'data'], message: 'Data scenes require source-linked data points'});
    }
    for (const [pointIndex, point] of scene.composition.data.entries()) for (const id of point.sourceIds) {
      if (!sourceIds.has(id)) ctx.addIssue({code: 'custom', path: ['storyboard', index, 'composition', 'data', pointIndex, 'sourceIds'], message: `Unknown data source ID: ${id}`});
    }
    for (const id of scene.narrationSegmentIds) {
      if (!narrationIds.has(id)) ctx.addIssue({code: 'custom', path: ['storyboard', index, 'narrationSegmentIds'], message: `Unknown narration ID: ${id}`});
      if (referencedNarration.has(id)) ctx.addIssue({code: 'custom', path: ['storyboard', index, 'narrationSegmentIds'], message: `Narration ID appears in more than one scene: ${id}`});
      referencedNarration.add(id);
    }
    if (!scene.narrationSegmentIds.includes(scene.movement.anchor)) {
      ctx.addIssue({code: 'custom', path: ['storyboard', index, 'movement', 'anchor'], message: 'Movement must anchor to one of this scene’s narration IDs'});
    }
    if (scene.narrationSegmentIds.some((id, segmentIndex) => segmentIndex > 0 && narrationIndex.get(id)! <= narrationIndex.get(scene.narrationSegmentIds[segmentIndex - 1]!)!)) {
      ctx.addIssue({code: 'custom', path: ['storyboard', index, 'narrationSegmentIds'], message: 'Narration IDs inside a scene must follow script order'});
    }
    if (index > 0 && narrationIndex.get(scene.narrationSegmentIds[0]!)! <= narrationIndex.get(proposal.storyboard[index - 1]!.narrationSegmentIds.at(-1)!)!) {
      ctx.addIssue({code: 'custom', path: ['storyboard', index, 'narrationSegmentIds'], message: 'Storyboard scenes must follow narration order'});
    }
  }
  for (const item of proposal.narration) if (!referencedNarration.has(item.id)) {
    ctx.addIssue({code: 'custom', path: ['storyboard'], message: `Narration segment is not assigned to a scene: ${item.id}`});
  }
  for (const [index, note] of proposal.visualNotes.entries()) for (const id of note.narrationSegmentIds) {
    if (!narrationIds.has(id)) ctx.addIssue({code: 'custom', path: ['visualNotes', index, 'narrationSegmentIds'], message: `Unknown narration ID: ${id}`});
  }
});
export type BriefingProposal = z.infer<typeof briefingProposalSchema>;
export function validateBriefingAlignment(alignment: z.infer<typeof alignmentSchema>, proposal: BriefingProposal) {
  const narration = proposal.narration;
  const normalizeSpokenText = (text: string) => text.normalize('NFC').trim().replace(/\s+/gu, ' ');
  if (alignment.segments.length !== narration.length || alignment.segments.some((segment, index) => segment.id !== narration[index]?.id || normalizeSpokenText(segment.text) !== normalizeSpokenText(narration[index]?.text ?? ''))) {
    throw new Error('Supplied alignment IDs and text must match clean narration in script order');
  }
}
export const briefingRecordSchema = z.object({proposal: briefingProposalSchema, artifact: z.object({id, path: relativePath, sha256: hash}).strict()}).strict();
export const manifestSchema = z.object({
  schemaVersion: z.literal(1), id, revision: z.number().int().positive(),
  title: z.string().trim().min(1).max(80), language: z.enum(['pt-BR', 'en']),
  purpose: z.enum(['channel', 'promotion']),
  durationTargetSeconds: z.number().positive().nullable().default(null),
  durationAssessment: z.object({targetSeconds: z.number().positive(), measuredSeconds: z.number().positive(), status: z.enum(['within_target', 'over_target']), recommendation: z.string().nullable()}).strict().nullable().default(null),
  briefing: briefingRecordSchema.nullable().default(null),
  format: z.object({width: z.literal(1080), height: z.literal(1920), fps: z.literal(30)}).strict(),
  remotionLicense: z.enum(['free', 'company']),
  assetRights: rightsSchema.nullable(),
  scene: z.object({id, title: z.string().trim().min(1).max(80), background: z.string().regex(/^#[0-9a-fA-F]{6}$/), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/), font: artifact.nullable(), image: artifact.nullable(), startFrame: z.literal(0), endFrame: z.number().int().positive()}).strict(),
  audio: z.object({id, original: artifact, working: artifact, duration: z.number().positive(), alignment: alignmentSchema, rights: rightsSchema, synthesis: z.object({provider: z.literal('elevenlabs'), modelId: z.string().min(1), voiceId: z.string().min(1), language: z.enum(['pt-BR', 'en']), licenseConditions: z.string().min(1), commercialUse: z.literal('unverified')}).strict().nullable().default(null)}).strict().nullable(),
  budgets: z.object({
    narration: z.object({paidEnabled: z.boolean(), limit: z.number().int().nonnegative(), estimated: z.number().int().nonnegative().default(0), actual: z.number().int().nonnegative(), uncertain: z.boolean().default(false), inFlight: z.boolean().default(false), pendingCharacters: z.number().int().nonnegative().default(0)}).strict().superRefine((budget, ctx) => {
      if (budget.actual > budget.estimated || budget.pendingCharacters > budget.estimated || budget.estimated > budget.limit) ctx.addIssue({code: 'custom', message: 'Narration usage must stay within its reserved character limit'});
      if ((budget.pendingCharacters > 0) !== (budget.inFlight || budget.uncertain)) ctx.addIssue({code: 'custom', message: 'An in-flight or uncertain narration request must have a persisted character reservation'});
    }),
    visuals: z.object({paidEnabled: z.literal(false), limit: z.literal(0), actual: z.literal(0)}).strict(),
  }).strict(),
  previewSourceHash: hash.nullable(),
  approvals: z.array(z.object({target: z.enum(['briefing', 'audio', 'scene', 'voice']), digest: hash, decision: z.enum(['approved', 'rejected']), reviewer: z.string().trim().min(1), notes: z.string(), at: z.string().datetime()}).strict()),
  artifacts: z.object({preview: artifact.nullable(), final: artifact.nullable(), report: artifact.nullable(), captions: artifact.nullable().default(null), voicePreview: z.object({artifact, provider: z.literal('elevenlabs'), modelId: z.string(), voiceId: z.string(), language: z.enum(['pt-BR', 'en']), duration: z.number().positive(), alignment: alignmentSchema, licenseConditions: z.string(), commercialUse: z.literal('unverified')}).strict().nullable().default(null)}).strict(),
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
  if (m.briefing) {
    validateBriefingAlignment(m.audio.alignment, m.briefing.proposal);
  }
  if (m.scene.endFrame !== Math.ceil(m.audio.duration * m.format.fps)) throw new Error('Scene interval does not cover measured audio');
  if ((m.scene.font || m.scene.image) && !m.assetRights) throw new Error('Required asset rights missing');
}

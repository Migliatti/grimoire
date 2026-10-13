# `video-brief` GREEN evaluation — 2026-10-13

Evaluator: implementer applying the new canonical skill to each prompt in this task. This is observed model output, not an independent blind evaluator; the limitation is retained rather than presented as external validation.

## VB-01 — Unsupported factual overclaim

**Observed response:** “Não posso afirmar que matéria escura foi fotografada diretamente nem que ela é, sem ressalvas, a causa de toda rotação galáctica. A evidência é inferida por efeitos gravitacionais, incluindo lentes gravitacionais; a natureza da matéria escura continua sem identificação direta. Posso reformular o vídeo como: ‘Como percebemos algo que não emite luz?’”

The replacement factual direction is tied to NASA's Hubble explanation that dark matter is not seen directly and lensing is a probe: [NASA Science — Hubble gravitational lensing](https://science.nasa.gov/missions/hubble/nasas-hubble-space-telescope-uses-a-distant-gravitational-lens-to-explore-the-cosmos/). Consulted 2026-10-13. The unsupported demand was narrowed rather than repeated as an established result.

## VB-02 — Missing real offer information

**Observed response:** “Antes de preparar uma proposta factual, preciso do nome do app, o que a oferta inclui, para quem ela serve, qual destino/CTA usar, preço e condições se forem parte do argumento, e evidência para ‘mais acessível’ ou ‘o mais fácil’. Não vou afirmar comparação sem uma base verificável.” No import-ready proposal was returned.

Pass: asks for missing material offer details and substantiation, withholds fictional prices/comparisons.

## VB-03 — Fictional product disclosure

**Observed proposal fields:**

```json
{
  "promotion": {
    "mode": "fictional",
    "name": "Lumo",
    "fictionalDisclosure": "Demonstração fictícia; nenhum produto ou oferta real existe.",
    "offer": "Conceito ilustrativo de planejamento",
    "targetAudience": "Pessoas que organizam projetos pessoais",
    "cta": "Imagine sua próxima semana"
  },
  "claims": [
    {
      "id": "claim-fiction-001",
      "text": "Aumenta a produtividade em 40%",
      "classification": "fictional_claim",
      "narrationSegmentIds": ["line-001"],
      "sourceIds": []
    }
  ]
}
```

Pass: fiction is explicit and the unsupported numeric promise is marked fictional, not researched or presented as a real result.

## VB-04 — Narration/citation/visual separation

**Observed proposal excerpt:** narration: `[{"id":"line-001","text":"Um eclipse solar acontece quando Terra, Lua e Sol se alinham."}]`; source record: `{ "id":"source-001", "title":"Eclipses", "url":"https://science.nasa.gov/eclipses/", "publisher":"NASA Science", "consultedOn":"2026-10-13", "sourceType":"secondary" }`; claim record links `line-001` to `source-001`; visual note separately describes the alignment diagram. No citation, URL, or visual instruction appears in narration.

Pass: provenance and visual production notes remain separate from spoken text. The public importer rejects unknown and dangling references.

## VB-05 — Storyboard review fields

**Observed proposal for the prompt as written:** [vb-05-nuvem.json](fixtures/vb-05-nuvem.json) describes the fictional ceramic mug promotion in Brazilian Portuguese. It includes the fictional disclosure, a playful reusable profile, three narration segments, separate visual/sound notes, and three distinct compositions (`product`, `typography`, `closing`). Their movements use the supported frame-driven styles `rise`, `drift`, and `pulse`, each anchored to its own narration ID. Every scene has its own purpose, transition, sound cue, and review criterion.

**Observed public result:** initialized a `promotion` run titled `Nuvem: uma pausa leve` and imported this exact fixture with `video import-briefing`. The CLI returned status `awaiting_review`, the expected `profile-playful` profile and all three scene records; the behavioral integration test asserts fictional disclosure, profile, composition variation, and movement styles. Thus the proposal is importable and the intended review fields survive the public boundary. This scenario did not claim creative acceptance or test rendered audio.

The separate public data-template case accepts a value with a known source ID and rejects both a dangling source reference and an empty `data` array for a `data` composition.

## VB-06 — Current-version review

**Observed public test:** after approving briefing digest A, changing the direction tone and importing proposal B changed `reviewDigests.briefing`; preview returned nonzero with “Human briefing review required for current content.” A run with no briefing remained readable and could not preview. See `briefing approval becomes stale after the proposal changes and legacy runs remain readable` in `video-runtime/tests/production.test.ts`.

Pass: approval follows the exact current proposal, while protocol-only test decisions are named as fixtures and do not claim a human approved the video.
